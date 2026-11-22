// =========================================================
// CoConsult v3 (Final Prototype) — Complete Workflow Engine
// Implemented: 3-view UI, trilingual i18n, EHR test search,
//   tiered privacy Q&A, doctor agree/override reconciliation,
//   clinician-gated Shared Display, large-text mode.
// Simulated: Pre-visit appraisal, OCR/lab explainer, Q&A,
//   and discordance explanation (API slot reserved).
// =========================================================

const appState = {
  lang: "en",
  // Pre-Visit
  patientSymptoms: "",
  aiCaseType: null,
  shareAIWithDoctor: true,
  submittedToDoctor: false,
  lastFeedbackKey: null,
  // Doctor Searchable Orders: [{ id: string|null, customText?: string }]
  selectedOrders: [
    { id: "lft" },
    { id: "abd_us" },
  ],
  ordersConfirmed: false,
  // Lab Upload & Tiered-Privacy Q&A
  labLoaded: false,
  labIsSample: false,
  labAnalysed: false,
  qaLog: [], // [{ id, question, answerKey }]
  selectedDoctorQuestions: [], // array of question strings opted in by patient
  shareQuestionsWithDoctor: false, // unchecked by default for shy patients
  labSentToDoctor: false,
  // Final Diagnosis & Shared Display Gate
  doctorDecision: "override", // "agree" | "override"
  customDiagnosisEdited: false,
  carePlanEdited: false,
  sharedApproved: false,
  approvedSnapshot: null, // frozen snapshot shown on Shared Display
  reconcileExplainerOpen: false,
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

function getOrderLabel(orderObj, lang) {
  if (orderObj.id) {
    const found = TEST_CATALOG.find((item) => item.id === orderObj.id);
    if (found) return found[lang];
  }
  return orderObj.customText || "";
}

// ---------------------------------------------------------
// 1. Trilingual i18n Engine (EN / 中文 / IT)
// ---------------------------------------------------------
const langButtons = document.querySelectorAll(".lang-btn");
const symptomInput = document.getElementById("symptom-input");
const qaInput = document.getElementById("qa-input");
const orderSearchInput = document.getElementById("order-search-input");
const docCustomDiagnosis = document.getElementById("doc-custom-diagnosis");
const docCustomReason = document.getElementById("doc-custom-reason");
const docCarePlan = document.getElementById("doc-care-plan");

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

  // Update placeholders
  symptomInput.placeholder = dict.symptomPlaceholder;
  qaInput.placeholder = dict.qaPlaceholder;
  orderSearchInput.placeholder = dict.orderSearchPlaceholder;
  docCustomReason.placeholder = dict.customReasonPlaceholder;

  // Keep default clinical inputs translated unless manually edited by doctor
  if (!appState.customDiagnosisEdited) {
    docCustomDiagnosis.value = dict.defaultOverrideDiag;
  }
  if (!appState.carePlanEdited) {
    docCarePlan.value = dict.defaultCarePlan;
  }

  // Re-render dynamic components
  renderQuickOrderChips();
  renderSelectedOrders();
  if (appState.aiCaseType) {
    aiPrevisitBody.innerHTML = getAppraisalHTML(appState.aiCaseType, lang);
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
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
});

// ---------------------------------------------------------
// 2. Role Navigation Switcher
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
// 3. Simulated AI Service Layer (API Slot Reserved)
// NOTE: Future production integration would route requests
// to an LLM API through a secure server-side proxy.
// No API keys are stored in client-side code.
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

function getAppraisalHTML(caseType, lang) {
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
// 4. Patient Pre-Visit Interactions
// ---------------------------------------------------------
const btnLoadSample = document.getElementById("btn-load-sample");
const btnAskAI = document.getElementById("btn-ask-ai");
const aiLoading = document.getElementById("ai-loading");
const aiPrevisitResult = document.getElementById("ai-previsit-result");
const aiPrevisitBody = document.getElementById("ai-previsit-body");
const shareCheckbox = document.getElementById("share-ai-checkbox");
const btnSendDoctor = document.getElementById("btn-send-doctor");
const submitFeedback = document.getElementById("patient-submit-feedback");

btnLoadSample.addEventListener("click", () => {
  symptomInput.value = TRANSLATIONS[appState.lang].sampleSymptomText;
});

btnAskAI.addEventListener("click", () => {
  const text = symptomInput.value.trim();
  if (!text) {
    alert(TRANSLATIONS[appState.lang].alertEmptySymptom);
    return;
  }

  aiPrevisitResult.classList.add("hidden");
  submitFeedback.classList.add("hidden");
  aiLoading.classList.remove("hidden");

  setTimeout(() => {
    const caseType = classifySimulatedCase(text);
    appState.patientSymptoms = text;
    appState.aiCaseType = caseType;

    aiPrevisitBody.innerHTML = getAppraisalHTML(caseType, appState.lang);
    aiLoading.classList.add("hidden");
    aiPrevisitResult.classList.remove("hidden");
  }, 500);
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
// 5. Doctor Review & Searchable EHR Test Ordering
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
const patientOrdersList = document.getElementById("patient-orders-list");

function renderDoctorDashboard() {
  if (!appState.submittedToDoctor) return;

  doctorEmptyState.classList.add("hidden");
  doctorPatientCard.classList.remove("hidden");
  docPatientSymptoms.textContent = appState.patientSymptoms;

  if (appState.shareAIWithDoctor && appState.aiCaseType) {
    docAISummaryContent.innerHTML = getAppraisalHTML(appState.aiCaseType, appState.lang);
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
  const idx = Number(btn.dataset.removeOrder);
  appState.selectedOrders.splice(idx, 1);
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

  // If it matches a catalog item closely by exact name, use catalog ID; else add custom
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
  appState.ordersConfirmed = true;
  renderOrderedTestsBanner();
  docOrderFeedback.textContent = TRANSLATIONS[appState.lang].docOrderFeedback;
  docOrderFeedback.classList.remove("hidden");
});

// ---------------------------------------------------------
// 6. Patient Lab Upload, AI Explainer & Tiered-Privacy Q&A
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
  }, 550);
});

function renderQAHistory() {
  const dict = TRANSLATIONS[appState.lang];
  qaHistory.innerHTML = appState.qaLog
    .map((entry, idx) => {
      const isSelected = appState.selectedDoctorQuestions.includes(entry.question);
      let btnClass = "btn-small";
      let btnText = dict.btnAddToDoctorList;
      if (isSelected) {
        btnClass = "btn-small added";
        btnText = dict.btnAddedToDoctorList;
      } else if (entry.answerKey === "fallback") {
        btnClass = "btn-small suggested";
        btnText = dict.btnSuggestedAdd;
      }

      return `
        <div class="qa-item">
          <div class="qa-user-q">Q: ${escapeHTML(entry.question)}</div>
          <div class="qa-ai-a">${dict.qaAnswers[entry.answerKey]}</div>
          <div class="qa-item-actions">
            <button type="button" class="${btnClass}" data-toggle-q-idx="${idx}">${escapeHTML(btnText)}</button>
          </div>
        </div>
      `;
    })
    .join("");
}

qaHistory.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-toggle-q-idx]");
  if (!btn) return;
  const entry = appState.qaLog[Number(btn.dataset.toggleQIdx)];
  if (!entry) return;

  const existingIdx = appState.selectedDoctorQuestions.indexOf(entry.question);
  if (existingIdx >= 0) {
    appState.selectedDoctorQuestions.splice(existingIdx, 1);
  } else {
    appState.selectedDoctorQuestions.push(entry.question);
  }
  renderQAHistory();
  renderSavedQuestions();
});

function renderSavedQuestions() {
  const dict = TRANSLATIONS[appState.lang];
  if (appState.selectedDoctorQuestions.length === 0) {
    doctorQuestionsBox.classList.add("hidden");
    return;
  }
  doctorQuestionsList.innerHTML = appState.selectedDoctorQuestions
    .map(
      (q, idx) => `
      <li>
        <span>${escapeHTML(q)}</span>
        <button type="button" class="btn-small" data-remove-saved-q="${idx}">${escapeHTML(dict.btnRemoveItem)}</button>
      </li>
    `
    )
    .join("");
  doctorQuestionsBox.classList.remove("hidden");
}

doctorQuestionsList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove-saved-q]");
  if (!btn) return;
  appState.selectedDoctorQuestions.splice(Number(btn.dataset.removeSavedQ), 1);
  renderQAHistory();
  renderSavedQuestions();
});

function handleQASubmit() {
  const question = qaInput.value.trim();
  if (!question) {
    alert(TRANSLATIONS[appState.lang].alertEmptyQA);
    return;
  }

  const answerKey = matchSimulatedQAResponse(question);
  appState.qaLog.push({ question, answerKey });
  qaInput.value = "";
  renderQAHistory();
}

btnQASend.addEventListener("click", handleQASubmit);
qaInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleQASubmit();
  }
});

// Sync Lab Report & Optional Questions to Doctor Dashboard
const docLabEmpty = document.getElementById("doc-lab-empty");
const docLabContent = document.getElementById("doc-lab-content");
const docLabSummaryBody = document.getElementById("doc-lab-summary-body");
const docQuestionsPrivateNotice = document.getElementById("doc-questions-private-notice");
const docQuestionsSharedWrap = document.getElementById("doc-questions-shared-wrap");
const docNoQuestions = document.getElementById("doc-no-questions");
const docQuestionsList = document.getElementById("doc-questions-list");
const docFinalEmpty = document.getElementById("doc-final-empty");
const docFinalControls = document.getElementById("doc-final-controls");

function renderDoctorLabSection() {
  if (!appState.labSentToDoctor) return;

  docLabEmpty.classList.add("hidden");
  docLabContent.classList.remove("hidden");
  docLabSummaryBody.innerHTML = TRANSLATIONS[appState.lang].labReportHTML;

  // Unlock Final Diagnosis Control Panel
  docFinalEmpty.classList.add("hidden");
  docFinalControls.classList.remove("hidden");

  if (!appState.shareQuestionsWithDoctor) {
    docQuestionsPrivateNotice.classList.remove("hidden");
    docQuestionsSharedWrap.classList.add("hidden");
  } else {
    docQuestionsPrivateNotice.classList.add("hidden");
    docQuestionsSharedWrap.classList.remove("hidden");
    if (appState.selectedDoctorQuestions.length > 0) {
      docNoQuestions.classList.add("hidden");
      docQuestionsList.innerHTML = appState.selectedDoctorQuestions
        .map((q) => `<li>${escapeHTML(q)}</li>`)
        .join("");
      docQuestionsList.classList.remove("hidden");
    } else {
      docNoQuestions.classList.remove("hidden");
      docQuestionsList.classList.add("hidden");
    }
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
// 7. Doctor Final Diagnosis, Override & Shared Screen Gate
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

  appState.approvedSnapshot = {
    decision,
    useDefaultDiag: decision === "agree" || !appState.customDiagnosisEdited,
    customDiagText,
    reasonKeys,
    customReasonText: docCustomReason.value.trim(),
    useDefaultPlan: !appState.carePlanEdited,
    customPlanText: docCarePlan.value.trim(),
    sharedQuestions: appState.shareQuestionsWithDoctor
      ? [...appState.selectedDoctorQuestions]
      : [],
  };

  appState.sharedApproved = true;
  appState.reconcileExplainerOpen = false;
  renderSharedDisplay();

  btnRevokeShared.classList.remove("hidden");
  docApproveFeedback.textContent = dict.docApproveFeedback;
  docApproveFeedback.classList.remove("hidden");
});

btnRevokeShared.addEventListener("click", () => {
  appState.sharedApproved = false;
  appState.approvedSnapshot = null;
  renderSharedDisplay();

  btnRevokeShared.classList.add("hidden");
  docApproveFeedback.textContent = TRANSLATIONS[appState.lang].docRevokeFeedback;
  docApproveFeedback.classList.remove("hidden");
});

// ---------------------------------------------------------
// 8. Shared Consultation Display & Accessibility Mode
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
        <div class="ai-card-header">
          <span class="badge ai-badge">${escapeHTML(dict.reconcileExpHeader)}</span>
        </div>
        <p>${dict.reconcileExpIntro}</p>
        <ul>
          ${reasonBullets}
          ${extraBullet}
        </ul>
        <p><strong>${escapeHTML(dict.reconcileExpFooter)}</strong></p>
      </div>
    `;
  }

  // 3. Plain-Language Lab Summary
  sharedLabSummary.innerHTML = dict.labReportHTML;

  // 4. Shared Questions (Only if patient opted in)
  if (snap.sharedQuestions.length > 0) {
    sharedQuestionsCard.classList.remove("hidden");
    sharedQuestionsList.innerHTML = snap.sharedQuestions
      .map((q) => `<li>${escapeHTML(q)}</li>`)
      .join("");
  } else {
    sharedQuestionsCard.classList.add("hidden");
  }
}

sharedReconciliationBox.addEventListener("click", (e) => {
  if (e.target.id === "btn-why-different") {
    appState.reconcileExplainerOpen = !appState.reconcileExplainerOpen;
    renderSharedDisplay();
  }
});

// Initialize default language (English)
applyLanguage("en");