// =========================================================
// CoConsult v3 (Final Prototype) — Trilingual Pack (EN/ZH/IT)
// Includes searchable clinical test catalog, tiered privacy
// copy, clinician override reconciliation, and accessibility
// =========================================================

const TEST_CATALOG = [
  {
    id: "lft",
    cat: { en: "Blood Test", zh: "抽血化验", it: "Analisi Sangue" },
    en: "Liver Function Test (ALT, AST, Bilirubin)",
    zh: "肝功能抽血化验（ALT、AST、总胆红素）",
    it: "Esami Funzionalità Epatica (ALT, AST, Bilirubina)",
    keywords: "lft liver alt ast bilirubin blood 肝 肝功能 谷丙 谷草 验血 抽血 fegato transaminasi sangue",
  },
  {
    id: "abd_us",
    cat: { en: "Ultrasound", zh: "超声检查", it: "Ecografia" },
    en: "Abdominal Ultrasound (Liver & Gallbladder)",
    zh: "腹部超声检查（肝脏与胆囊）",
    it: "Ecografia Addominale (Fegato e Colecisti)",
    keywords: "ultrasound abdomen liver gallbladder us 超声 B超 腹部 肝 胆 ecografia addome fegato",
  },
  {
    id: "cbc",
    cat: { en: "Blood Test", zh: "抽血化验", it: "Analisi Sangue" },
    en: "Complete Blood Count (CBC)",
    zh: "血常规检查（CBC）",
    it: "Emocromo Completo (CBC)",
    keywords: "cbc blood count wbc rbc 血常规 抽血 验血 emocromo sangue",
  },
  {
    id: "hep",
    cat: { en: "Blood Test", zh: "抽血化验", it: "Analisi Sangue" },
    en: "Viral Hepatitis Panel (Hep B / C)",
    zh: "病毒性肝炎筛查（乙肝 / 丙肝）",
    it: "Marker Epatite Virale (Epatite B / C)",
    keywords: "hepatitis hbv hcv viral liver 肝炎 乙肝 丙肝 验血 epatite fegato",
  },
  {
    id: "chest_ct",
    cat: { en: "CT Scan", zh: "CT 扫描", it: "TC / CT" },
    en: "Chest CT Scan",
    zh: "胸部 CT 扫描",
    it: "TC Torace (CT)",
    keywords: "ct chest lung thorax 胸部 ct 肺部 拍片 tc torace polmoni",
  },
  {
    id: "abd_ct",
    cat: { en: "CT Scan", zh: "CT 扫描", it: "TC / CT" },
    en: "Abdominal & Pelvic CT Scan",
    zh: "腹部 CT 扫描",
    it: "TC Addome Completo (CT)",
    keywords: "ct abdomen liver stomach 腹部 ct 肝 拍片 tc addome",
  },
  {
    id: "head_ct",
    cat: { en: "CT Scan", zh: "CT 扫描", it: "TC / CT" },
    en: "Head / Brain CT Scan",
    zh: "头颅 CT 扫描",
    it: "TC Encefalo (CT)",
    keywords: "ct head brain skull 头颅 脑 ct 拍片 tc encefalo testa",
  },
  {
    id: "liver_mri",
    cat: { en: "MRI", zh: "核磁共振", it: "RM / MRI" },
    en: "Liver / Upper Abdominal MRI",
    zh: "肝脏核磁共振（MRI）",
    it: "Risonanza Magnetica Epatica (MRI)",
    keywords: "mri liver abdomen magnetic 核磁 磁共振 肝脏 mri rm fegato risonanza",
  },
  {
    id: "brain_mri",
    cat: { en: "MRI", zh: "核磁共振", it: "RM / MRI" },
    en: "Brain MRI",
    zh: "头颅核磁共振（MRI）",
    it: "Risonanza Magnetica Encefalo (MRI)",
    keywords: "mri brain head headache 核磁 磁共振 头颅 脑 mri rm encefalo",
  },
  {
    id: "spine_mri",
    cat: { en: "MRI", zh: "核磁共振", it: "RM / MRI" },
    en: "Lumbar Spine MRI",
    zh: "腰椎核磁共振（MRI）",
    it: "Risonanza Magnetica Lombare (MRI)",
    keywords: "mri spine back lumbar 核磁 腰椎 脊柱 mri rm lombare",
  },
  {
    id: "rft",
    cat: { en: "Blood Test", zh: "抽血化验", it: "Analisi Sangue" },
    en: "Kidney Function Test (Creatinine, eGFR)",
    zh: "肾功能抽血化验（肌酐、尿素氮）",
    it: "Esami Funzionalità Renale (Creatinina)",
    keywords: "kidney renal creatinine rft blood 肾 肾功能 验血 抽血 reni creatinina",
  },
  {
    id: "lipid",
    cat: { en: "Blood Test", zh: "抽血化验", it: "Analisi Sangue" },
    en: "Lipid & Fasting Blood Glucose Panel",
    zh: "血脂与空腹血糖检测",
    it: "Profilo Lipidico e Glicemia a Digiuno",
    keywords: "lipid cholesterol glucose diabetes blood 血脂 血糖 胆固醇 抽血 colesterolo glicemia",
  },
  {
    id: "coag",
    cat: { en: "Blood Test", zh: "抽血化验", it: "Analisi Sangue" },
    en: "Coagulation Profile (PT / INR)",
    zh: "凝血功能检查（PT / INR）",
    it: "Profilo Coagulativo (PT / INR)",
    keywords: "coagulation pt inr clotting blood 凝血 抽血 coagulazione",
  },
  {
    id: "thyroid_us",
    cat: { en: "Ultrasound", zh: "超声检查", it: "Ecografia" },
    en: "Thyroid Ultrasound",
    zh: "甲状腺超声检查",
    it: "Ecografia Tiroidea",
    keywords: "thyroid ultrasound neck us 甲状腺 超声 B超 tiroide ecografia",
  },
  {
    id: "echo",
    cat: { en: "Ultrasound", zh: "超声检查", it: "Ecografia" },
    en: "Echocardiogram (Heart Ultrasound)",
    zh: "心脏彩超",
    it: "Ecocardiogramma",
    keywords: "heart echo cardiac ultrasound 心脏 彩超 超声 cuore ecocardiogramma",
  },
  {
    id: "ecg",
    cat: { en: "Cardiology", zh: "心电检查", it: "Cardiologia" },
    en: "12-Lead Electrocardiogram (ECG)",
    zh: "心电图检查（ECG）",
    it: "Elettrocardiogramma (ECG)",
    keywords: "ecg ekg heart rhythm 心电图 心脏 elettrocardiogramma",
  },
  {
    id: "xray_chest",
    cat: { en: "X-Ray", zh: "X 光检查", it: "Radiografia" },
    en: "Chest X-Ray",
    zh: "胸部 X 光片（胸片）",
    it: "Radiografia del Torace (RX)",
    keywords: "xray x-ray chest lung 胸片 x光 拍片 radiografia rx torace",
  },
  {
    id: "urine",
    cat: { en: "Lab Test", zh: "常规检验", it: "Analisi" },
    en: "Routine Urinalysis",
    zh: "尿常规检查",
    it: "Esame Completo delle Urine",
    keywords: "urine urinalysis lab 尿常规 验尿 urine",
  },
];

const QUICK_ORDER_IDS = ["lft", "abd_us", "hep"];

const TRANSLATIONS = {
  en: {
    subtitle: "Transparent Doctor–Patient–AI Consultation System",
    statusSimulated: "AI Engine: Simulated (API Slot Reserved)",
    navPatientTitle: "1. Patient View",
    navPatientSub: "Pre-Visit & Lab Reports",
    navDoctorTitle: "2. Doctor Dashboard",
    navDoctorSub: "Orders, Review & Control",
    navSharedTitle: "3. Shared Display",
    navSharedSub: "In-Room Screen",

    // Patient: Pre-Visit
    previsitTitle: "Pre-Visit Symptom Preparation",
    badgeImplemented: "Implemented UI",
    previsitDesc:
      "Describe how you feel before seeing your doctor. CoConsult organises your symptoms for the visit—<strong>not a final diagnosis</strong>.",
    symptomLabel: "Your Symptoms & Concerns:",
    symptomPlaceholder:
      "Example: I have been feeling tired for two weeks, with mild discomfort in my upper right abdomen and poor appetite...",
    btnLoadSample: "Load Sample Case (Liver / Fatigue)",
    btnAskAI: "Get AI Pre-Visit Appraisal",
    aiLoadingText: "Simulated AI engine is structuring your symptom notes...",
    badgeAIPrevisit: "AI-Assisted Pre-Visit Summary (Simulated)",
    aiDisclaimer: "For consultation prep only — not a medical diagnosis",
    shareCheckTitle: "Openly share my AI pre-visit summary with the doctor",
    shareCheckSub: "(Encourages transparent discussion instead of hiding AI use)",
    btnSendDoctor: "Send Summary to Doctor Dashboard →",
    alertEmptySymptom: "Please enter your symptoms first, or click 'Load Sample Case'.",
    feedbackShared:
      "✓ Sent! Both your symptoms and AI pre-visit summary are now visible in the Doctor Dashboard.",
    feedbackPrivate:
      "✓ Sent! Only your symptoms were shared (AI summary kept private).",

    // Patient: Lab Upload & Private Q&A
    labUploadTitle: "Upload Lab Results / Scans & Plain-Language Explainer",
    labUploadDesc:
      "Upload your blood test or scan image (or load the sample liver report). CoConsult highlights abnormal markers like <strong>ALT / AST</strong> in plain language so you understand your results before meeting your doctor.",
    ordersReceivedTitle: "Clinician-Ordered Tests Ready for Upload:",
    uploadLabel: "Upload Blood Test Report or Scan Image (JPG / PNG / PDF):",
    btnLoadSampleLab: "Load Sample Liver Lab & Ultrasound",
    btnAnalyseLab: "Explain Report with AI (Simulated)",
    labLoadingText: "Simulated OCR & AI explainer are extracting key markers (ALT / AST / Ultrasound)...",
    badgeAILab: "AI Lab & Scan Explainer (Simulated)",
    labDisclaimer: "Preliminary explanation only — final diagnosis rests with your doctor",
    sampleFileLabel: "Sample Loaded: Liver_Function_Panel_and_Ultrasound.pdf (Simulated Data)",
    alertNoLab: "Please upload a file or click 'Load Sample Liver Lab & Ultrasound' first.",

    // Tiered Privacy Q&A
    qaTitle: "Ask Any Follow-Up Question (Free Text)",
    qaPrivacyPill: "🔒 Private by Default",
    qaDesc:
      "Type any question freely in your own words. Your AI chat stays completely private—you decide whether to pick specific questions to share with your doctor.",
    qaPlaceholder: "Ask anything (e.g., Could painkillers raise ALT? Is this cancer?)...",
    btnQASend: "Ask AI",
    alertEmptyQA: "Please type a question first.",
    btnAddToDoctorList: "+ Add to Doctor Discussion List",
    btnSuggestedAdd: "+ Suggested: Add to Doctor Discussion List",
    btnAddedToDoctorList: "✓ Added (Click to Remove)",
    savedQuestionsTitle: "Questions You Selected for Your Doctor (Optional to Share):",
    btnRemoveItem: "Remove",
    shareQuestionsTitle: "Also share my selected 'Questions for Doctor' list with the doctor",
    shareQuestionsSub: "(Optional — unchecked by default to protect privacy; your full AI chat always stays private)",
    btnSendLabDoctor: "Send Lab Report to Doctor Dashboard →",
    labSentFeedbackShared:
      "✓ Sent! Your lab interpretation and selected questions are now visible in the Doctor Dashboard.",
    labSentFeedbackPrivate:
      "✓ Sent! Your lab interpretation was sent to the Doctor Dashboard (all personal questions kept private).",

    // Doctor Panel: Pre-Visit & Searchable Orders
    docPanelTitle: "Patient Pre-Visit Brief & Diagnostic Test Ordering",
    badgeDoctorPanel: "Clinician Control Panel",
    docEmptyTitle: "No patient pre-visit brief received yet.",
    docEmptyDesc:
      "Go to <strong>1. Patient View</strong>, run a pre-visit appraisal, and click 'Send Summary to Doctor Dashboard' to begin.",
    docSymptomsHeading: "Patient-Reported Symptoms",
    docAISharedHeading: "Patient's Pre-Visit AI Query (Shared Openly)",
    badgeAISimulated: "AI-Assisted (Simulated)",
    docAIHiddenNotice:
      "<strong>Notice:</strong> The patient chose <em>not</em> to share their pre-visit AI summary. Only direct symptom notes are shown above.",

    ordersPanelTitle: "Order Diagnostic Tests (Search Catalog or Type Custom)",
    ordersPanelDesc:
      "Search by modality or body area (e.g., CT, MRI, ultrasound, liver, blood) or type any custom test name to add it to the order list.",
    quickAddLabel: "Quick add:",
    orderSearchPlaceholder: "Search tests (e.g., CT, MRI, ALT, Ultrasound, ECG) or type a custom order...",
    btnAddOrder: "+ Add",
    selectedOrdersLabel: "Selected Tests to Order:",
    noOrdersYet: "No tests selected yet. Search above or click a quick-add item.",
    btnConfirmOrders: "Confirm & Send Test Orders to Patient",
    alertNoOrder: "Please add at least one clinical test before confirming.",
    docOrderFeedback: "✓ Test orders confirmed and synced to the Patient View.",

    // Doctor Panel: Lab Results
    docLabHeading: "Uploaded Lab Results & AI Preliminary Impression",
    docLabEmpty: "No lab report received yet. Complete the lab upload in Patient View to review markers and the AI draft here.",
    docQuestionsHeading: "Patient Discussion Questions",
    docQuestionsPrivate:
      "<strong>Privacy Respected:</strong> The patient chose to keep their follow-up questions private for now.",
    docNoQuestions: "The patient enabled sharing but did not select any specific questions.",

    // Doctor Panel: Final Diagnosis & Reconciliation
    docFinalTitle: "Final Clinical Diagnosis & Shared Screen Approval",
    badgeDoctorControl: "Final Authority",
    docFinalEmpty: "Review the patient's uploaded lab results above before confirming the final diagnosis and unlocking the Shared Display.",
    docFinalDesc:
      "Compare the AI's preliminary impression (Mild Non-Alcoholic Fatty Liver) against your clinical assessment, choose whether to agree or override, then approve content for the in-room screen.",
    decisionAgreeTitle: "Agree with AI Preliminary Impression",
    decisionAgreeSub: "Confirm Mild Non-Alcoholic Fatty Liver (NAFLD) — displays dual-verification alignment.",
    decisionOverrideTitle: "Override AI Impression (Use Clinician Diagnosis)",
    decisionOverrideSub: "Supersede AI with your clinical diagnosis and let CoConsult explain your reasoning to the patient.",
    overrideDiagLabel: "Clinician's Final Diagnosis:",
    defaultOverrideDiag: "Transient Medication-Induced Liver Stress (Painkillers & Sleep Deprivation)",
    defaultAgreeDiag: "Mild Non-Alcoholic Fatty Liver (NAFLD) — Clinically Confirmed",
    overrideReasonsLabel: "Clinical Factors Behind Your Decision (Used by AI to Explain the Difference):",
    reasonMeds: "Recent frequent OTC painkiller use (medication history not fully weighted by AI)",
    reasonExam: "In-person abdominal palpation & physical exam findings",
    reasonLifestyle: "Acute two-week sleep deprivation & fatigue timeline",
    reasonHistory: "Patient's broader medical history and individual metabolic profile",
    customReasonLabel: "Additional Clinical Note (Optional):",
    customReasonPlaceholder: "Optional: Add any extra nuance you want reflected in the patient explanation...",
    carePlanLabel: "Final Care Plan & Next Steps (Displayed on Shared Screen):",
    defaultCarePlan:
      "Pause non-essential painkillers and alcohol, prioritise sleep recovery, and repeat a liver function blood test (ALT/AST) in 4 weeks to confirm levels return to normal.",
    btnApproveShared: "Approve & Project to Shared Display →",
    btnRevokeShared: "Lock / Clear Shared Screen",
    docApproveFeedback: "✓ Approved! Switch to '3. Shared Display' to review the in-room screen with the patient.",
    docRevokeFeedback: "🔒 Shared Display has been locked and cleared.",
    alertEmptyDiag: "Please enter a final clinical diagnosis before approving.",

    // Shared Display
    sharedTitle: "In-Room Shared Consultation Display",
    badgeDoctorGated: "Doctor-Gated Visibility",
    badgeApprovedLive: "Approved by Clinician",
    sharedLockTitle: "🔒 Awaiting Clinician Final Approval",
    sharedLockDesc:
      "To safeguard clinical safety and physician authority, AI drafts are <strong>never projected automatically</strong>. Content unlocks here only after the doctor verifies the final diagnosis and clicks Approve.",
    btnAccessibleOn: "Aa Simplified & Large-Text Mode: OFF",
    btnAccessibleOff: "Aa Simplified & Large-Text Mode: ON",
    sharedDocDiagHeading: "Clinician's Final Diagnosis",
    badgeDoctorVerified: "Verified by Doctor",
    sharedCarePlanHeading: "Agreed Next Steps & Care Plan:",
    sharedLabHeading: "Plain-Language Summary of Your Test Results",
    badgeAIVerifiedDisplay: "AI-Assisted Explanation (Simulated)",
    sharedQuestionsHeading: "Your Selected Questions for Today's Discussion",
    badgePatientShared: "Shared by Patient",

    // Shared Display Reconciliation
    alignedTitle: "✓ Dual Verification: Doctor & AI Aligned",
    alignedDesc:
      "Your doctor's clinical examination and the AI's pattern analysis reached the same conclusion. The final responsibility and care plan remain guided by your doctor.",
    overrideTitle: "Clinical Update: Doctor's Final Diagnosis Supersedes AI Draft",
    overrideIntro:
      "Because an AI only sees isolated test numbers, your doctor's full clinical assessment takes priority.",
    compareAILabel: "AI Preliminary Draft (Simulated)",
    compareAIDraftText: "Mild Non-Alcoholic Fatty Liver (NAFLD)",
    compareDocLabel: "Doctor's Final Diagnosis (Authoritative)",
    btnWhyDifferent: "Why does the doctor's diagnosis differ from the AI?",
    btnHideWhyDifferent: "Hide explanation",
    reconcileExpHeader: "AI Explanation Supporting Your Doctor's Clinical Decision (Simulated)",
    reconcileExpIntro:
      "The AI draft flagged <strong>Fatty Liver</strong> simply because raised ALT/AST with a slightly bright ultrasound is the most statistically common pattern in general databases. However, <strong>your doctor's diagnosis is more accurate for you personally</strong> because they evaluated critical real-world factors that an algorithm cannot see:",
    reconcileExpFooter:
      "AI tools cannot replace physical examination or individual clinical context—following your doctor's confirmed plan is the safest path forward.",

    // Sample Clinical Content
    sampleSymptomText:
      "I have been feeling unusually tired for the past two weeks, with mild dull discomfort in my upper right abdomen and poor appetite. I have also been staying up late and taking painkillers for headaches.",

    aiLiverHTML: `
      <div class="ai-section-block">
        <h4>Key Symptom Highlights</h4>
        <ul>
          <li>Detected symptoms: <span class="key-term">Persistent Fatigue</span> and <span class="key-term">Upper Right Abdominal Discomfort</span>.</li>
          <li>Suggested Care Level: <span class="urgency-tag">Routine / Prompt GP Visit</span> (Seek urgent care if severe pain or jaundice occurs).</li>
        </ul>
      </div>
      <div class="ai-section-block">
        <h4>Likely Checks Your Doctor May Consider</h4>
        <ul>
          <li><span class="key-term">Liver Function Blood Test (LFT)</span> — checks enzymes such as <strong>ALT</strong> and <strong>AST</strong>.</li>
          <li><span class="key-term">Abdominal Ultrasound</span> — a quick, non-invasive scan to inspect liver and gallbladder structure.</li>
        </ul>
      </div>
    `,

    aiGeneralHTML: `
      <div class="ai-section-block">
        <h4>Key Symptom Summary</h4>
        <ul>
          <li>Structured note for clinical review: <span class="key-term">General Symptom Inquiry</span>.</li>
          <li>Suggested Care Level: <span class="urgency-tag">Discuss with Clinician</span> (Seek urgent care if symptoms worsen suddenly).</li>
        </ul>
      </div>
      <div class="ai-section-block">
        <h4>How to Prepare for Your Visit</h4>
        <ul>
          <li>Note <strong>when symptoms started</strong>, triggers, and any recent medications.</li>
          <li>Your doctor will combine physical examination with your history to decide on tests.</li>
        </ul>
      </div>
    `,

    labReportHTML: `
      <div class="marker-grid">
        <div class="marker-card abnormal">
          <div class="marker-top">
            <strong>ALT (Alanine Transaminase)</strong>
            <span class="urgency-tag">118 U/L ↑ HIGH</span>
          </div>
          <small class="accessible-hide">Normal range: 7–56 U/L</small>
          <p class="marker-explain"><strong>Plain meaning:</strong> An enzyme mainly inside liver cells. When liver cells are stressed or irritated (by fatty buildup, alcohol, viruses, or medications), ALT leaks into the blood.</p>
        </div>
        <div class="marker-card abnormal">
          <div class="marker-top">
            <strong>AST (Aspartate Transaminase)</strong>
            <span class="urgency-tag">74 U/L ↑ HIGH</span>
          </div>
          <small class="accessible-hide">Normal range: 10–40 U/L</small>
          <p class="marker-explain"><strong>Plain meaning:</strong> Another enzyme found in the liver and muscles. Mildly elevated alongside ALT confirms temporary liver cell stress.</p>
        </div>
        <div class="marker-card normal">
          <div class="marker-top">
            <strong>Total Bilirubin</strong>
            <span class="normal-tag">14 µmol/L ✓ NORMAL</span>
          </div>
          <small class="accessible-hide">Normal range: 3–20 µmol/L</small>
          <p class="marker-explain"><strong>Plain meaning:</strong> A yellow pigment cleared by the liver. A normal level is reassuring—your bile drainage is clear.</p>
        </div>
      </div>

      <div class="ai-section-block">
        <h4>Abdominal Ultrasound Summary (Plain Language)</h4>
        <ul>
          <li>Scan note: <span class="key-term">Mildly increased liver echogenicity</span> — the liver appears slightly brighter than usual on ultrasound, with <strong>no masses or gallstones seen</strong>.</li>
        </ul>
      </div>

      <div class="ai-section-block accessible-hide">
        <h4>AI Preliminary Impression (Pending Doctor Verification)</h4>
        <ul>
          <li>Based strictly on numeric patterns and scan brightness, the most statistically common pattern is <span class="key-term">Mild Non-Alcoholic Fatty Liver (NAFLD)</span>.</li>
          <li><strong>Limitation:</strong> This AI draft cannot evaluate your full medication history or physical exam—your doctor will determine the true cause.</li>
        </ul>
      </div>
    `,

    qaAnswers: {
      cancer:
        "<strong>Calibrated Reassurance:</strong> Mildly raised ALT (118) and AST (74) with normal bilirubin and <em>no masses</em> on ultrasound are <strong>far more commonly caused by reversible factors</strong> (such as medications, fatty liver, or sleep stress) than by cancer. Your doctor will confirm safely.",
      meds:
        "<strong>Medication Factor:</strong> Yes—over-the-counter <span class='key-term'>painkillers (e.g., paracetamol/NSAIDs)</span> and supplements are processed by the liver and can temporarily raise ALT/AST. <strong>Do not self-medicate</strong> with liver pills before checking with your doctor.",
      lifestyle:
        "<strong>Practical Steps While Waiting:</strong> Avoid <span class='key-term'>alcohol</span>, pause unnecessary supplements, prioritise sleep, and keep meals light until your doctor confirms the final care plan.",
      markers:
        "<strong>ALT vs. AST in One Line:</strong> <span class='key-term'>ALT</span> is a liver-specific alarm bell, while <span class='key-term'>AST</span> reflects broader cell stress. Both being mildly high signals temporary irritation, not permanent damage.",
      fallback:
        "<strong>Medical Safety Boundary:</strong> This question requires personalised clinical judgement beyond the simulated knowledge base. If you feel comfortable sharing it, you can click the button below to add it to your optional <strong>Doctor Discussion List</strong>.",
    },
  },

  zh: {
    subtitle: "医-患-AI 透明协作问诊系统原型",
    statusSimulated: "AI 引擎：模拟模式（已预留 API 接口）",
    navPatientTitle: "1. 患者视角",
    navPatientSub: "诊前自查与报告解读",
    navDoctorTitle: "2. 医生工作台",
    navDoctorSub: "开单、审核与终诊控制",
    navSharedTitle: "3. 诊室共享屏",
    navSharedSub: "医患同看大屏",

    // Patient: Pre-Visit
    previsitTitle: "诊前症状整理与自查",
    badgeImplemented: "已实现界面",
    previsitDesc:
      "在见医生前描述您的身体不适。CoConsult 会帮您把症状整理成清晰要点——<strong>仅供参考，不能替代医生诊断</strong>。",
    symptomLabel: "您的症状与担忧：",
    symptomPlaceholder:
      "例如：最近两周总是觉得很累、没力气，右上腹隐隐作痛，没什么胃口……",
    btnLoadSample: "一键填入示例病例（肝区不适 / 乏力）",
    btnAskAI: "获取 AI 诊前结构化评估",
    aiLoadingText: "模拟 AI 引擎正在分析并整理您的症状要点...",
    badgeAIPrevisit: "AI 辅助诊前摘要（模拟输出）",
    aiDisclaimer: "仅用于就诊准备 — 非医疗诊断结论",
    shareCheckTitle: "公开将我的 AI 诊前咨询记录同步给医生",
    shareCheckSub: "（打破隐瞒 AI 使用的尴尬，便于医患公开讨论）",
    btnSendDoctor: "发送摘要至医生工作台 →",
    alertEmptySymptom: "请先输入您的症状，或点击“一键填入示例病例”。",
    feedbackShared:
      "✓ 已发送！您的症状描述和 AI 诊前摘要均已公开同步至医生工作台。",
    feedbackPrivate:
      "✓ 已发送！仅发送了您的症状描述（AI 摘要已按您的要求保持私密）。",

    // Patient: Lab Upload & Private Q&A
    labUploadTitle: "检查报告上传与 AI 通俗解读",
    labUploadDesc:
      "上传您的抽血报告或检查片子（也可一键加载肝功能样例）。CoConsult 会高亮 <strong>ALT / AST</strong> 等异常指标并用大白话解释含义，帮您听懂专业术语。",
    ordersReceivedTitle: "医生已为您开具以下检查（完成后请上传）：",
    uploadLabel: "上传化验单或影像片（支持 JPG / PNG / PDF）：",
    btnLoadSampleLab: "一键加载样例（肝功能化验单 + 腹部超声）",
    btnAnalyseLab: "让 AI 通俗解读报告（模拟）",
    labLoadingText: "模拟 OCR 与 AI 解读引擎正在提取核心指标（ALT / AST / 超声）...",
    badgeAILab: "AI 化验单与影像解读（模拟输出）",
    labDisclaimer: "仅作初步科普与理解辅助 — 最终诊断以医生为准",
    sampleFileLabel: "已加载样例：肝功能全套与腹部超声报告.pdf（模拟数据）",
    alertNoLab: "请先上传本地文件，或点击“一键加载样例”。",

    // Tiered Privacy Q&A
    qaTitle: "私密自由追问（想问什么直接打字）",
    qaPrivacyPill: "🔒 默认仅自己可见",
    qaDesc:
      "用自己的话随便提问（不必担心尴尬）。您的完整 AI 提问记录默认完全私密，只有您主动挑选并勾选授权的问题才会同步给医生。",
    qaPlaceholder: "输入您想问的任何问题（例如：止痛药会导致谷丙转氨酶高吗？严不严重？）...",
    btnQASend: "提问",
    alertEmptyQA: "请先输入您的问题。",
    btnAddToDoctorList: "+ 加入待问医生清单",
    btnSuggestedAdd: "+ 建议加入待问医生清单（自愿）",
    btnAddedToDoctorList: "✓ 已加入清单（点此移出）",
    savedQuestionsTitle: "您主动挑选的【待问医生清单】（可随时移出）：",
    btnRemoveItem: "移出",
    shareQuestionsTitle: "同时将我挑选的【待问医生清单】同步给医生",
    shareQuestionsSub: "（可选 — 默认不勾选以保护腼腆患者隐私；您的完整 AI 聊天记录始终保密）",
    btnSendLabDoctor: "将检查报告发送至医生工作台 →",
    labSentFeedbackShared:
      "✓ 已发送！您的化验单解读与挑选的待问清单已同步至医生工作台。",
    labSentFeedbackPrivate:
      "✓ 已发送！仅发送了化验单与初步解读（您的所有个人提问均保持私密）。",

    // Doctor Panel: Pre-Visit & Searchable Orders
    docPanelTitle: "患者诊前简报与检查开单",
    badgeDoctorPanel: "医生主控面板",
    docEmptyTitle: "暂未收到患者提交的诊前简报。",
    docEmptyDesc:
      "请先前往 <strong>1. 患者视角</strong>，生成诊前评估并点击“发送摘要至医生工作台”开始流程。",
    docSymptomsHeading: "患者主诉症状",
    docAISharedHeading: "患者诊前 AI 咨询记录（患者已选择公开）",
    badgeAISimulated: "AI 辅助（模拟）",
    docAIHiddenNotice:
      "<strong>提示：</strong>该患者选择<em>不向医生公开</em>其诊前 AI 咨询记录，当前仅展示患者直接填写的症状。",

    ordersPanelTitle: "医生开具检查单（搜索联想或自由输入）",
    ordersPanelDesc:
      "输入检查缩写或部位（如 CT、MRI、超声、肝、血常规）快速检索，也可直接输入医院任意自定义检查项添加。",
    quickAddLabel: "常用快捷添加：",
    orderSearchPlaceholder: "输入关键词搜索（如 CT、MRI、核磁、肝、超声、心电图）或直接输入检查名...",
    btnAddOrder: "+ 添加",
    selectedOrdersLabel: "已选待开具的检查项目：",
    noOrdersYet: "尚未添加检查项。请在上方搜索输入，或点击快捷标签。",
    btnConfirmOrders: "确认开单并同步给患者",
    alertNoOrder: "请至少添加一项检查后再确认开单。",
    docOrderFeedback: "✓ 检查单已开具，并已实时同步至患者端。",

    // Doctor Panel: Lab Results
    docLabHeading: "患者上传的检查结果与 AI 初步倾向",
    docLabEmpty: "暂未收到患者上传的化验单。请先在“患者视角”完成上传并发送至医生端。",
    docQuestionsHeading: "患者面诊待问清单",
    docQuestionsPrivate:
      "<strong>隐私保护提示：</strong>该患者选择暂不向医生共享其追问清单，系统已尊重患者隐私。",
    docNoQuestions: "患者开启了共享开关，但未勾选具体待问问题。",

    // Doctor Panel: Final Diagnosis & Reconciliation
    docFinalTitle: "医生最终诊断与诊室共享屏批准",
    badgeDoctorControl: "医生最终裁决权",
    docFinalEmpty: "收到患者上传的检查结果后，即可在此核对 AI 初步倾向、下达最终诊断并解锁诊室共享屏。",
    docFinalDesc:
      "请结合临床经验核对 AI 的初步倾向（轻度非酒精性脂肪肝），选择同意或推翻并填写依据，最后点击批准投屏。",
    decisionAgreeTitle: "同意 AI 初步倾向（双重验证）",
    decisionAgreeSub: "确认为轻度非酒精性脂肪肝（NAFLD）——共享屏将显示医-AI 结论一致，增强患者信心。",
    decisionOverrideTitle: "推翻 AI 倾向（以医生临床终诊为准）",
    decisionOverrideSub: "用您的临床判断覆盖 AI 草案，并由 AI 协助向患者解释为何医生判断更准确。",
    overrideDiagLabel: "医生最终临床诊断：",
    defaultOverrideDiag: "一过性药物性肝应激（近期高频止痛药 + 熬夜诱发）",
    defaultAgreeDiag: "轻度非酒精性脂肪肝（NAFLD）——经医生临床确认",
    overrideReasonsLabel: "医生做出该判断的核心临床依据（用于协助向患者解释分歧）：",
    reasonMeds: "近期高频服用非处方止痛药的明确用药史（AI 未能充分权衡）",
    reasonExam: "线下腹部触诊与面对面体格检查结果",
    reasonLifestyle: "近两周集中熬夜与急性乏力的时间关联性",
    reasonHistory: "患者既往整体病史与个体代谢特征",
    customReasonLabel: "补充临床说明（可选）：",
    customReasonPlaceholder: "可选：输入您希望患者了解的额外临床判断细节...",
    carePlanLabel: "最终诊疗建议与后续计划（将展示在共享大屏）：",
    defaultCarePlan:
      "近期暂停非必要止痛药并严格戒酒，规律作息避免熬夜，4 周后复查肝功能（ALT/AST）确认指标恢复正常。",
    btnApproveShared: "批准并投屏至诊室共享屏 →",
    btnRevokeShared: "撤销投屏 / 重新锁定大屏",
    docApproveFeedback: "✓ 已批准投屏！请切至顶部“3. 诊室共享屏”查看医患同看画面。",
    docRevokeFeedback: "🔒 诊室共享屏已重新锁定并清空。",
    alertEmptyDiag: "请先填写最终临床诊断。",

    // Shared Display
    sharedTitle: "诊室医患共享显示屏",
    badgeDoctorGated: "医生审核后方可显示",
    badgeApprovedLive: "已获医生核准投屏",
    sharedLockTitle: "🔒 等待医生完成终审并批准投屏",
    sharedLockDesc:
      "为保障临床安全与医生决策主导权，AI 草案<strong>绝不会自动显示在共享大屏上</strong>。仅当医生在工作台核对并点击批准后，此处才会解锁展示。",
    btnAccessibleOn: "Aa 大字简明无障碍模式：关",
    btnAccessibleOff: "Aa 大字简明无障碍模式：开",
    sharedDocDiagHeading: "医生最终临床诊断",
    badgeDoctorVerified: "医生已核准",
    sharedCarePlanHeading: "医患共同确认的后续计划：",
    sharedLabHeading: "您的检查结果通俗摘要",
    badgeAIVerifiedDisplay: "AI 辅助通俗解读（模拟）",
    sharedQuestionsHeading: "您主动分享的本次面诊待问问题",
    badgePatientShared: "患者自愿分享",

    // Shared Display Reconciliation
    alignedTitle: "✓ 双重验证一致：医生临床判断与 AI 分析相符",
    alignedDesc:
      "您的主治医生经过面诊核实后，确认与 AI 的数据模式分析方向一致。最终诊断与治疗方案均由医生负责把关。",
    overrideTitle: "临床校准提示：以医生最终诊断为准（覆盖 AI 草案）",
    overrideIntro:
      "AI 只能看到孤立的化验单数字，医生结合面对面检查做出的最终判断更具临床权威性。",
    compareAILabel: "AI 初步草案（模拟，仅供参考）",
    compareAIDraftText: "轻度非酒精性脂肪肝（NAFLD）",
    compareDocLabel: "医生最终诊断（权威结论）",
    btnWhyDifferent: "为什么医生的诊断和 AI 说的不一样？",
    btnHideWhyDifferent: "收起解释",
    reconcileExpHeader: "AI 协助解释：为什么医生的判断比算法更贴合您的情况（模拟）",
    reconcileExpIntro:
      "AI 草案之所以先猜<strong>脂肪肝</strong>，仅仅因为在常规人群数据库里，“转氨酶偏高 + 超声偏亮”在统计学上最常见。但<strong>医生的最终诊断对您本人更准确</strong>，因为医生综合了算法无法获取的关键现实信息：",
    reconcileExpFooter:
      "AI 无法替代医生的线下体格检查和个体化临床经验——遵循医生确认后的诊疗计划是最稳妥安全的选择。",

    // Sample Clinical Content
    sampleSymptomText:
      "我最近两周一直感觉异常疲惫乏力，右上腹偶尔有轻微闷痛感，食欲也不太好。这段时间因为赶项目经常熬夜，头疼时还吃过几次止痛药。",

    aiLiverHTML: `
      <div class="ai-section-block">
        <h4>核心症状高亮</h4>
        <ul>
          <li>识别到的关键不适：<span class="key-term">持续乏力</span> 与 <span class="key-term">右上腹隐痛 / 食欲下降</span>。</li>
          <li>建议就诊优先级：<span class="urgency-tag">尽快预约常规门诊</span>（如出现剧痛或眼白发黄请立即急诊）。</li>
        </ul>
      </div>
      <div class="ai-section-block">
        <h4>医生可能会考虑的常规检查</h4>
        <ul>
          <li><span class="key-term">肝功能抽血化验（LFT）</span>——重点查看 <strong>ALT（谷丙转氨酶）</strong> 和 <strong>AST（谷草转氨酶）</strong> 指标。</li>
          <li><span class="key-term">腹部超声检查</span>——无创快速查看肝脏与胆囊结构是否异常。</li>
        </ul>
      </div>
    `,

    aiGeneralHTML: `
      <div class="ai-section-block">
        <h4>核心症状整理</h4>
        <ul>
          <li>已为您归纳为临床问诊简报：<span class="key-term">常规症状咨询</span>。</li>
          <li>建议就诊优先级：<span class="urgency-tag">预约医生面诊</span>（如症状突然加重请及时就医）。</li>
        </ul>
      </div>
      <div class="ai-section-block">
        <h4>就诊前建议准备的信息</h4>
        <ul>
          <li>记录症状<strong>开始的具体时间</strong>、诱因以及近期服用过的药物。</li>
          <li>医生将结合线下体格检查和您的既往病史决定后续检查方案。</li>
        </ul>
      </div>
    `,

    labReportHTML: `
      <div class="marker-grid">
        <div class="marker-card abnormal">
          <div class="marker-top">
            <strong>ALT（谷丙转氨酶）</strong>
            <span class="urgency-tag">118 U/L ↑ 偏高</span>
          </div>
          <small class="accessible-hide">正常参考范围：7–56 U/L</small>
          <p class="marker-explain"><strong>通俗解释：</strong>主要存在于肝细胞里的酶。当肝细胞受到刺激或损伤（如药物、熬夜、脂肪堆积或病毒）时，它会漏进血液导致数值升高。</p>
        </div>
        <div class="marker-card abnormal">
          <div class="marker-top">
            <strong>AST（谷草转氨酶）</strong>
            <span class="urgency-tag">74 U/L ↑ 偏高</span>
          </div>
          <small class="accessible-hide">正常参考范围：10–40 U/L</small>
          <p class="marker-explain"><strong>通俗解释：</strong>分布在肝脏和肌肉中的酶，与 ALT 同时轻度升高，说明近期肝脏存在一过性负荷或炎症反应。</p>
        </div>
        <div class="marker-card normal">
          <div class="marker-top">
            <strong>Total Bilirubin（总胆红素）</strong>
            <span class="normal-tag">14 µmol/L ✓ 正常</span>
          </div>
          <small class="accessible-hide">正常参考范围：3–20 µmol/L</small>
          <p class="marker-explain"><strong>通俗解释：</strong>肝脏负责排泄的胆汁色素。数值正常是好消息，说明胆道排泄通畅、没有黄疸。</p>
        </div>
      </div>

      <div class="ai-section-block">
        <h4>腹部超声结果（大白话翻译）</h4>
        <ul>
          <li>影像提示：<span class="key-term">肝脏回声轻度增强</span>——超声下肝脏比平时稍微“亮”一点，<strong>未见肿块、占位或胆结石</strong>。</li>
        </ul>
      </div>

      <div class="ai-section-block accessible-hide">
        <h4>AI 初步倾向（仅供医生参考，尚未核准）</h4>
        <ul>
          <li>仅从化验数值和超声图像特征来看，统计上最常见的对应情况是 <span class="key-term">轻度非酒精性脂肪肝（NAFLD）</span>。</li>
          <li><strong>AI 局限提示：</strong>算法无法综合您的详细用药史和体格检查，真实病因需由医生最终判断。</li>
        </ul>
      </div>
    `,

    qaAnswers: {
      cancer:
        "<strong>理性安抚（避免过度恐慌）：</strong>ALT（118）和 AST（74）属于轻中度升高，且总胆红素正常、超声<strong>未见任何肿块</strong>。这种情况在临床上<strong>绝大多数是可逆的良性原因</strong>（如药物影响、脂肪肝或作息压力），与肝癌相去甚远。",
      meds:
        "<strong>用药因素提醒：</strong>是的，常见非处方<span class='key-term'>止痛药（如对乙酰氨基酚、布洛芬等）</span>和保健品需要经过肝脏代谢，高频服用确实可能导致转氨酶升高。医生确诊前<strong>请勿自行买保肝药吃</strong>。",
      lifestyle:
        "<strong>面诊前的生活建议：</strong>近期请严格<span class='key-term'>戒酒</span>、暂停非必要保健品、尽量规律作息避免熬夜，饮食清淡，等待医生最终诊疗计划。",
      markers:
        "<strong>一句话分清 ALT 和 AST：</strong><span class='key-term'>ALT（谷丙）</span>是肝细胞的“专属警报器”，<span class='key-term'>AST（谷草）</span>反映更广泛的细胞应激。两者轻度升高说明肝细胞暂时受刺激，并非永久损伤。",
      fallback:
        "<strong>医疗安全边界提示：</strong>您的问题涉及个体化病史判断，超出模拟 AI 的安全解答范围。如果您愿意与医生讨论，可以点击下方按钮自愿将其加入<strong>【待问医生清单】</strong>。",
    },
  },

  it: {
    subtitle: "Sistema di Consultazione Trasparente Medico–Paziente–IA",
    statusSimulated: "Motore IA: Simulato (Slot API Riservato)",
    navPatientTitle: "1. Vista Paziente",
    navPatientSub: "Pre-visita e Referti",
    navDoctorTitle: "2. Pannello Medico",
    navDoctorSub: "Esami, Revisione e Controllo",
    navSharedTitle: "3. Schermo Condiviso",
    navSharedSub: "Display in Ambulatorio",

    // Patient: Pre-Visit
    previsitTitle: "Preparazione dei Sintomi Pre-Visita",
    badgeImplemented: "UI Implementata",
    previsitDesc:
      "Descrivi come ti senti prima della visita. CoConsult organizza i tuoi sintomi in modo chiaro—<strong>non è una diagnosi medica</strong>.",
    symptomLabel: "I tuoi Sintomi e Dubbi:",
    symptomPlaceholder:
      "Esempio: Mi sento molto stanco da due settimane, con un leggero fastidio all'addome superiore destro e scarso appetito...",
    btnLoadSample: "Carica Caso Esempio (Fegato / Stanchezza)",
    btnAskAI: "Ottieni Valutazione Pre-Visita IA",
    aiLoadingText: "Il motore IA simulato sta strutturando i tuoi sintomi...",
    badgeAIPrevisit: "Sintesi Pre-Visita Assistita da IA (Simulata)",
    aiDisclaimer: "Solo per preparazione alla visita — non è una diagnosi",
    shareCheckTitle: "Condividi apertamente la mia sintesi IA con il medico",
    shareCheckSub: "(Favorisce il dialogo trasparente evitando di nascondere l'uso dell'IA)",
    btnSendDoctor: "Invia Sintesi al Pannello Medico →",
    alertEmptySymptom: "Inserisci prima i tuoi sintomi, oppure clicca su 'Carica Caso Esempio'.",
    feedbackShared:
      "✓ Inviato! Sia i sintomi che la sintesi pre-visita IA sono ora visibili nel Pannello Medico.",
    feedbackPrivate:
      "✓ Inviato! Sono stati condivisi solo i sintomi (la sintesi IA resta privata).",

    // Patient: Lab Upload & Private Q&A
    labUploadTitle: "Carica Referti / Immagini e Spiegazione Chiara",
    labUploadDesc:
      "Carica le analisi del sangue o l'ecografia (o carica l'esempio). CoConsult evidenzia valori come <strong>ALT / AST</strong> in linguaggio semplice prima dell'incontro con il medico.",
    ordersReceivedTitle: "Esami Prescritti dal Medico (Pronti per il Caricamento):",
    uploadLabel: "Carica Analisi del Sangue o Immagine Diagnostica (JPG / PNG / PDF):",
    btnLoadSampleLab: "Carica Referto Epatico ed Ecografia di Esempio",
    btnAnalyseLab: "Spiega Referto con IA (Simulato)",
    labLoadingText: "Il motore OCR e IA simulato sta analizzando i marcatori (ALT / AST / Ecografia)...",
    badgeAILab: "Spiegazione Referti IA (Simulata)",
    labDisclaimer: "Solo spiegazione preliminare — la diagnosi finale spetta al medico",
    sampleFileLabel: "Esempio Caricato: Pannello_Epatico_ed_Ecografia.pdf (Dati Simulati)",
    alertNoLab: "Carica prima un file oppure clicca su 'Carica Referto Epatico ed Ecografia di Esempio'.",

    // Tiered Privacy Q&A
    qaTitle: "Fai Qualsiasi Domanda di Approfondimento (Testo Libero)",
    qaPrivacyPill: "🔒 Privato per Impostazione Predefinita",
    qaDesc:
      "Scrivi liberamente qualsiasi dubbio. La tua chat IA rimane completamente privata: decidi tu se selezionare singole domande da condividere con il medico.",
    qaPlaceholder: "Scrivi qui la tua domanda (es. Gli antidolorifici alzano l'ALT? È grave?)...",
    btnQASend: "Chiedi all'IA",
    alertEmptyQA: "Inserisci prima una domanda.",
    btnAddToDoctorList: "+ Aggiungi alla Lista per il Medico",
    btnSuggestedAdd: "+ Consigliato: Aggiungi alla Lista per il Medico",
    btnAddedToDoctorList: "✓ Aggiunta (Clicca per Rimuovere)",
    savedQuestionsTitle: "Domande Selezionate da Te per il Medico (Condivisione Opzionale):",
    btnRemoveItem: "Rimuovi",
    shareQuestionsTitle: "Condividi anche la mia lista di 'Domande per il Medico'",
    shareQuestionsSub: "(Opzionale — deselezionato per tutelare la privacy; la chat IA completa resta sempre privata)",
    btnSendLabDoctor: "Invia Referto al Pannello Medico →",
    labSentFeedbackShared:
      "✓ Inviato! La spiegazione del referto e le domande selezionate sono ora nel Pannello Medico.",
    labSentFeedbackPrivate:
      "✓ Inviato! È stato inviato solo il referto (tutte le tue domande personali restano private).",

    // Doctor Panel: Pre-Visit & Searchable Orders
    docPanelTitle: "Scheda Pre-Visita e Prescrizione Esami Diagnostici",
    badgeDoctorPanel: "Controllo Clinico",
    docEmptyTitle: "Nessuna scheda pre-visita ricevuta al momento.",
    docEmptyDesc:
      "Vai su <strong>1. Vista Paziente</strong>, genera la valutazione pre-visita e clicca su 'Invia Sintesi al Pannello Medico'.",
    docSymptomsHeading: "Sintomi Riferiti dal Paziente",
    docAISharedHeading: "Consultazione Pre-Visita IA del Paziente (Condivisa)",
    badgeAISimulated: "Assistito da IA (Simulato)",
    docAIHiddenNotice:
      "<strong>Avviso:</strong> Il paziente ha scelto di <em>non</em> condividere la sintesi IA pre-visita. Sono mostrati solo i sintomi diretti.",

    ordersPanelTitle: "Prescrizione Esami Clinici (Ricerca o Inserimento Libero)",
    ordersPanelDesc:
      "Cerca per tipologia o distretto (es. CT, TC, MRI, ecografia, fegato, sangue) oppure digita qualsiasi esame personalizzato.",
    quickAddLabel: "Aggiunta rapida:",
    orderSearchPlaceholder: "Cerca esami (es. TC, MRI, ALT, Ecografia, ECG) o scrivi un esame...",
    btnAddOrder: "+ Aggiungi",
    selectedOrdersLabel: "Esami Selezionati da Prescrivere:",
    noOrdersYet: "Nessun esame selezionato. Cerca sopra o usa i pulsanti rapidi.",
    btnConfirmOrders: "Conferma e Invia Prescrizioni al Paziente",
    alertNoOrder: "Aggiungi almeno un esame clinico prima di confermare.",
    docOrderFeedback: "✓ Prescrizioni confermate e sincronizzate nella Vista Paziente.",

    // Doctor Panel: Lab Results
    docLabHeading: "Referti Caricati dal Paziente e Ipotesi Preliminare IA",
    docLabEmpty: "Nessun referto caricato al momento. Completa il caricamento nella Vista Paziente per visualizzarlo qui.",
    docQuestionsHeading: "Domande del Paziente per la Visita",
    docQuestionsPrivate:
      "<strong>Privacy Rispettata:</strong> Il paziente ha scelto di mantenere private le proprie domande per ora.",
    docNoQuestions: "Il paziente ha attivato la condivisione ma non ha selezionato domande specifiche.",

    // Doctor Panel: Final Diagnosis & Reconciliation
    docFinalTitle: "Diagnosi Clinica Finale e Approvazione Schermo Condiviso",
    badgeDoctorControl: "Autorità Finale",
    docFinalEmpty: "Esamina i referti del paziente qui sopra prima di confermare la diagnosi finale e sbloccare lo Schermo Condiviso.",
    docFinalDesc:
      "Confronta l'ipotesi preliminare dell'IA (Lieve Steatosi Epatica) con la tua valutazione clinica, scegli se confermare o modificare, poi approva la visualizzazione in ambulatorio.",
    decisionAgreeTitle: "Conferma Ipotesi Preliminare IA",
    decisionAgreeSub: "Conferma Lieve Steatosi Epatica (NAFLD) — mostra l'allineamento medico-IA.",
    decisionOverrideTitle: "Supera l'Ipotesi IA (Usa Diagnosi Medica)",
    decisionOverrideSub: "Inserisci la tua diagnosi clinica e lascia che CoConsult spieghi al paziente il tuo ragionamento.",
    overrideDiagLabel: "Diagnosi Clinica Finale del Medico:",
    defaultOverrideDiag: "Stress Epatico Transitorio da Farmaci (Antidolorifici e Carenza di Sonno)",
    defaultAgreeDiag: "Lieve Steatosi Epatica Non Alcolica (NAFLD) — Confermata dal Medico",
    overrideReasonsLabel: "Fattori Clinici alla Base della Decisione (Usati dall'IA per Spiegare la Differenza):",
    reasonMeds: "Uso recente e frequente di antidolorifici da banco (non pienamente ponderato dall'IA)",
    reasonExam: "Esame obiettivo e palpazione addominale diretta in ambulatorio",
    reasonLifestyle: "Carenza acuta di sonno nelle ultime due settimane e decorso dei sintomi",
    reasonHistory: "Storia clinica complessiva e profilo metabolico individuale del paziente",
    customReasonLabel: "Nota Clinica Aggiuntiva (Opzionale):",
    customReasonPlaceholder: "Opzionale: aggiungi ulteriori dettagli clinici per la spiegazione al paziente...",
    carePlanLabel: "Piano Terapeutico Finale e Prossimi Passi (Visibile sullo Schermo Condiviso):",
    defaultCarePlan:
      "Sospendere antidolorifici non necessari e alcol, recuperare un sonno regolare e ripetere gli esami epatici (ALT/AST) tra 4 settimane per confermare la normalizzazione.",
    btnApproveShared: "Approva e Proietta sullo Schermo Condiviso →",
    btnRevokeShared: "Blocca / Pulisci Schermo Condiviso",
    docApproveFeedback: "✓ Approvato! Passa a '3. Schermo Condiviso' per rivedere la schermata con il paziente.",
    docRevokeFeedback: "🔒 Lo Schermo Condiviso è stato bloccato e ripulito.",
    alertEmptyDiag: "Inserisci una diagnosi clinica finale prima di approvare.",

    // Shared Display
    sharedTitle: "Schermo Condiviso in Ambulatorio",
    badgeDoctorGated: "Visibilità Controllata dal Medico",
    badgeApprovedLive: "Approvato dal Medico",
    sharedLockTitle: "🔒 In Attesa della Conferma Finale del Medico",
    sharedLockDesc:
      "Per garantire la sicurezza clinica e l'autorità del medico, le bozze IA <strong>non vengono mai proiettate automaticamente</strong>. I contenuti si sbloccano solo dopo l'approvazione del medico.",
    btnAccessibleOn: "Aa Modalità Semplificata / Testo Grande: OFF",
    btnAccessibleOff: "Aa Modalità Semplificata / Testo Grande: ON",
    sharedDocDiagHeading: "Diagnosi Clinica Finale del Medico",
    badgeDoctorVerified: "Verificato dal Medico",
    sharedCarePlanHeading: "Piano Condiviso e Prossimi Passi:",
    sharedLabHeading: "Sintesi Chiara dei Tuoi Esami",
    badgeAIVerifiedDisplay: "Spiegazione Assistita da IA (Simulata)",
    sharedQuestionsHeading: "Le Tue Domande Selezionate per la Visita",
    badgePatientShared: "Condiviso dal Paziente",

    // Shared Display Reconciliation
    alignedTitle: "✓ Doppia Verifica: Medico e IA Allineati",
    alignedDesc:
      "La visita del medico e l'analisi dei dati dell'IA concordano sulla stessa valutazione. La diagnosi e il piano di cura restano guidati dal tuo medico.",
    overrideTitle: "Aggiornamento Clinico: La Diagnosi del Medico Prevale sulla Bozza IA",
    overrideIntro:
      "Poiché un'IA legge solo numeri isolati, la valutazione clinica completa del medico ha sempre la priorità.",
    compareAILabel: "Bozza Preliminare IA (Simulata)",
    compareAIDraftText: "Lieve Steatosi Epatica Non Alcolica (NAFLD)",
    compareDocLabel: "Diagnosi Finale del Medico (Autorevole)",
    btnWhyDifferent: "Perché la diagnosi del medico è diversa da quella dell'IA?",
    btnHideWhyDifferent: "Nascondi spiegazione",
    reconcileExpHeader: "Spiegazione IA a Supporto della Decisione Medica (Simulata)",
    reconcileExpIntro:
      "La bozza IA aveva ipotizzato una <strong>Steatosi Epatica</strong> solo perché valori elevati di ALT/AST con ecografia brillante sono lo schema statisticamente più frequente. Tuttavia, <strong>la diagnosi del medico è più accurata per il tuo caso specifico</strong> perché integra fattori reali invisibili all'algoritmo:",
    reconcileExpFooter:
      "L'IA non può sostituire l'esame obiettivo né il contesto individuale: seguire il piano confermato dal medico è la scelta più sicura.",

    // Sample Clinical Content
    sampleSymptomText:
      "Mi sento insolitamente stanco da due settimane, con un lieve fastidio sordo nella parte superiore destra dell'addome e poco appetito. Ultimamente ho fatto tardi la notte e ho assunto antidolorifici per il mal di testa.",

    aiLiverHTML: `
      <div class="ai-section-block">
        <h4>Punti Chiave dei Sintomi</h4>
        <ul>
          <li>Sintomi rilevati: <span class="key-term">Stanchezza Persistente</span> e <span class="key-term">Fastidio Addominale Superiore Destro</span>.</li>
          <li>Priorità consigliata: <span class="urgency-tag">Visita Medica di Base a Breve</span> (Recarsi al pronto soccorso in caso di dolore acuto o ittero).</li>
        </ul>
      </div>
      <div class="ai-section-block">
        <h4>Esami che il Medico Potrebbe Valutare</h4>
        <ul>
          <li><span class="key-term">Esami della Funzionalità Epatica (LFT)</span> — controllo di enzimi come <strong>ALT</strong> e <strong>AST</strong>.</li>
          <li><span class="key-term">Ecografia Addominale</span> — esame rapido e non invasivo per valutare fegato e colecisti.</li>
        </ul>
      </div>
    `,

    aiGeneralHTML: `
      <div class="ai-section-block">
        <h4>Riepilogo dei Sintomi</h4>
        <ul>
          <li>Nota strutturata per la visita: <span class="key-term">Valutazione Sintomi Generali</span>.</li>
          <li>Priorità consigliata: <span class="urgency-tag">Parlarne con il Medico</span> (Chiedere assistenza urgente se i sintomi peggiorano rapidamente).</li>
        </ul>
      </div>
      <div class="ai-section-block">
        <h4>Come Prepararsi alla Visita</h4>
        <ul>
          <li>Annota <strong>quando sono iniziati i sintomi</strong>, eventuali fattori scatenanti e farmaci assunti.</li>
          <li>Il medico integrerà l'esame obiettivo con la tua storia clinica per decidere gli accertamenti.</li>
        </ul>
      </div>
    `,

    labReportHTML: `
      <div class="marker-grid">
        <div class="marker-card abnormal">
          <div class="marker-top">
            <strong>ALT (Alanina Transaminasi)</strong>
            <span class="urgency-tag">118 U/L ↑ ALTO</span>
          </div>
          <small class="accessible-hide">Valori normali: 7–56 U/L</small>
          <p class="marker-explain"><strong>In parole semplici:</strong> Un enzima presente soprattutto nelle cellule del fegato. Quando il fegato è affaticato (per farmaci, stress, grasso o virus), l'ALT passa nel sangue.</p>
        </div>
        <div class="marker-card abnormal">
          <div class="marker-top">
            <strong>AST (Aspartato Transaminasi)</strong>
            <span class="urgency-tag">74 U/L ↑ ALTO</span>
          </div>
          <small class="accessible-hide">Valori normali: 10–40 U/L</small>
          <p class="marker-explain"><strong>In parole semplici:</strong> Un altro enzima presente nel fegato e nei muscoli. Un lieve aumento insieme all'ALT indica uno stress epatico temporaneo.</p>
        </div>
        <div class="marker-card normal">
          <div class="marker-top">
            <strong>Bilirubina Totale</strong>
            <span class="normal-tag">14 µmol/L ✓ NORMALE</span>
          </div>
          <small class="accessible-hide">Valori normali: 3–20 µmol/L</small>
          <p class="marker-explain"><strong>In parole semplici:</strong> Un pigmento eliminato dal fegato. Un valore normale è rassicurante: le vie biliari sono libere.</p>
        </div>
      </div>

      <div class="ai-section-block">
        <h4>Sintesi Ecografia Addominale (Linguaggio Semplice)</h4>
        <ul>
          <li>Referto: <span class="key-term">Lieve aumento dell'ecogenicità epatica</span> — il fegato appare leggermente più "brillante" del normale all'ecografia, <strong>senza masse o calcoli biliari</strong>.</li>
        </ul>
      </div>

      <div class="ai-section-block accessible-hide">
        <h4>Ipotesi Preliminare IA (In Attesa di Verifica Medica)</h4>
        <ul>
          <li>Basandosi solo sui valori numerici e sull'ecografia, lo schema statisticamente più comune è una <span class="key-term">Lieve Steatosi Epatica Non Alcolica (Fegato Grasso)</span>.</li>
          <li><strong>Limite dell'IA:</strong> Questa bozza non valuta la storia completa dei farmaci né l'esame obiettivo: sarà il medico a stabilire la causa reale.</li>
        </ul>
      </div>
    `,

    qaAnswers: {
      cancer:
        "<strong>Rassicurazione Calibrata:</strong> Valori lievemente elevati di ALT (118) e AST (74) con bilirubina normale e <em>nessuna massa</em> all'ecografia dipendono <strong>molto più spesso da cause reversibili</strong> (farmaci, steatosi o stress) che da tumori.",
      meds:
        "<strong>Fattore Farmaci:</strong> Sì, gli <span class='key-term'>antidolorifici da banco (es. paracetamolo/FANS)</span> sono metabolizzati dal fegato e possono alzare temporaneamente ALT/AST. <strong>Non assumere integratori fai-da-te</strong> prima di parlare con il medico.",
      lifestyle:
        "<strong>Consigli Pratici in Attesa della Visita:</strong> Evita l'<span class='key-term'>alcol</span>, riposa adeguatamente e mantieni pasti leggeri fino alla conferma del medico.",
      markers:
        "<strong>ALT vs. AST in Breve:</strong> L'<span class='key-term'>ALT</span> è il campanello d'allarme più specifico del fegato, mentre l'<span class='key-term'>AST</span> riflette uno stress cellulare più generale. Un aumento moderato indica irritazione temporanea, non danno permanente.",
      fallback:
        "<strong>Limite di Sicurezza Clinica:</strong> Questa domanda richiede una valutazione clinica personalizzata. Se ti senti a tuo agio nel condividerla, clicca il pulsante qui sotto per aggiungerla alla tua <strong>Lista per il Medico</strong>.",
    },
  },
};