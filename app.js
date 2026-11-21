// =========================================================
// CoConsult v2 — Core State, i18n, Clinical Orders,
// Lab/Scan Explainer & Free-Text Follow-Up Q&A
// Status: UI, trilingual i18n & workflow = Implemented
//         OCR / LLM reasoning = Simulated (API slot reserved)
// =========================================================

const appState = {
  lang: "en",
  // Stage 1
  patientSymptoms: "",
  aiCaseType: null, // "liver" | "general" | null
  shareAIWithDoctor: true,
  submittedToDoctor: false,
  lastFeedbackKey: null,
  // Stage 2
  orderedTests: [], // array of i18n keys: ["orderLFT", "orderUltrasound", ...]
  ordersConfirmed: false,
  // Stage 3
  labLoaded: false,
  labFileLabel: "",
  labIsSample: false,
  labAnalysed: false,
  qaLog: [], // [{ question: string, answerKey: string }]
  doctorQuestions: [], // unresolved questions saved for clinician
  labSentToDoctor: false,
};

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------------------------------------------------------
// 1. Trilingual i18n Engine (EN / 中文 / IT)
// ---------------------------------------------------------
const langButtons = document.querySelectorAll(".lang-btn");
const symptomInput = document.getElementById("symptom-input");
const qaInput = document.getElementById("qa-input");

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

  symptomInput.placeholder = dict.symptomPlaceholder;
  qaInput.placeholder = dict.qaPlaceholder;

  // Re-render dynamic sections in the newly selected language
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
    labSubmitFeedback.textContent = dict.labSentFeedback;
    renderDoctorLabSection();
  }
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
// NOTE: Future LLM API integration (via secure backend proxy)
// will replace these functions. No API keys are stored here.
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
// 4. Stage 1: Patient Pre-Visit Interactions
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
  }, 550);
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
// 5. Stage 2: Doctor Review & Clinical Test Orders
// ---------------------------------------------------------
const doctorEmptyState = document.getElementById("doctor-empty-state");
const doctorPatientCard = document.getElementById("doctor-patient-card");
const docPatientSymptoms = document.getElementById("doc-patient-symptoms");
const docAISharedBox = document.getElementById("doc-ai-shared-box");
const docAISummaryContent = document.getElementById("doc-ai-summary-content");
const docAIHiddenNotice = document.getElementById("doc-ai-hidden-notice");

const orderLFT = document.getElementById("order-lft");
const orderUltrasound = document.getElementById("order-ultrasound");
const orderCBC = document.getElementById("order-cbc");
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

function renderOrderedTestsBanner() {
  if (!appState.ordersConfirmed || appState.orderedTests.length === 0) return;
  const dict = TRANSLATIONS[appState.lang];
  patientOrdersList.innerHTML = appState.orderedTests
    .map((key) => `<li>${dict[key]}</li>`)
    .join("");
  patientOrdersBanner.classList.remove("hidden");
}

btnConfirmOrders.addEventListener("click", () => {
  const selected = [];
  if (orderLFT.checked) selected.push("orderLFT");
  if (orderUltrasound.checked) selected.push("orderUltrasound");
  if (orderCBC.checked) selected.push("orderCBC");

  if (selected.length === 0) {
    alert(TRANSLATIONS[appState.lang].alertNoOrder);
    return;
  }

  appState.orderedTests = selected;
  appState.ordersConfirmed = true;
  renderOrderedTestsBanner();

  docOrderFeedback.textContent = TRANSLATIONS[appState.lang].docOrderFeedback;
  docOrderFeedback.classList.remove("hidden");
});

// ---------------------------------------------------------
// 6. Stage 3: Patient Lab Upload, AI Explainer & Free Q&A
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
const btnSendLabDoctor = document.getElementById("btn-send-lab-doctor");
const labSubmitFeedback = document.getElementById("lab-submit-feedback");

labFileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  appState.labLoaded = true;
  appState.labIsSample = false;
  appState.labFileLabel = file.name;

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
  }, 650);
});

function renderQAHistory() {
  const answers = TRANSLATIONS[appState.lang].qaAnswers;
  qaHistory.innerHTML = appState.qaLog
    .map(
      (entry) => `
      <div class="qa-item">
        <div class="qa-user-q">Q: ${escapeHTML(entry.question)}</div>
        <div class="qa-ai-a">${answers[entry.answerKey]}</div>
      </div>
    `
    )
    .join("");
}

function renderSavedQuestions() {
  if (appState.doctorQuestions.length === 0) {
    doctorQuestionsBox.classList.add("hidden");
    return;
  }
  doctorQuestionsList.innerHTML = appState.doctorQuestions
    .map((q) => `<li>${escapeHTML(q)}</li>`)
    .join("");
  doctorQuestionsBox.classList.remove("hidden");
}

function handleQASubmit() {
  const question = qaInput.value.trim();
  if (!question) {
    alert(TRANSLATIONS[appState.lang].alertEmptyQA);
    return;
  }

  const answerKey = matchSimulatedQAResponse(question);
  appState.qaLog.push({ question, answerKey });

  if (answerKey === "fallback" && !appState.doctorQuestions.includes(question)) {
    appState.doctorQuestions.push(question);
  }

  qaInput.value = "";
  renderQAHistory();
  renderSavedQuestions();

  if (appState.labSentToDoctor) {
    renderDoctorLabSection();
  }
}

btnQASend.addEventListener("click", handleQASubmit);
qaInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleQASubmit();
  }
});

// Sync Stage 3 Lab Results & Unresolved Questions to Doctor Dashboard
const docLabEmpty = document.getElementById("doc-lab-empty");
const docLabContent = document.getElementById("doc-lab-content");
const docLabSummaryBody = document.getElementById("doc-lab-summary-body");
const docNoQuestions = document.getElementById("doc-no-questions");
const docQuestionsList = document.getElementById("doc-questions-list");

function renderDoctorLabSection() {
  if (!appState.labSentToDoctor) return;

  docLabEmpty.classList.add("hidden");
  docLabContent.classList.remove("hidden");
  docLabSummaryBody.innerHTML = TRANSLATIONS[appState.lang].labReportHTML;

  if (appState.doctorQuestions.length > 0) {
    docNoQuestions.classList.add("hidden");
    docQuestionsList.innerHTML = appState.doctorQuestions
      .map((q) => `<li>${escapeHTML(q)}</li>`)
      .join("");
    docQuestionsList.classList.remove("hidden");
  } else {
    docNoQuestions.classList.remove("hidden");
    docQuestionsList.classList.add("hidden");
  }
}

btnSendLabDoctor.addEventListener("click", () => {
  appState.labSentToDoctor = true;
  renderDoctorLabSection();
  labSubmitFeedback.textContent = TRANSLATIONS[appState.lang].labSentFeedback;
  labSubmitFeedback.classList.remove("hidden");
});

// Initialize default language
applyLanguage("en");