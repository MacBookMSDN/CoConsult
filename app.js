// =========================================================
// CoConsult v3.1 (Final Prototype) — Complete Workflow Engine
// Implemented: 3-view UI, trilingual i18n, preliminary doctor
//   feedback & searchable EHR orders, tiered privacy Q&A with
//   clinician audit/correction, diagnosis reconciliation,
//   clinician-gated Shared Display, accessibility mode, and
//   Option B (Default Simulated + Optional BYOK Live API with
//   cross-stage clinical context memory).
// =========================================================

const appState = {
  lang: "en",
  // Option B: AI Engine Config (API key kept in volatile memory ONLY)
  apiConfig: {
    mode: "simulated", // "simulated" | "live"
    endpoint: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o-mini",
    apiKey: "",
  },
  // Pre-Visit
  patientSymptoms: "",
  aiCaseType: null,
  livePreVisitHTML: null,
  preVisitUsedLive: false,
  shareAIWithDoctor: true,
  submittedToDoctor: false,
  lastFeedbackKey: null,
  // Clinician Preliminary Impression & Orders
  prelimNoteEdited: false,
  confirmedPrelimNote: "",
  confirmedPrelimIsDefault: true,
  selectedOrders: [{ id: "lft" }, { id: "abd_us" }],
  ordersConfirmed: false,
  // Lab Upload & Tiered-Privacy Q&A with Clinician Audit
  labLoaded: false,
  labIsSample: false,
  labFileName: "",
  labAnalysed: false,
  nextQaId: 1,
  qaLog: [], // [{ id, question, answerKey, liveAnswerText, isLive }]
  selectedQuestionIds: [], // array of qaLog item IDs opted in by patient
  questionAudits: {}, // { [qaId]: { status: "unreviewed"|"accurate"|"corrected", doctorNote: "" } }
  shareQuestionsWithDoctor: false, // unchecked by default for shy patients
  labSentToDoctor: false,
  // Final Diagnosis & Shared Display Gate
  doctorDecision: "override", // "agree" | "override"
  customDiagnosisEdited: false,
  carePlanEdited: false,
  sharedApproved: false,
  approvedSnapshot: null,
  reconcileExplainerOpen: false,
  reconcileLiveText: null,
  reconcileLoading: false,
  accessibleMode: false,
};

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getLanguageName(lang) {
  if (lang === "zh") return "Simplified Chinese (简体中文)";
  if (lang === "it") return "Italian (Italiano)";
  return "English";
}

function getOrderLabel(orderObj, lang) {
  if (orderObj.id) {
    const found = TEST_CATALOG.find((item) => item.id === orderObj.id);
    if (found) return found[lang];
  }
  return orderObj.customText || "";
}

function getQaAnswerHTML(entry, lang) {
  if (entry.isLive && entry.liveAnswerText) {
    return escapeHTML(entry.liveAnswerText).replace(/\n/g, "<br>");
  }
  return TRANSLATIONS[lang].qaAnswers[entry.answerKey];
}

// ---------------------------------------------------------
// 1. Cross-Stage Context Memory Builder & Live API Client
// ---------------------------------------------------------
function buildClinicalContextSnapshot() {
  const lines = [];
  lines.push(`Interface Language: ${getLanguageName(appState.lang)}`);

  if (appState.patientSymptoms) {
    lines.push(`Patient Symptoms: ${appState.patientSymptoms}`);
  } else {
    lines.push("Patient Symptoms: (Not entered yet)");
  }

  if (appState.ordersConfirmed) {
    const orderNames = appState.selectedOrders
      .map((o) => getOrderLabel(o, appState.lang))
      .join(", ");
    const prelim = appState.confirmedPrelimIsDefault
      ? TRANSLATIONS[appState.lang].defaultPrelimNote
      : appState.confirmedPrelimNote;
    lines.push(`Doctor Preliminary Impression: ${prelim}`);
    lines.push(`Ordered Tests: ${orderNames}`);
  }

  if (appState.labAnalysed) {
    lines.push(
      `Uploaded Lab/Scan Report (${appState.labFileName || "Sample Liver Panel"}): ALT 118 U/L (High, ref 7-56), AST 74 U/L (High, ref 10-40), Total Bilirubin 14 µmol/L (Normal, ref 3-20). Abdominal Ultrasound: mildly increased liver echogenicity, no masses or gallstones. AI Preliminary Draft: Mild Non-Alcoholic Fatty Liver (NAFLD).`
    );
  } else {
    lines.push("Lab/Scan Report: (Not uploaded/analysed yet)");
  }

  if (appState.approvedSnapshot) {
    const snap = appState.approvedSnapshot;
    const dict = TRANSLATIONS[appState.lang];
    const finalDiag = snap.useDefaultDiag
      ? snap.decision === "agree"
        ? dict.defaultAgreeDiag
        : dict.defaultOverrideDiag
      : snap.customDiagText;
    lines.push(`Doctor Final Decision (${snap.decision.toUpperCase()}): ${finalDiag}`);
    if (snap.decision === "override") {
      const reasons = snap.reasonKeys.map((k) => dict[k]);
      if (snap.customReasonText) reasons.push(snap.customReasonText);
      lines.push(`Doctor Clinical Factors: ${reasons.join("; ")}`);
    }
  }

  return lines.join("\n\n");
}

function isLiveApiEnabled() {
  return (
    appState.apiConfig.mode === "live" &&
    appState.apiConfig.apiKey.trim().length > 0 &&
    appState.apiConfig.endpoint.trim().length > 0
  );
}

async function callLiveLLM(systemPrompt, userPrompt) {
  const { endpoint, model, apiKey } = appState.apiConfig;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from API");
  return content.trim();
}

// ---------------------------------------------------------
// 2. Trilingual i18n Engine (EN / 中文 / IT)
// ---------------------------------------------------------
const langButtons = document.querySelectorAll(".lang-btn");
const symptomInput = document.getElementById("symptom-input");
const qaInput = document.getElementById("qa-input");
const orderSearchInput = document.getElementById("order-search-input");
const docPrelimNote = document.getElementById("doc-prelim-note");
const docCustomDiagnosis = document.getElementById("doc-custom-diagnosis");
const docCustomReason = document.getElementById("doc-custom-reason");
const docCarePlan = document.getElementById("doc-care-plan");
const apiKeyInput = document.getElementById("api-key-input");

function updateApiStatusPill() {
  const btn = document.getElementById("btn-api-settings");
  const textEl = document.getElementById("api-status-text");
  const dict = TRANSLATIONS[appState.lang];
  if (isLiveApiEnabled()) {
    btn.classList.remove("simulated");
    btn.classList.add("live");
    textEl.textContent = dict.statusLive;
  } else {
    btn.classList.remove("live");
    btn.classList.add("simulated");
    textEl.textContent = dict.statusSimulated;
  }
}

function applyLanguage(lang) {
  appState.lang = lang;
  document.documentElement.lang = lang;
  const dict = TRANSLATIONS[lang];

  langButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (dict[key]) el.innerHTML = dict[key];
  });

  // Placeholders
  symptomInput.placeholder = dict.symptomPlaceholder;
  qaInput.placeholder = dict.qaPlaceholder;
  orderSearchInput.placeholder = dict.orderSearchPlaceholder;
  docCustomReason.placeholder = dict.customReasonPlaceholder;
  apiKeyInput.placeholder = dict.apiKeyPlaceholder;

  // Keep unedited default clinical notes synced to language
  if (!appState.prelimNoteEdited) {
    docPrelimNote.value = dict.defaultPrelimNote;
  }
  if (!appState.customDiagnosisEdited) {
    docCustomDiagnosis.value = dict.defaultOverrideDiag;
  }
  if (!appState.carePlanEdited) {
    docCarePlan.value = dict.defaultCarePlan;
  }

  updateApiStatusPill();
  renderQuickOrderChips();
  renderSelectedOrders();

  if (appState.aiCaseType || appState.livePreVisitHTML) {
    renderPreVisitOutput();
  }
  if (appState.lastFeedbackKey) {
    submitFeedback.textContent = dict[appState.lastFeedbackKey];
  }
  if (appState.submittedToDoctor) {
    renderDoctorDashboard();
  }
  if (appState.ordersConfirmed) {
    renderOrderedTestsBanner();
    docOrderFeedback.textContent = dict.docOrderFeedback;
  }
  if (appState.labIsSample) {
    uploadedFileName.textContent = dict.sampleFileLabel;
  }
  if (appState.labAnalysed) {
    labAIBody.innerHTML = dict.labReportHTML;
    renderQAHistory();
    renderSavedQuestions();
  }
  if (appState.labSentToDoctor) {
    labSubmitFeedback.textContent = appState.shareQuestionsWithDoctor
      ? dict.labSentFeedbackShared
      : dict.labSentFeedbackPrivate;
    renderDoctorLabSection();
  }
  if (appState.sharedApproved) {
    docApproveFeedback.textContent = dict.docApproveFeedback;
    renderSharedDisplay();
  }
  updateAccessibleButtonText();
  refreshContextInspector();
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
});

// ---------------------------------------------------------
// 3. Role Navigation Switcher
// ---------------------------------------------------------
const navButtons = document.querySelectorAll(".nav-btn");
const viewSections = document.querySelectorAll(".view-section");

function switchView(targetView) {
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === targetView);
  });
  viewSections.forEach((section) => {
    section.classList.toggle("active", section.id === `view-${targetView}`);
  });
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

// ---------------------------------------------------------
// 4. Option B Modal: AI Engine Config & Context Inspector
// ---------------------------------------------------------
const btnApiSettings = document.getElementById("btn-api-settings");
const apiModal = document.getElementById("api-modal");
const btnCloseApiModal = document.getElementById("btn-close-api-modal");
const modeSimulatedRadio = document.getElementById("mode-simulated");
const modeLiveRadio = document.getElementById("mode-live");
const liveApiFields = document.getElementById("live-api-fields");
const apiEndpointInput = document.getElementById("api-endpoint-input");
const apiModelInput = document.getElementById("api-model-input");
const btnClearApiKey = document.getElementById("btn-clear-api-key");
const btnSaveApiConfig = document.getElementById("btn-save-api-config");
const apiConfigFeedback = document.getElementById("api-config-feedback");
const contextMemoryPreview = document.getElementById("context-memory-preview");

function refreshContextInspector() {
  contextMemoryPreview.textContent = buildClinicalContextSnapshot();
}

function updateModalModeVisibility() {
  liveApiFields.classList.toggle("hidden", !modeLiveRadio.checked);
}

btnApiSettings.addEventListener("click", () => {
  modeLiveRadio.checked = appState.apiConfig.mode === "live";
  modeSimulatedRadio.checked = appState.apiConfig.mode !== "live";
  apiEndpointInput.value = appState.apiConfig.endpoint;
  apiModelInput.value = appState.apiConfig.model;
  apiKeyInput.value = appState.apiConfig.apiKey;
  apiConfigFeedback.classList.add("hidden");
  updateModalModeVisibility();
  refreshContextInspector();
  apiModal.classList.remove("hidden");
});

function closeApiModal() {
  apiModal.classList.add("hidden");
}

btnCloseApiModal.addEventListener("click", closeApiModal);
apiModal.addEventListener("click", (e) => {
  if (e.target === apiModal) closeApiModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !apiModal.classList.contains("hidden")) {
    closeApiModal();
  }
});

modeSimulatedRadio.addEventListener("change", updateModalModeVisibility);
modeLiveRadio.addEventListener("change", updateModalModeVisibility);

btnClearApiKey.addEventListener("click", () => {
  apiKeyInput.value = "";
  appState.apiConfig.apiKey = "";
});

btnSaveApiConfig.addEventListener("click", () => {
  const dict = TRANSLATIONS[appState.lang];
  if (modeLiveRadio.checked) {
    const key = apiKeyInput.value.trim();
    if (!key) {
      alert(dict.apiKeyMissingAlert);
      return;
    }
    appState.apiConfig.mode = "live";
    appState.apiConfig.endpoint =
      apiEndpointInput.value.trim() || "https://api.openai.com/v1/chat/completions";
    appState.apiConfig.model = apiModelInput.value.trim() || "gpt-4o-mini";
    appState.apiConfig.apiKey = key;
    apiConfigFeedback.textContent = dict.apiSavedLive;
  } else {
    appState.apiConfig.mode = "simulated";
    apiConfigFeedback.textContent = dict.apiSavedSim;
  }

  updateApiStatusPill();
  apiConfigFeedback.classList.remove("hidden");
});

// ---------------------------------------------------------
// 5. Simulated AI Service Layer (Offline Fallback)
// ---------------------------------------------------------
function classifySimulatedCase(symptomText) {
  const text = symptomText.toLowerCase();
  const liverKeywords = [
    "abdomen", "liver", "fatigue", "tired", "stomach", "appetite", "painkiller",
    "肝", "累", "乏力", "疲惫", "右上腹", "腹痛", "胃口", "食欲", "熬夜", "止痛药",
    "fegato", "stanco", "stanchezza", "addome", "appetito", "antidolorific", "stomaco",
  ];
  return liverKeywords.some((kw) => text.includes(kw)) ? "liver" : "general";
}

function getSimulatedPreVisitHTML(caseType, lang) {
  const dict = TRANSLATIONS[lang];
  return caseType === "liver" ? dict.aiLiverHTML : dict.aiGeneralHTML;
}

function matchSimulatedQAResponse(questionText) {
  const q = questionText.toLowerCase();
  if (
    ["cancer", "tumor", "serious", "fatal", "die", "癌", "肿瘤", "严重", "绝症", "会不会死", "cancro", "tumore", "grave", "pericoloso"].some(
      (k) => q.includes(k)
    )
  ) {
    return "cancer";
  }
  if (
    ["med", "drug", "pill", "painkiller", "tablet", "paracetamol", "ibuprofen", "药", "止痛", "布洛芬", "吃什么药", "保肝", "farmac", "medic", "antidolorific", "pillol"].some(
      (k) => q.includes(k)
    )
  ) {
    return "meds";
  }
  if (
    ["diet", "food", "eat", "alcohol", "drink", "sleep", "late", "exercise", "吃", "饮食", "忌口", "酒", "喝", "熬夜", "睡眠", "注意", "dieta", "mangiare", "alcol", "sonno", "bere"].some(
      (k) => q.includes(k)
    )
  ) {
    return "lifestyle";
  }
  if (
    ["alt", "ast", "bilirubin", "enzyme", "ultrasound", "scan", "mean", "谷丙", "谷草", "转氨酶", "胆红素", "超声", "片子", "什么意思", "ecografia", "transaminasi", "bilirubina", "significa"].some(
      (k) => q.includes(k)
    )
  ) {
    return "markers";
  }
  return "fallback";
}

// ---------------------------------------------------------
// 6. Patient Pre-Visit Interactions (Simulated + Live API)
// ---------------------------------------------------------
const btnLoadSample = document.getElementById("btn-load-sample");
const btnAskAI = document.getElementById("btn-ask-ai");
const aiLoading = document.getElementById("ai-loading");
const aiPrevisitResult = document.getElementById("ai-previsit-result");
const aiPrevisitBadge = document.getElementById("ai-previsit-badge");
const aiPrevisitFallbackNote = document.getElementById("ai-previsit-fallback-note");
const aiPrevisitBody = document.getElementById("ai-previsit-body");
const shareCheckbox = document.getElementById("share-ai-checkbox");
const btnSendDoctor = document.getElementById("btn-send-doctor");
const submitFeedback = document.getElementById("patient-submit-feedback");

btnLoadSample.addEventListener("click", () => {
  symptomInput.value = TRANSLATIONS[appState.lang].sampleSymptomText;
});

function renderPreVisitOutput() {
  const dict = TRANSLATIONS[appState.lang];
  if (appState.preVisitUsedLive && appState.livePreVisitHTML) {
    aiPrevisitBadge.textContent = dict.badgeAIPrevisitLive;
    aiPrevisitBadge.className = "badge live-badge";
    aiPrevisitBody.innerHTML = appState.livePreVisitHTML;
  } else if (appState.aiCaseType) {
    aiPrevisitBadge.textContent = dict.badgeAIPrevisit;
    aiPrevisitBadge.className = "badge ai-badge";
    aiPrevisitBody.innerHTML = getSimulatedPreVisitHTML(appState.aiCaseType, appState.lang);
  }
}

function formatLivePreVisitCard(rawText) {
  // Attempt to parse structured JSON; fallback to clean escaped bullets
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    const highlights = (parsed.highlights || [])
      .map((h) => `<li><span class="key-term">${escapeHTML(h)}</span></li>`)
      .join("");
    const checks = (parsed.suggestedChecks || [])
      .map((c) => `<li>${escapeHTML(c)}</li>`)
      .join("");
    const urgency = escapeHTML(parsed.urgency || "Discuss with Clinician");

    return `
      <div class="ai-section-block">
        <h4>Key Highlights</h4>
        <ul>
          ${highlights}
          <li>Care Level: <span class="urgency-tag">${urgency}</span></li>
        </ul>
      </div>
      <div class="ai-section-block">
        <h4>Possible Clinical Checks</h4>
        <ul>${checks}</ul>
      </div>
    `;
  } catch {
    return `
      <div class="ai-section-block">
        <h4>AI Pre-Visit Notes</h4>
        <p>${escapeHTML(rawText).replace(/\n/g, "<br>")}</p>
      </div>
    `;
  }
}

btnAskAI.addEventListener("click", async () => {
  const text = symptomInput.value.trim();
  const dict = TRANSLATIONS[appState.lang];
  if (!text) {
    alert(dict.alertEmptySymptom);
    return;
  }

  aiPrevisitResult.classList.add("hidden");
  aiPrevisitFallbackNote.classList.add("hidden");
  submitFeedback.classList.add("hidden");
  aiLoading.classList.remove("hidden");

  appState.patientSymptoms = text;
  appState.aiCaseType = classifySimulatedCase(text);

  if (isLiveApiEnabled()) {
    try {
      const sysPrompt = `You are CoConsult, a transparent medical consultation assistant. NEVER give a final diagnosis. Reply ONLY in valid JSON using ${getLanguageName(appState.lang)} with keys: "highlights" (array of 2-3 short symptom phrases), "urgency" (short care level string), and "suggestedChecks" (array of 2-3 possible diagnostic checks a doctor might consider). Keep concise.`;
      const reply = await callLiveLLM(sysPrompt, `Patient symptoms: ${text}`);
      appState.livePreVisitHTML = formatLivePreVisitCard(reply);
      appState.preVisitUsedLive = true;
    } catch {
      appState.livePreVisitHTML = null;
      appState.preVisitUsedLive = false;
      aiPrevisitFallbackNote.textContent = dict.apiFallbackNotice;
      aiPrevisitFallbackNote.classList.remove("hidden");
    }
    renderPreVisitOutput();
    aiLoading.classList.add("hidden");
    aiPrevisitResult.classList.remove("hidden");
    refreshContextInspector();
  } else {
    setTimeout(() => {
      appState.livePreVisitHTML = null;
      appState.preVisitUsedLive = false;
      renderPreVisitOutput();
      aiLoading.classList.add("hidden");
      aiPrevisitResult.classList.remove("hidden");
      refreshContextInspector();
    }, 450);
  }
});

btnSendDoctor.addEventListener("click", () => {
  appState.shareAIWithDoctor = shareCheckbox.checked;
  appState.submittedToDoctor = true;
  appState.lastFeedbackKey = appState.shareAIWithDoctor
    ? "feedbackShared"
    : "feedbackPrivate";

  renderDoctorDashboard();
  submitFeedback.textContent = TRANSLATIONS[appState.lang][appState.lastFeedbackKey];
  submitFeedback.classList.remove("hidden");
});

// ---------------------------------------------------------
// 7. Doctor Preliminary Feedback & Searchable EHR Orders
// ---------------------------------------------------------
const doctorEmptyState = document.getElementById("doctor-empty-state");
const doctorPatientCard = document.getElementById("doctor-patient-card");
const docPatientSymptoms = document.getElementById("doc-patient-symptoms");
const docAISharedBox = document.getElementById("doc-ai-shared-box");
const docAISummaryContent = document.getElementById("doc-ai-summary-content");
const docAIHiddenNotice = document.getElementById("doc-ai-hidden-notice");

const quickOrderChips = document.getElementById("quick-order-chips");
const btnAddCustomOrder = document.getElementById("btn-add-custom-order");
const orderSuggestions = document.getElementById("order-suggestions");
const selectedOrdersContainer = document.getElementById("selected-orders-container");
const btnConfirmOrders = document.getElementById("btn-confirm-orders");
const docOrderFeedback = document.getElementById("doc-order-feedback");
const patientOrdersBanner = document.getElementById("patient-orders-banner");
const patientPrelimFeedbackWrap = document.getElementById("patient-prelim-feedback-wrap");
const patientPrelimFeedbackText = document.getElementById("patient-prelim-feedback-text");
const patientOrdersList = document.getElementById("patient-orders-list");

docPrelimNote.addEventListener("input", () => {
  appState.prelimNoteEdited = true;
});

function renderDoctorDashboard() {
  if (!appState.submittedToDoctor) return;

  doctorEmptyState.classList.add("hidden");
  doctorPatientCard.classList.remove("hidden");
  docPatientSymptoms.textContent = appState.patientSymptoms;

  if (appState.shareAIWithDoctor && (appState.aiCaseType || appState.livePreVisitHTML)) {
    docAISummaryContent.innerHTML =
      appState.preVisitUsedLive && appState.livePreVisitHTML
        ? appState.livePreVisitHTML
        : getSimulatedPreVisitHTML(appState.aiCaseType, appState.lang);
    docAISharedBox.classList.remove("hidden");
    docAIHiddenNotice.classList.add("hidden");
  } else {
    docAISharedBox.classList.add("hidden");
    docAIHiddenNotice.classList.remove("hidden");
  }
}

function addOrderItem(orderObj) {
  const exists = appState.selectedOrders.some((o) =>
    orderObj.id
      ? o.id === orderObj.id
      : !o.id && o.customText.toLowerCase() === orderObj.customText.toLowerCase()
  );
  if (!exists) {
    appState.selectedOrders.push(orderObj);
    renderSelectedOrders();
  }
}

function renderQuickOrderChips() {
  quickOrderChips.innerHTML = QUICK_ORDER_IDS.map((id) => {
    const item = TEST_CATALOG.find((t) => t.id === id);
    return `<button type="button" class="quick-chip" data-quick-id="${id}">+ ${escapeHTML(item[appState.lang])}</button>`;
  }).join("");
}

quickOrderChips.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-quick-id]");
  if (!btn) return;
  addOrderItem({ id: btn.dataset.quickId });
});

function renderSelectedOrders() {
  if (appState.selectedOrders.length === 0) {
    selectedOrdersContainer.innerHTML = `<span class="tags-empty-hint">${escapeHTML(TRANSLATIONS[appState.lang].noOrdersYet)}</span>`;
    return;
  }

  selectedOrdersContainer.innerHTML = appState.selectedOrders
    .map((orderObj, idx) => {
      const label = getOrderLabel(orderObj, appState.lang);
      return `
        <span class="order-tag">
          ${escapeHTML(label)}
          <button type="button" data-remove-order="${idx}" aria-label="Remove">×</button>
        </span>
      `;
    })
    .join("");
}

selectedOrdersContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove-order]");
  if (!btn) return;
  appState.selectedOrders.splice(Number(btn.dataset.removeOrder), 1);
  renderSelectedOrders();
});

function updateOrderSuggestions() {
  const query = orderSearchInput.value.trim().toLowerCase();
  if (!query) {
    orderSuggestions.classList.add("hidden");
    return;
  }

  const matches = TEST_CATALOG.filter((item) => {
    const haystack = `${item.en} ${item.zh} ${item.it} ${item.keywords}`.toLowerCase();
    return haystack.includes(query);
  });

  if (matches.length === 0) {
    orderSuggestions.classList.add("hidden");
    return;
  }

  orderSuggestions.innerHTML = matches
    .slice(0, 8)
    .map(
      (item) => `
      <div class="suggestion-item" data-suggest-id="${item.id}">
        <span>${escapeHTML(item[appState.lang])}</span>
        <span class="suggestion-cat">${escapeHTML(item.cat[appState.lang])}</span>
      </div>
    `
    )
    .join("");
  orderSuggestions.classList.remove("hidden");
}

orderSearchInput.addEventListener("input", updateOrderSuggestions);
orderSearchInput.addEventListener("focus", updateOrderSuggestions);

orderSuggestions.addEventListener("click", (e) => {
  const itemEl = e.target.closest("[data-suggest-id]");
  if (!itemEl) return;
  addOrderItem({ id: itemEl.dataset.suggestId });
  orderSearchInput.value = "";
  orderSuggestions.classList.add("hidden");
});

function addCustomTypedOrder() {
  const raw = orderSearchInput.value.trim();
  if (!raw) return;

  const exact = TEST_CATALOG.find(
    (t) =>
      t.en.toLowerCase() === raw.toLowerCase() ||
      t.zh.toLowerCase() === raw.toLowerCase() ||
      t.it.toLowerCase() === raw.toLowerCase()
  );

  if (exact) {
    addOrderItem({ id: exact.id });
  } else {
    addOrderItem({ id: null, customText: raw });
  }
  orderSearchInput.value = "";
  orderSuggestions.classList.add("hidden");
}

btnAddCustomOrder.addEventListener("click", addCustomTypedOrder);
orderSearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addCustomTypedOrder();
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-order-wrap")) {
    orderSuggestions.classList.add("hidden");
  }
});

function renderOrderedTestsBanner() {
  if (!appState.ordersConfirmed || appState.selectedOrders.length === 0) return;
  const dict = TRANSLATIONS[appState.lang];
  const prelimText = appState.confirmedPrelimIsDefault
    ? dict.defaultPrelimNote
    : appState.confirmedPrelimNote;

  if (prelimText) {
    patientPrelimFeedbackText.textContent = prelimText;
    patientPrelimFeedbackWrap.classList.remove("hidden");
  } else {
    patientPrelimFeedbackWrap.classList.add("hidden");
  }

  patientOrdersList.innerHTML = appState.selectedOrders
    .map((o) => `<li>${escapeHTML(getOrderLabel(o, appState.lang))}</li>`)
    .join("");
  patientOrdersBanner.classList.remove("hidden");
}

btnConfirmOrders.addEventListener("click", () => {
  if (appState.selectedOrders.length === 0) {
    alert(TRANSLATIONS[appState.lang].alertNoOrder);
    return;
  }
  appState.confirmedPrelimIsDefault = !appState.prelimNoteEdited;
  appState.confirmedPrelimNote = docPrelimNote.value.trim();
  appState.ordersConfirmed = true;
  renderOrderedTestsBanner();
  docOrderFeedback.textContent = TRANSLATIONS[appState.lang].docOrderFeedback;
  docOrderFeedback.classList.remove("hidden");
  refreshContextInspector();
});

// ---------------------------------------------------------
// 8. Patient Lab Upload, AI Explainer & Tiered-Privacy Q&A
// ---------------------------------------------------------
const labFileInput = document.getElementById("lab-file-input");
const btnLoadSampleLab = document.getElementById("btn-load-sample-lab");
const btnAnalyseLab = document.getElementById("btn-analyse-lab");
const uploadedFilePreview = document.getElementById("uploaded-file-preview");
const uploadedFileName = document.getElementById("uploaded-file-name");
const uploadedImageThumb = document.getElementById("uploaded-image-thumb");
const labAILoading = document.getElementById("lab-ai-loading");
const labAIResult = document.getElementById("lab-ai-result");
const labAIBody = document.getElementById("lab-ai-body");

const btnQASend = document.getElementById("btn-qa-send");
const qaLoading = document.getElementById("qa-loading");
const qaHistory = document.getElementById("qa-history");
const doctorQuestionsBox = document.getElementById("doctor-questions-box");
const doctorQuestionsList = document.getElementById("doctor-questions-list");
const shareQuestionsCheckbox = document.getElementById("share-questions-checkbox");
const btnSendLabDoctor = document.getElementById("btn-send-lab-doctor");
const labSubmitFeedback = document.getElementById("lab-submit-feedback");

labFileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  appState.labLoaded = true;
  appState.labIsSample = false;
  appState.labFileName = file.name;

  uploadedFileName.textContent = `📎 ${file.name}`;
  uploadedFilePreview.classList.remove("hidden");

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageThumb.src = e.target.result;
      uploadedImageThumb.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  } else {
    uploadedImageThumb.classList.add("hidden");
  }
});

btnLoadSampleLab.addEventListener("click", () => {
  appState.labLoaded = true;
  appState.labIsSample = true;
  appState.labFileName = "Liver_Function_Panel_and_Ultrasound.pdf";
  uploadedFileName.textContent = TRANSLATIONS[appState.lang].sampleFileLabel;
  uploadedImageThumb.classList.add("hidden");
  uploadedFilePreview.classList.remove("hidden");
});

btnAnalyseLab.addEventListener("click", () => {
  if (!appState.labLoaded) {
    alert(TRANSLATIONS[appState.lang].alertNoLab);
    return;
  }

  labAIResult.classList.add("hidden");
  labAILoading.classList.remove("hidden");

  setTimeout(() => {
    appState.labAnalysed = true;
    labAIBody.innerHTML = TRANSLATIONS[appState.lang].labReportHTML;
    labAILoading.classList.add("hidden");
    labAIResult.classList.remove("hidden");
    refreshContextInspector();
  }, 500);
});

function renderQAHistory() {
  const dict = TRANSLATIONS[appState.lang];
  qaHistory.innerHTML = appState.qaLog
    .map((entry) => {
      const isSelected = appState.selectedQuestionIds.includes(entry.id);
      let btnClass = "btn-small";
      let btnText = dict.btnAddToDoctorList;
      if (isSelected) {
        btnClass = "btn-small added";
        btnText = dict.btnAddedToDoctorList;
      } else if (!entry.isLive && entry.answerKey === "fallback") {
        btnClass = "btn-small suggested";
        btnText = dict.btnSuggestedAdd;
      }

      const sourceBadge = entry.isLive
        ? `<span class="badge live-badge">${escapeHTML(dict.badgeLiveAnswer)}</span>`
        : `<span class="badge ai-badge">${escapeHTML(dict.badgeSimAnswer)}</span>`;

      return `
        <div class="qa-item">
          <div class="qa-user-q">
            <span>Q: ${escapeHTML(entry.question)}</span>
            ${sourceBadge}
          </div>
          <div class="qa-ai-a">${getQaAnswerHTML(entry, appState.lang)}</div>
          <div class="qa-item-actions">
            <button type="button" class="${btnClass}" data-toggle-qa-id="${entry.id}">${escapeHTML(btnText)}</button>
          </div>
        </div>
      `;
    })
    .join("");
}

qaHistory.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-toggle-qa-id]");
  if (!btn) return;
  const qaId = Number(btn.dataset.toggleQaId);

  const existingIdx = appState.selectedQuestionIds.indexOf(qaId);
  if (existingIdx >= 0) {
    appState.selectedQuestionIds.splice(existingIdx, 1);
  } else {
    appState.selectedQuestionIds.push(qaId);
    if (!appState.questionAudits[qaId]) {
      appState.questionAudits[qaId] = { status: "unreviewed", doctorNote: "" };
    }
  }
  renderQAHistory();
  renderSavedQuestions();
});

function renderSavedQuestions() {
  const dict = TRANSLATIONS[appState.lang];
  const selectedEntries = appState.selectedQuestionIds
    .map((id) => appState.qaLog.find((item) => item.id === id))
    .filter(Boolean);

  if (selectedEntries.length === 0) {
    doctorQuestionsBox.classList.add("hidden");
    return;
  }

  doctorQuestionsList.innerHTML = selectedEntries
    .map(
      (entry) => `
      <li>
        <span>${escapeHTML(entry.question)}</span>
        <button type="button" class="btn-small" data-remove-saved-id="${entry.id}">${escapeHTML(dict.btnRemoveItem)}</button>
      </li>
    `
    )
    .join("");
  doctorQuestionsBox.classList.remove("hidden");
}

doctorQuestionsList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove-saved-id]");
  if (!btn) return;
  const qaId = Number(btn.dataset.removeSavedId);
  appState.selectedQuestionIds = appState.selectedQuestionIds.filter((id) => id !== qaId);
  renderQAHistory();
  renderSavedQuestions();
});

async function handleQASubmit() {
  const question = qaInput.value.trim();
  const dict = TRANSLATIONS[appState.lang];
  if (!question) {
    alert(dict.alertEmptyQA);
    return;
  }

  qaInput.value = "";
  const qaId = appState.nextQaId++;
  const fallbackKey = matchSimulatedQAResponse(question);

  if (isLiveApiEnabled()) {
    qaLoading.classList.remove("hidden");
    try {
      const context = buildClinicalContextSnapshot();
      const sysPrompt = `You are CoConsult, a plain-language clinical explanation assistant. Reply concisely (2-4 short sentences) in ${getLanguageName(appState.lang)}. Always ground your answer in the patient's clinical context below (including uploaded lab results). Never give a definitive diagnosis or prescribe medication; encourage discussing personalised decisions with their doctor.\n\nCLINICAL CONTEXT:\n${context}`;
      const liveText = await callLiveLLM(sysPrompt, question);
      appState.qaLog.push({
        id: qaId,
        question,
        answerKey: fallbackKey,
        liveAnswerText: liveText,
        isLive: true,
      });
    } catch {
      appState.qaLog.push({
        id: qaId,
        question,
        answerKey: fallbackKey,
        liveAnswerText: null,
        isLive: false,
      });
    } finally {
      qaLoading.classList.add("hidden");
    }
  } else {
    appState.qaLog.push({
      id: qaId,
      question,
      answerKey: fallbackKey,
      liveAnswerText: null,
      isLive: false,
    });
  }

  renderQAHistory();
}

btnQASend.addEventListener("click", handleQASubmit);
qaInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleQASubmit();
  }
});

// ---------------------------------------------------------
// 9. Doctor Lab View & Clinician Q&A Audit / Correction
// ---------------------------------------------------------
const docLabEmpty = document.getElementById("doc-lab-empty");
const docLabContent = document.getElementById("doc-lab-content");
const docLabSummaryBody = document.getElementById("doc-lab-summary-body");
const docQuestionsPrivateNotice = document.getElementById("doc-questions-private-notice");
const docQuestionsSharedWrap = document.getElementById("doc-questions-shared-wrap");
const docNoQuestions = document.getElementById("doc-no-questions");
const docQuestionsAuditList = document.getElementById("doc-questions-audit-list");
const docFinalEmpty = document.getElementById("doc-final-empty");
const docFinalControls = document.getElementById("doc-final-controls");

function renderDoctorAuditList() {
  const dict = TRANSLATIONS[appState.lang];
  const entries = appState.selectedQuestionIds
    .map((id) => appState.qaLog.find((item) => item.id === id))
    .filter(Boolean);

  if (entries.length === 0) {
    docNoQuestions.classList.remove("hidden");
    docQuestionsAuditList.classList.add("hidden");
    return;
  }

  docNoQuestions.classList.add("hidden");
  docQuestionsAuditList.classList.remove("hidden");

  docQuestionsAuditList.innerHTML = entries
    .map((entry) => {
      const audit = appState.questionAudits[entry.id] || {
        status: "unreviewed",
        doctorNote: "",
      };
      const statusClass =
        audit.status === "accurate"
          ? "status-accurate"
          : audit.status === "corrected"
          ? "status-corrected"
          : "";
      const aiSourceTag = entry.isLive ? dict.badgeLiveAnswer : dict.badgeSimAnswer;

      return `
        <div class="audit-card ${statusClass}" data-audit-card-id="${entry.id}">
          <div class="qa-user-q">
            <span>Q: ${escapeHTML(entry.question)}</span>
            <span class="badge ${entry.isLive ? "live-badge" : "ai-badge"}">${escapeHTML(aiSourceTag)}</span>
          </div>
          <div class="audit-ai-box">
            <small><strong>${escapeHTML(dict.auditAIReplyLabel)}</strong></small>
            <div style="margin-top:4px;">${getQaAnswerHTML(entry, appState.lang)}</div>
          </div>
          <div class="audit-controls-row">
            <button type="button" class="btn-small audit-ok ${audit.status === "accurate" ? "active" : ""}" data-audit-action="accurate" data-qa-id="${entry.id}">
              ${escapeHTML(dict.btnAuditAccurate)}
            </button>
            <button type="button" class="btn-small audit-fix ${audit.status === "corrected" ? "active" : ""}" data-audit-action="corrected" data-qa-id="${entry.id}">
              ${escapeHTML(dict.btnAuditCorrect)}
            </button>
          </div>
          <textarea rows="2" class="audit-note-input" data-audit-note-id="${entry.id}" placeholder="${escapeHTML(dict.auditNotePlaceholder)}">${escapeHTML(audit.doctorNote)}</textarea>
        </div>
      `;
    })
    .join("");
}

docQuestionsAuditList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-audit-action]");
  if (!btn) return;
  const qaId = Number(btn.dataset.qaId);
  const action = btn.dataset.auditAction;

  if (!appState.questionAudits[qaId]) {
    appState.questionAudits[qaId] = { status: "unreviewed", doctorNote: "" };
  }
  appState.questionAudits[qaId].status = action;
  renderDoctorAuditList();
});

docQuestionsAuditList.addEventListener("input", (e) => {
  const textarea = e.target.closest("[data-audit-note-id]");
  if (!textarea) return;
  const qaId = Number(textarea.dataset.auditNoteId);
  if (!appState.questionAudits[qaId]) {
    appState.questionAudits[qaId] = { status: "unreviewed", doctorNote: "" };
  }
  appState.questionAudits[qaId].doctorNote = textarea.value;
});

function renderDoctorLabSection() {
  if (!appState.labSentToDoctor) return;

  docLabEmpty.classList.add("hidden");
  docLabContent.classList.remove("hidden");
  docLabSummaryBody.innerHTML = TRANSLATIONS[appState.lang].labReportHTML;

  docFinalEmpty.classList.add("hidden");
  docFinalControls.classList.remove("hidden");

  if (!appState.shareQuestionsWithDoctor) {
    docQuestionsPrivateNotice.classList.remove("hidden");
    docQuestionsSharedWrap.classList.add("hidden");
  } else {
    docQuestionsPrivateNotice.classList.add("hidden");
    docQuestionsSharedWrap.classList.remove("hidden");
    renderDoctorAuditList();
  }
}

btnSendLabDoctor.addEventListener("click", () => {
  appState.shareQuestionsWithDoctor = shareQuestionsCheckbox.checked;
  appState.labSentToDoctor = true;
  renderDoctorLabSection();

  const dict = TRANSLATIONS[appState.lang];
  labSubmitFeedback.textContent = appState.shareQuestionsWithDoctor
    ? dict.labSentFeedbackShared
    : dict.labSentFeedbackPrivate;
  labSubmitFeedback.classList.remove("hidden");
});

// ---------------------------------------------------------
// 10. Doctor Final Diagnosis, Override & Shared Screen Gate
// ---------------------------------------------------------
const decisionAgree = document.getElementById("decision-agree");
const decisionOverride = document.getElementById("decision-override");
const overridePanel = document.getElementById("override-panel");
const reasonMeds = document.getElementById("reason-meds");
const reasonExam = document.getElementById("reason-exam");
const reasonLifestyle = document.getElementById("reason-lifestyle");
const reasonHistory = document.getElementById("reason-history");
const btnApproveShared = document.getElementById("btn-approve-shared");
const btnRevokeShared = document.getElementById("btn-revoke-shared");
const docApproveFeedback = document.getElementById("doc-approve-feedback");

docCustomDiagnosis.addEventListener("input", () => {
  appState.customDiagnosisEdited = true;
});
docCarePlan.addEventListener("input", () => {
  appState.carePlanEdited = true;
});

function updateDecisionUI() {
  appState.doctorDecision = decisionOverride.checked ? "override" : "agree";
  overridePanel.classList.toggle("hidden", appState.doctorDecision !== "override");
}

decisionAgree.addEventListener("change", updateDecisionUI);
decisionOverride.addEventListener("change", updateDecisionUI);

btnApproveShared.addEventListener("click", () => {
  const dict = TRANSLATIONS[appState.lang];
  const decision = decisionOverride.checked ? "override" : "agree";
  const customDiagText = docCustomDiagnosis.value.trim();

  if (decision === "override" && !customDiagText) {
    alert(dict.alertEmptyDiag);
    return;
  }

  const reasonKeys = [];
  if (reasonMeds.checked) reasonKeys.push("reasonMeds");
  if (reasonExam.checked) reasonKeys.push("reasonExam");
  if (reasonLifestyle.checked) reasonKeys.push("reasonLifestyle");
  if (reasonHistory.checked) reasonKeys.push("reasonHistory");

  // Capture audited Q&A items if patient opted in to share
  const auditedQA = appState.shareQuestionsWithDoctor
    ? appState.selectedQuestionIds
        .map((id) => {
          const entry = appState.qaLog.find((item) => item.id === id);
          if (!entry) return null;
          const audit = appState.questionAudits[id] || {
            status: "unreviewed",
            doctorNote: "",
          };
          return {
            entry,
            status: audit.status,
            doctorNote: audit.doctorNote.trim(),
          };
        })
        .filter(Boolean)
    : [];

  appState.approvedSnapshot = {
    decision,
    useDefaultDiag: decision === "agree" || !appState.customDiagnosisEdited,
    customDiagText,
    reasonKeys,
    customReasonText: docCustomReason.value.trim(),
    useDefaultPlan: !appState.carePlanEdited,
    customPlanText: docCarePlan.value.trim(),
    auditedQA,
  };

  appState.sharedApproved = true;
  appState.reconcileExplainerOpen = false;
  appState.reconcileLiveText = null;
  renderSharedDisplay();
  refreshContextInspector();

  btnRevokeShared.classList.remove("hidden");
  docApproveFeedback.textContent = dict.docApproveFeedback;
  docApproveFeedback.classList.remove("hidden");
});

btnRevokeShared.addEventListener("click", () => {
  appState.sharedApproved = false;
  appState.approvedSnapshot = null;
  appState.reconcileLiveText = null;
  renderSharedDisplay();
  refreshContextInspector();

  btnRevokeShared.classList.add("hidden");
  docApproveFeedback.textContent = TRANSLATIONS[appState.lang].docRevokeFeedback;
  docApproveFeedback.classList.remove("hidden");
});

// ---------------------------------------------------------
// 11. Shared Consultation Display & Accessibility Mode
// ---------------------------------------------------------
const sharedLockedState = document.getElementById("shared-locked-state");
const sharedUnlockedState = document.getElementById("shared-unlocked-state");
const sharedContentWrapper = document.getElementById("shared-content-wrapper");
const btnToggleAccessible = document.getElementById("btn-toggle-accessible");
const sharedFinalDiagnosis = document.getElementById("shared-final-diagnosis");
const sharedCarePlan = document.getElementById("shared-care-plan");
const sharedReconciliationBox = document.getElementById("shared-reconciliation-box");
const sharedLabSummary = document.getElementById("shared-lab-summary");
const sharedQuestionsCard = document.getElementById("shared-questions-card");
const sharedQuestionsList = document.getElementById("shared-questions-list");

function updateAccessibleButtonText() {
  const dict = TRANSLATIONS[appState.lang];
  btnToggleAccessible.textContent = appState.accessibleMode
    ? dict.btnAccessibleOff
    : dict.btnAccessibleOn;
  btnToggleAccessible.classList.toggle("active", appState.accessibleMode);
  sharedContentWrapper.classList.toggle("accessible-mode", appState.accessibleMode);
}

btnToggleAccessible.addEventListener("click", () => {
  appState.accessibleMode = !appState.accessibleMode;
  updateAccessibleButtonText();
});

function renderSharedDisplay() {
  if (!appState.sharedApproved || !appState.approvedSnapshot) {
    sharedLockedState.classList.remove("hidden");
    sharedUnlockedState.classList.add("hidden");
    return;
  }

  sharedLockedState.classList.add("hidden");
  sharedUnlockedState.classList.remove("hidden");

  const dict = TRANSLATIONS[appState.lang];
  const snap = appState.approvedSnapshot;

  // 1. Final Diagnosis & Care Plan
  const finalDiagDisplay = snap.useDefaultDiag
    ? snap.decision === "agree"
      ? dict.defaultAgreeDiag
      : dict.defaultOverrideDiag
    : snap.customDiagText;

  sharedFinalDiagnosis.textContent = finalDiagDisplay;
  sharedCarePlan.textContent = snap.useDefaultPlan
    ? dict.defaultCarePlan
    : snap.customPlanText || dict.defaultCarePlan;

  // 2. Alignment vs. Override Reconciliation
  if (snap.decision === "agree") {
    sharedReconciliationBox.className = "card reconcile-aligned";
    sharedReconciliationBox.innerHTML = `
      <h3>${escapeHTML(dict.alignedTitle)}</h3>
      <p class="helper-text">${escapeHTML(dict.alignedDesc)}</p>
    `;
  } else {
    sharedReconciliationBox.className = "card reconcile-override";
    const reasonBullets = snap.reasonKeys
      .map((k) => `<li><strong>${escapeHTML(dict[k])}</strong></li>`)
      .join("");
    const extraBullet = snap.customReasonText
      ? `<li><strong>${escapeHTML(snap.customReasonText)}</strong></li>`
      : "";
    const btnLabel = appState.reconcileExplainerOpen
      ? dict.btnHideWhyDifferent
      : dict.btnWhyDifferent;

    let explanationInner = "";
    if (appState.reconcileLoading) {
      explanationInner = `
        <div class="loading-box" style="margin-top:0;">
          <div class="spinner"></div>
          <span>${escapeHTML(dict.reconcileLoading)}</span>
        </div>
      `;
    } else if (appState.reconcileLiveText) {
      explanationInner = `
        <div class="ai-card-header">
          <span class="badge live-badge">${escapeHTML(dict.reconcileExpHeaderLive)}</span>
        </div>
        <p>${escapeHTML(appState.reconcileLiveText).replace(/\n/g, "<br>")}</p>
      `;
    } else {
      explanationInner = `
        <div class="ai-card-header">
          <span class="badge ai-badge">${escapeHTML(dict.reconcileExpHeader)}</span>
        </div>
        <p>${dict.reconcileExpIntro}</p>
        <ul>
          ${reasonBullets}
          ${extraBullet}
        </ul>
        <p><strong>${escapeHTML(dict.reconcileExpFooter)}</strong></p>
      `;
    }

    sharedReconciliationBox.innerHTML = `
      <h3>${escapeHTML(dict.overrideTitle)}</h3>
      <p class="helper-text">${escapeHTML(dict.overrideIntro)}</p>
      <div class="compare-grid">
        <div class="compare-box ai-side">
          <span class="badge ai-badge">${escapeHTML(dict.compareAILabel)}</span>
          <p><strong>${escapeHTML(dict.compareAIDraftText)}</strong></p>
        </div>
        <div class="compare-box doc-side">
          <span class="badge doctor-verified-badge">${escapeHTML(dict.compareDocLabel)}</span>
          <p><strong>${escapeHTML(finalDiagDisplay)}</strong></p>
        </div>
      </div>
      <button type="button" id="btn-why-different" class="btn primary">${escapeHTML(btnLabel)}</button>
      <div id="reconcile-explanation-body" class="reconcile-explanation ${appState.reconcileExplainerOpen ? "" : "hidden"}">
        ${explanationInner}
      </div>
    `;
  }

  // 3. Plain-Language Lab Summary
  sharedLabSummary.innerHTML = dict.labReportHTML;

  // 4. Audited Patient Discussion Questions (Highlights Doctor Corrections)
  if (snap.auditedQA && snap.auditedQA.length > 0) {
    sharedQuestionsCard.classList.remove("hidden");
    sharedQuestionsList.innerHTML = snap.auditedQA
      .map((item) => {
        const isCorrected = item.status === "corrected";
        const isAccurate = item.status === "accurate";
        const statusBadge = isCorrected
          ? `<span class="badge corrected-badge">${escapeHTML(dict.sharedBadgeCorrected)}</span>`
          : isAccurate
          ? `<span class="badge doctor-verified-badge">${escapeHTML(dict.sharedBadgeAccurate)}</span>`
          : `<span class="badge doctor-badge">${escapeHTML(dict.sharedBadgePending)}</span>`;

        const doctorBox = item.doctorNote
          ? `
            <div class="shared-doctor-correction">
              <strong>${escapeHTML(dict.sharedDoctorReplyTitle)}</strong>
              <p>${escapeHTML(item.doctorNote)}</p>
            </div>
          `
          : "";

        const aiBoxLabel = isCorrected
          ? dict.sharedOriginalAISuperseded
          : dict.auditAIReplyLabel;

        return `
          <div class="audit-card ${isCorrected ? "status-corrected" : isAccurate ? "status-accurate" : ""}">
            <div class="qa-user-q">
              <span>Q: ${escapeHTML(item.entry.question)}</span>
              ${statusBadge}
            </div>
            ${doctorBox}
            <div class="audit-ai-box ${isCorrected ? "dimmed" : ""}">
              <small><strong>${escapeHTML(aiBoxLabel)}</strong></small>
              <div style="margin-top:4px;">${getQaAnswerHTML(item.entry, appState.lang)}</div>
            </div>
          </div>
        `;
      })
      .join("");
  } else {
    sharedQuestionsCard.classList.add("hidden");
  }
}

sharedReconciliationBox.addEventListener("click", async (e) => {
  if (e.target.id !== "btn-why-different") return;

  appState.reconcileExplainerOpen = !appState.reconcileExplainerOpen;

  // If Live API is enabled and we haven't fetched a tailored live explanation yet
  if (
    appState.reconcileExplainerOpen &&
    isLiveApiEnabled() &&
    !appState.reconcileLiveText
  ) {
    appState.reconcileLoading = true;
    renderSharedDisplay();
    try {
      const context = buildClinicalContextSnapshot();
      const sysPrompt = `You are CoConsult's patient communication assistant. Write a clear, empathetic 3-5 sentence explanation in ${getLanguageName(appState.lang)} explaining why the doctor's final diagnosis is more accurate and trustworthy than the AI's preliminary draft (NAFLD), explicitly referencing the doctor's clinical factors and why isolated lab numbers miss individual context.\n\nCLINICAL CONTEXT:\n${context}`;
      appState.reconcileLiveText = await callLiveLLM(
        sysPrompt,
        "Why does the doctor's diagnosis differ from the AI draft?"
      );
    } catch {
      appState.reconcileLiveText = null;
    } finally {
      appState.reconcileLoading = false;
    }
  }

  renderSharedDisplay();
});

// Initialize default language (English)
applyLanguage("en");