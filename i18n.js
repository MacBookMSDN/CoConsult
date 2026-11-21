// =========================================================
// CoConsult v1 — Trilingual Language Pack (EN / 中文 / IT)
// Supports inclusive, culturally accessible clinical UI
// =========================================================

const TRANSLATIONS = {
  en: {
    subtitle: "Transparent Doctor–Patient–AI Consultation System",
    statusSimulated: "AI Engine: Simulated (API Slot Reserved)",
    navPatientTitle: "1. Patient View",
    navPatientSub: "Pre-Visit & Reports",
    navDoctorTitle: "2. Doctor Dashboard",
    navDoctorSub: "Review & Control",
    navSharedTitle: "3. Shared Display",
    navSharedSub: "In-Room Screen",

    stage1Title: "Stage 1: Pre-Visit Symptom Preparation",
    badgeImplemented: "Implemented UI",
    stage1Desc:
      "Describe how you feel before seeing your doctor. CoConsult structures your symptoms for the visit—<strong>not a final diagnosis</strong>.",
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

    v2PatientTitle: "Stage 3: Upload Lab Results / Scans & Free-Text Q&A",
    badgeNextV2: "Next Update (v2)",
    v2PatientDesc:
      "Lab report upload (e.g., ALT / AST liver markers), highlighted plain-language explanations, and free-text follow-up questions will be added in v2.",

    docPanelTitle: "Doctor Dashboard — Incoming Pre-Visit Brief",
    badgeDoctorPanel: "Clinician Control Panel",
    docEmptyTitle: "No patient pre-visit brief received yet.",
    docEmptyDesc:
      "Go to <strong>1. Patient View</strong>, run a pre-visit appraisal, and click 'Send Summary to Doctor Dashboard' to test the workflow.",
    docSymptomsHeading: "Patient-Reported Symptoms",
    docAISharedHeading: "Patient's Pre-Visit AI Query (Shared Openly)",
    badgeAISimulated: "AI-Assisted (Simulated)",
    docAIHiddenNotice:
      "<strong>Notice:</strong> The patient chose <em>not</em> to share their pre-visit AI summary. Only direct symptom notes are shown above.",

    v2DoctorTitle: "Clinical Orders, Diagnosis Override & Screen Approval",
    badgeNextV2V3: "Next Updates (v2–v3)",
    v2DoctorDesc:
      "Controls for ordering tests, agreeing with or overriding AI preliminary findings, and approving content for the Shared Display will be added in upcoming commits.",

    sharedTitle: "In-Room Shared Consultation Display",
    badgeDoctorGated: "Doctor-Gated Visibility",
    sharedLockTitle: "🔒 Awaiting Clinician Approval",
    sharedLockDesc:
      "To protect clinical safety and preserve physician authority, AI outputs are <strong>never projected automatically</strong> onto the shared screen. Content appears here only after the doctor reviews and approves it.",

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
      <div class="ai-section-block">
        <h4>Suggested Questions for Your Doctor</h4>
        <ul>
          <li>Could my recent late nights or painkiller use explain these symptoms?</li>
          <li>Which blood tests or scans do you recommend first?</li>
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
  },

  zh: {
    subtitle: "医-患-AI 透明协作问诊系统原型",
    statusSimulated: "AI 引擎：模拟模式（已预留 API 接口）",
    navPatientTitle: "1. 患者视角",
    navPatientSub: "诊前自查与报告解读",
    navDoctorTitle: "2. 医生工作台",
    navDoctorSub: "审核、开单与终审控制",
    navSharedTitle: "3. 诊室共享屏",
    navSharedSub: "医患同看大屏",

    stage1Title: "阶段 1：诊前症状整理与自查",
    badgeImplemented: "已实现界面",
    stage1Desc:
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

    v2PatientTitle: "阶段 3：上传化验单 / 影像片 & 自由追问",
    badgeNextV2: "下个版本 (v2)",
    v2PatientDesc:
      "化验单上传（如谷丙转氨酶 ALT / 谷草转氨酶 AST）、重点高亮大白话解读，以及自由打字追问框将在 v2 中加入。",

    docPanelTitle: "医生工作台 — 患者诊前简报",
    badgeDoctorPanel: "医生主控面板",
    docEmptyTitle: "暂未收到患者提交的诊前简报。",
    docEmptyDesc:
      "请先前往 <strong>1. 患者视角</strong>，生成诊前评估并点击“发送摘要至医生工作台”体验流程。",
    docSymptomsHeading: "患者主诉症状",
    docAISharedHeading: "患者诊前 AI 咨询记录（患者已选择公开）",
    badgeAISimulated: "AI 辅助（模拟）",
    docAIHiddenNotice:
      "<strong>提示：</strong>该患者选择<em>不向医生公开</em>其诊前 AI 咨询记录，当前仅展示患者直接填写的症状。",

    v2DoctorTitle: "医生开具检查单、终审裁决与投屏批准",
    badgeNextV2V3: "后续版本 (v2–v3)",
    v2DoctorDesc:
      "医生勾选检查项、同意或推翻 AI 初步判断、以及“批准投屏至共享大屏”的完整控制功能将在接下来的提交中逐步完成。",

    sharedTitle: "诊室医患共享显示屏",
    badgeDoctorGated: "医生审核后方可显示",
    sharedLockTitle: "🔒 等待医生审核并批准投屏",
    sharedLockDesc:
      "为保障临床安全并维护医生的最终诊疗权威，AI 输出<strong>绝不会自动投放到共享大屏</strong>。只有经医生在工作台核对并点击批准后，内容才会同步显示在此处。",

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
      <div class="ai-section-block">
        <h4>建议就诊时主动问医生的问题</h4>
        <ul>
          <li>我最近的熬夜和服用止痛药经历，会不会是引起不适的原因？</li>
          <li>您建议我先做抽血化验还是先拍超声？</li>
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
  },

  it: {
    subtitle: "Sistema di Consultazione Trasparente Medico–Paziente–IA",
    statusSimulated: "Motore IA: Simulato (Slot API Riservato)",
    navPatientTitle: "1. Vista Paziente",
    navPatientSub: "Pre-visita e Referti",
    navDoctorTitle: "2. Pannello Medico",
    navDoctorSub: "Revisione e Controllo",
    navSharedTitle: "3. Schermo Condiviso",
    navSharedSub: "Display in Ambulatorio",

    stage1Title: "Fase 1: Preparazione dei Sintomi Pre-Visita",
    badgeImplemented: "UI Implementata",
    stage1Desc:
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

    v2PatientTitle: "Fase 3: Caricamento Esami / Immagini e Domande Libere",
    badgeNextV2: "Prossimo Aggiornamento (v2)",
    v2PatientDesc:
      "Il caricamento dei referti (es. valori epatici ALT / AST), le spiegazioni evidenziate in linguaggio semplice e la chat libera saranno aggiunti nella v2.",

    docPanelTitle: "Pannello Medico — Scheda Pre-Visita del Paziente",
    badgeDoctorPanel: "Controllo Clinico",
    docEmptyTitle: "Nessuna scheda pre-visita ricevuta al momento.",
    docEmptyDesc:
      "Vai su <strong>1. Vista Paziente</strong>, genera la valutazione pre-visita e clicca su 'Invia Sintesi al Pannello Medico' per testare il flusso.",
    docSymptomsHeading: "Sintomi Riferiti dal Paziente",
    docAISharedHeading: "Consultazione Pre-Visita IA del Paziente (Condivisa)",
    badgeAISimulated: "Assistito da IA (Simulato)",
    docAIHiddenNotice:
      "<strong>Avviso:</strong> Il paziente ha scelto di <em>non</em> condividere la sintesi IA pre-visita. Sono mostrati solo i sintomi diretti.",

    v2DoctorTitle: "Prescrizione Esami, Revisione Diagnosi e Approvazione Schermo",
    badgeNextV2V3: "Prossimi Aggiornamenti (v2–v3)",
    v2DoctorDesc:
      "I controlli per prescrivere esami, confermare o modificare la valutazione IA e approvare i contenuti per lo Schermo Condiviso verranno aggiunti nei prossimi commit.",

    sharedTitle: "Schermo Condiviso in Ambulatorio",
    badgeDoctorGated: "Visibilità Controllata dal Medico",
    sharedLockTitle: "🔒 In Attesa di Approvazione del Medico",
    sharedLockDesc:
      "Per garantire la sicurezza clinica e preservare l'autorità del medico, gli output dell'IA <strong>non vengono mai proiettati automaticamente</strong>. I contenuti appaiono qui solo dopo revisione e conferma del medico.",

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
      <div class="ai-section-block">
        <h4>Domande Utili da Porre al Medico</h4>
        <ul>
          <li>La carenza di sonno o gli antidolorifici recenti possono influire su questi sintomi?</li>
          <li>Quali analisi del sangue o ecografie consiglia di fare per prime?</li>
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
  },
};