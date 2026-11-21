// =========================================================
// CoConsult v1 — Core State, i18n Switching & Simulated AI
// Status: UI, trilingual i18n & workflow = Implemented
//         AI reasoning backend = Simulated (API slot reserved)
// =========================================================

const appState = {
  lang: "en",
  patientSymptoms: "",
  aiCaseType: null, // "liver" | "general" | null
  shareAIWithDoctor: true,
  submittedToDoctor: false,
  lastFeedbackKey: null,
};

// ---------------------------------------------------------
// 1. Trilingual i18n Engine (EN / 中文 / IT)
// ---------------------------------------------------------
const langButtons = document.querySelectorAll(".lang-btn");
const symptomInput = document.getElementById("symptom-input");

function applyLanguage(lang) {
  appState.lang = lang;
  document.documentElement.lang = lang;
  const dict = TRANSLATIONS[lang];

  // Highlight active language button
  langButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // Update plain text nodes
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  // Update HTML nodes (with bold/italic tags)
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (dict[key]) el.innerHTML = dict[key];
  });

  // Update textarea placeholder
  symptomInput.placeholder = dict.symptomPlaceholder;

  // Re-render dynamic AI output & feedback in the newly selected language
  if (appState.aiCaseType) {
    aiPrevisitBody.innerHTML = getAppraisalHTML(appState.aiCaseType, lang);
  }
  if (appState.lastFeedbackKey) {
    submitFeedback.textContent = dict[appState.lastFeedbackKey];
  }
  if (appState.submittedToDoctor) {
    renderDoctorDashboard();
  }
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
});

// ---------------------------------------------------------
// 2. Role Navigation Switcher (Patient / Doctor / Shared)
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
// NOTE: Future LLM API integration (e.g., OpenAI/Gemini via
// backend proxy) will replace this classifier. No API keys
// are stored in client-side code.
// ---------------------------------------------------------
function classifySimulatedCase(symptomText) {
  const text = symptomText.toLowerCase();
  const liverKeywords = [
    // English
    "abdomen", "liver", "fatigue", "tired", "stomach", "appetite", "painkiller",
    // Chinese
    "肝", "累", "乏力", "疲惫", "右上腹", "腹痛", "胃口", "食欲", "熬夜", "止痛药",
    // Italian
    "fegato", "stanco", "stanchezza", "addome", "appetito", "antidolorific", "stomaco",
  ];

  const isLiverCase = liverKeywords.some((kw) => text.includes(kw));
  return isLiverCase ? "liver" : "general";
}

function getAppraisalHTML(caseType, lang) {
  const dict = TRANSLATIONS[lang];
  return caseType === "liver" ? dict.aiLiverHTML : dict.aiGeneralHTML;
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
  }, 600);
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
// 5. Doctor Dashboard Rendering
// ---------------------------------------------------------
const doctorEmptyState = document.getElementById("doctor-empty-state");
const doctorPatientCard = document.getElementById("doctor-patient-card");
const docPatientSymptoms = document.getElementById("doc-patient-symptoms");
const docAISharedBox = document.getElementById("doc-ai-shared-box");
const docAISummaryContent = document.getElementById("doc-ai-summary-content");
const docAIHiddenNotice = document.getElementById("doc-ai-hidden-notice");

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

// Initialize default language (English) on page load
applyLanguage("en");