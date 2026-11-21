// =========================================================
// CoConsult v2 — Trilingual Language Pack (EN / 中文 / IT)
// Covers Stage 1 (Pre-Visit), Stage 2 (Doctor Orders), and
// Stage 3 (Lab/Scan Explainer & Free-Text Follow-Up Q&A)
// =========================================================

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

    // Stage 1
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

    // Stage 2 (Doctor Orders)
    stage2Title: "Stage 2: Clinical Test Orders (Doctor Controlled)",
    stage2Desc:
      "Based on your clinical judgment and the patient's brief, select the diagnostic tests to order:",
    orderLFT: "Liver Function Blood Test (ALT, AST, Total Bilirubin)",
    orderUltrasound: "Abdominal Ultrasound Scan (Liver & Gallbladder)",
    orderCBC: "Complete Blood Count (CBC)",
    btnConfirmOrders: "Confirm & Send Test Orders to Patient",
    alertNoOrder: "Please select at least one clinical test to order.",
    docOrderFeedback: "✓ Test orders confirmed and synced to the Patient View.",

    // Stage 3 (Lab Upload & Q&A)
    stage3Title: "Stage 3: Upload Lab Results / Scans & Plain-Language Explainer",
    stage3Desc:
      "Upload your blood test or scan image (or load the sample liver report). CoConsult highlights abnormal markers like <strong>ALT / AST</strong> in plain language so you understand your results before the final diagnosis.",
    ordersReceivedTitle: "Clinician-Ordered Tests Ready for Upload:",
    uploadLabel: "Upload Blood Test Report or Scan Image (JPG / PNG / PDF):",
    btnLoadSampleLab: "Load Sample Liver Lab & Ultrasound",
    btnAnalyseLab: "Explain Report with AI (Simulated)",
    labLoadingText: "Simulated OCR & AI explainer are extracting key markers (ALT / AST / Ultrasound)...",
    badgeAILab: "AI Lab & Scan Explainer (Simulated)",
    labDisclaimer: "Preliminary explanation only — final diagnosis rests with your doctor",
    sampleFileLabel: "Sample Loaded: Liver_Function_Panel_and_Ultrasound.pdf (Simulated Data)",
    alertNoLab: "Please upload a file or click 'Load Sample Liver Lab & Ultrasound' first.",

    // Free-Text Q&A
    qaTitle: "Ask Any Follow-Up Question (Free Text)",
    qaDesc:
      "Type any question in your own words (e.g., about ALT/AST, painkillers, diet, or whether this is serious). Questions outside safe general guidance are automatically saved for your doctor.",
    qaPlaceholder: "Type your question here (e.g., Could painkillers cause high ALT? Is this cancer?)...",
    btnQASend: "Ask AI",
    alertEmptyQA: "Please type a question first.",
    savedQuestionsTitle: "Questions Saved for Your Doctor (Synced to Consultation):",
    btnSendLabDoctor: "Send Lab Findings & Questions to Doctor Dashboard →",
    labSentFeedback:
      "✓ Sent! Your lab interpretation and follow-up questions are now ready in the Doctor Dashboard.",

    // Doctor Panel
    docPanelTitle: "Doctor Dashboard — Incoming Pre-Visit Brief",
    badgeDoctorPanel: "Clinician Control Panel",
    docEmptyTitle: "No patient pre-visit brief received yet.",
    docEmptyDesc:
      "Go to <strong>1. Patient View</strong>, run a pre-visit appraisal, and click 'Send Summary to Doctor Dashboard' to begin.",
    docSymptomsHeading: "Patient-Reported Symptoms",
    docAISharedHeading: "Patient's Pre-Visit AI Query (Shared Openly)",
    badgeAISimulated: "AI-Assisted (Simulated)",
    docAIHiddenNotice:
      "<strong>Notice:</strong> The patient chose <em>not</em> to share their pre-visit AI summary. Only direct symptom notes are shown above.",
    docLabHeading: "Stage 3: Patient Lab Results, AI Preliminary Impression & Questions",
    docLabEmpty: "No lab report submitted yet. Complete Stage 3 in Patient View to review markers and AI draft here.",
    docQuestionsHeading: "Patient's Unresolved Questions (Flagged for Face-to-Face Discussion)",
    docNoQuestions: "No unresolved questions flagged by the patient yet.",

    v3DoctorTitle: "Stage 4: Final Diagnosis Override, Reconciliation & Shared Screen Approval",
    badgeNextV3: "Next Update (v3)",
    v3DoctorDesc:
      "Controls to agree with or override the AI's preliminary impression, enter clinical reasoning, and unlock the Shared Display will be added in v3.",

    // Shared Display
    sharedTitle: "In-Room Shared Consultation Display",
    badgeDoctorGated: "Doctor-Gated Visibility",
    sharedLockTitle: "🔒 Awaiting Clinician Final Approval",
    sharedLockDesc:
      "Lab interpretations and AI preliminary impressions remain hidden here until the doctor verifies the final diagnosis and clicks Approve (implemented in v3).",

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
          <small>Normal range: 7–56 U/L</small>
          <p class="marker-explain"><strong>Plain meaning:</strong> An enzyme mainly inside liver cells. When liver cells are stressed or irritated (by fatty buildup, alcohol, viruses, or medications), ALT leaks into the blood.</p>
        </div>
        <div class="marker-card abnormal">
          <div class="marker-top">
            <strong>AST (Aspartate Transaminase)</strong>
            <span class="urgency-tag">74 U/L ↑ HIGH</span>
          </div>
          <small>Normal range: 10–40 U/L</small>
          <p class="marker-explain"><strong>Plain meaning:</strong> Another enzyme found in the liver and muscles. Mildly elevated alongside ALT confirms temporary liver cell stress.</p>
        </div>
        <div class="marker-card normal">
          <div class="marker-top">
            <strong>Total Bilirubin</strong>
            <span class="normal-tag">14 µmol/L ✓ NORMAL</span>
          </div>
          <small>Normal range: 3–20 µmol/L</small>
          <p class="marker-explain"><strong>Plain meaning:</strong> A yellow pigment cleared by the liver. A normal level is reassuring—it suggests your bile drainage is not blocked.</p>
        </div>
      </div>

      <div class="ai-section-block">
        <h4>Abdominal Ultrasound Summary (Plain Language)</h4>
        <ul>
          <li>Scan note: <span class="key-term">Mildly increased liver echogenicity</span> — means the liver appears slightly brighter than usual on ultrasound, with <strong>no masses or gallstones seen</strong>.</li>
        </ul>
      </div>

      <div class="ai-section-block">
        <h4>AI Preliminary Impression (Pending Doctor Verification)</h4>
        <ul>
          <li>Based strictly on numeric patterns and scan brightness, the most statistically common pattern is <span class="key-term">Mild Non-Alcoholic Fatty Liver (NAFLD)</span>.</li>
          <li><strong>Limitation:</strong> This AI draft cannot evaluate your full medication history or physical exam—your doctor will determine the true cause.</li>
        </ul>
      </div>
    `,

    qaAnswers: {
      cancer:
        "<strong>Calibrated Reassurance:</strong> Mildly raised ALT (118) and AST (74) with a normal bilirubin and <em>no masses</em> on ultrasound are <strong>far more commonly caused by reversible factors</strong> (such as fatty liver, medications, or sleep stress) than by cancer. Your doctor will confirm the exact cause safely.",
      meds:
        "<strong>Medication Factor:</strong> Yes—over-the-counter <span class='key-term'>painkillers (e.g., paracetamol/NSAIDs)</span>, supplements, or herbal remedies are processed by the liver and can temporarily raise ALT/AST. <strong>Do not self-medicate</strong> with liver pills before checking with your doctor; tell them the exact drug names and doses you took.",
      lifestyle:
        "<strong>Practical Next Steps While Waiting:</strong> Avoid <span class='key-term'>alcohol</span> completely, pause unnecessary supplements, prioritise sleep, and keep meals light (less greasy/sugary food). Wait for your doctor's confirmed plan before making major changes.",
      markers:
        "<strong>ALT vs. AST in One Line:</strong> Think of <span class='key-term'>ALT</span> as a liver-specific alarm bell, while <span class='key-term'>AST</span> is a broader cell-stress indicator. Both being mildly high simply signals your liver cells are currently irritated—not permanently damaged.",
      fallback:
        "<strong>Medical Safety Boundary:</strong> Because this question involves personalised clinical judgement beyond the simulated knowledge base, I have <strong>automatically added it to your 'Questions for Your Doctor' list</strong> below so you can discuss it directly during your consultation.",
    },
  },

  zh: {
    subtitle: "医-患-AI 透明协作问诊系统原型",
    statusSimulated: "AI 引擎：模拟模式（已预留 API 接口）",
    navPatientTitle: "1. 患者视角",
    navPatientSub: "诊前自查与报告解读",
    navDoctorTitle: "2. 医生工作台",
    navDoctorSub: "开单、审核与控制",
    navSharedTitle: "3. 诊室共享屏",
    navSharedSub: "医患同看大屏",

    // Stage 1
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

    // Stage 2
    stage2Title: "阶段 2：医生开具检查单（医生自主决策）",
    stage2Desc: "请结合您的临床经验与患者简报，勾选需要开具的检查项目：",
    orderLFT: "肝功能抽血化验（ALT 谷丙、AST 谷草、总胆红素）",
    orderUltrasound: "腹部超声检查（肝脏与胆囊）",
    orderCBC: "血常规检查（CBC）",
    btnConfirmOrders: "确认开单并同步给患者",
    alertNoOrder: "请至少勾选一项检查。",
    docOrderFeedback: "✓ 检查单已开具，并已同步显示在患者端。",

    // Stage 3
    stage3Title: "阶段 3：上传化验单 / 影像片 & AI 大白话解读",
    stage3Desc:
      "上传您的抽血报告或检查片子（也可点击加载肝功能样例）。CoConsult 会高亮 <strong>ALT / AST</strong> 等异常指标并用通俗语言解释含义，帮您听懂专业术语。",
    ordersReceivedTitle: "医生已为您开具以下检查（完成后请上传）：",
    uploadLabel: "上传化验单或影像片（支持 JPG / PNG / PDF）：",
    btnLoadSampleLab: "一键加载样例（肝功能化验单 + 腹部超声）",
    btnAnalyseLab: "让 AI 通俗解读报告（模拟）",
    labLoadingText: "模拟 OCR 与 AI 解读引擎正在提取核心指标（ALT / AST / 超声）...",
    badgeAILab: "AI 化验单与影像解读（模拟输出）",
    labDisclaimer: "仅作初步科普与理解辅助 — 最终诊断以医生为准",
    sampleFileLabel: "已加载样例：肝功能全套与腹部超声报告.pdf（模拟数据）",
    alertNoLab: "请先上传本地文件，或点击“一键加载样例”。",

    // Free-Text Q&A
    qaTitle: "还有疑问？直接自由打字追问",
    qaDesc:
      "用自己的话随便提问（如：ALT高是不是绝症、吃止痛药有没有关系、平时怎么忌口等）。超出安全边界的个体病史问题会自动加入【待问医生清单】。",
    qaPlaceholder: "输入您想问的任何问题（例如：止痛药会导致谷丙转氨酶高吗？严不严重？）...",
    btnQASend: "提问",
    alertEmptyQA: "请先输入您的问题。",
    savedQuestionsTitle: "已自动加入【诊室待问医生清单】（同步给医生）：",
    btnSendLabDoctor: "将报告解读与待问清单发给医生终审 →",
    labSentFeedback:
      "✓ 已发送！您的化验单核心解读与待问清单已同步至医生工作台。",

    // Doctor Panel
    docPanelTitle: "医生工作台 — 患者诊前简报",
    badgeDoctorPanel: "医生主控面板",
    docEmptyTitle: "暂未收到患者提交的诊前简报。",
    docEmptyDesc:
      "请先前往 <strong>1. 患者视角</strong>，生成诊前评估并点击“发送摘要至医生工作台”开始流程。",
    docSymptomsHeading: "患者主诉症状",
    docAISharedHeading: "患者诊前 AI 咨询记录（患者已选择公开）",
    badgeAISimulated: "AI 辅助（模拟）",
    docAIHiddenNotice:
      "<strong>提示：</strong>该患者选择<em>不向医生公开</em>其诊前 AI 咨询记录，当前仅展示患者直接填写的症状。",
    docLabHeading: "阶段 3：患者上传的检查结果、AI 初步判断与疑问清单",
    docLabEmpty: "暂未收到患者上传的化验单。请先在“患者视角”完成阶段 3 并发送至医生端。",
    docQuestionsHeading: "患者未能解决的个体疑问（需面诊沟通）",
    docNoQuestions: "患者暂未标记需要当面讨论的未解问题。",

    v3DoctorTitle: "阶段 4：医生最终诊断（同意/推翻 AI）、分歧调解与批准投屏",
    badgeNextV3: "下个版本 (v3)",
    v3DoctorDesc:
      "医生同意或推翻 AI 初步判断、填写临床依据、解锁共享大屏及“AI 替医生解释为何结论不同”的功能将在 v3 加入。",

    // Shared Display
    sharedTitle: "诊室医患共享显示屏",
    badgeDoctorGated: "医生审核后方可显示",
    sharedLockTitle: "🔒 等待医生完成终审并批准投屏",
    sharedLockDesc:
      "在医生核对化验单并给出最终诊断之前，AI 初步判断<strong>不会自动显示在共享大屏上</strong>，以防误导患者并维护医生决策主导权（将在 v3 解锁投屏）。",

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
          <small>正常参考范围：7–56 U/L</small>
          <p class="marker-explain"><strong>通俗解释：</strong>主要存在于肝细胞里的酶。当肝细胞受到刺激或损伤（如脂肪堆积、药物、熬夜、病毒）时，它会漏进血液导致数值升高。</p>
        </div>
        <div class="marker-card abnormal">
          <div class="marker-top">
            <strong>AST（谷草转氨酶）</strong>
            <span class="urgency-tag">74 U/L ↑ 偏高</span>
          </div>
          <small>正常参考范围：10–40 U/L</small>
          <p class="marker-explain"><strong>通俗解释：</strong>分布在肝脏和肌肉中的酶，与 ALT 同时轻度升高，说明近期肝脏存在一过性负荷或炎症反应。</p>
        </div>
        <div class="marker-card normal">
          <div class="marker-top">
            <strong>Total Bilirubin（总胆红素）</strong>
            <span class="normal-tag">14 µmol/L ✓ 正常</span>
          </div>
          <small>正常参考范围：3–20 µmol/L</small>
          <p class="marker-explain"><strong>通俗解释：</strong>肝脏负责排泄的胆汁色素。数值正常是好消息，说明胆道排泄通畅、没有明显黄疸。</p>
        </div>
      </div>

      <div class="ai-section-block">
        <h4>腹部超声结果（大白话翻译）</h4>
        <ul>
          <li>影像提示：<span class="key-term">肝脏回声轻度增强</span>——意思是超声下肝脏显得比平时稍微“亮”一点，<strong>未见肿块、占位或胆结石</strong>。</li>
        </ul>
      </div>

      <div class="ai-section-block">
        <h4>AI 初步倾向（仅供医生参考，尚未核准）</h4>
        <ul>
          <li>仅从化验数值和超声图像特征来看，统计上最常见的对应情况是 <span class="key-term">轻度非酒精性脂肪肝（NAFLD）</span>。</li>
          <li><strong>AI 局限提示：</strong>算法无法综合您的详细用药史和体格检查，真实病因需由医生最终判断。</li>
        </ul>
      </div>
    `,

    qaAnswers: {
      cancer:
        "<strong>理性安抚（避免过度恐慌）：</strong>ALT（118）和 AST（74）属于轻中度升高，且总胆红素正常、超声<strong>未见任何肿块</strong>。这种情况在临床上<strong>绝大多数是可逆的良性原因</strong>（如脂肪肝、药物影响或作息压力），与肝癌相去甚远，放心交给医生明确病因即可。",
      meds:
        "<strong>用药因素提醒：</strong>是的，常见非处方<span class='key-term'>止痛药（如对乙酰氨基酚、布洛芬等）</span>、保健品或草药都需要经过肝脏代谢，短期高频服用确实可能导致转氨酶升高。在医生确诊前<strong>请勿自行买保肝药吃</strong>，就诊时务必把吃过的药名和剂量告诉医生。",
      lifestyle:
        "<strong>面诊前的生活建议：</strong>近期请严格<span class='key-term'>戒酒</span>、暂停非必要保健品、尽量规律作息避免熬夜，饮食清淡少油腻。具体治疗方案请等待医生最终面诊决定。",
      markers:
        "<strong>一句话分清 ALT 和 AST：</strong><span class='key-term'>ALT（谷丙）</span>对肝脏最敏感，就像肝细胞的“专属警报器”；<span class='key-term'>AST（谷草）</span>则更广泛地反映细胞应激。两者轻度升高代表肝细胞正在“抗议”，及时找出原因大多可以恢复正常。",
      fallback:
        "<strong>医疗安全边界提示：</strong>您的问题涉及个体化病史判断，超出了当前模拟 AI 的安全解答范围。我已自动将此问题加入下方的<strong>【诊室待问医生清单】</strong>，方便您稍后直接与医生面对面沟通。",
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

    // Stage 1
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

    // Stage 2
    stage2Title: "Fase 2: Prescrizione Esami Clinici (Controllo Medico)",
    stage2Desc:
      "In base al tuo giudizio clinico e alla scheda del paziente, seleziona gli esami da prescrivere:",
    orderLFT: "Esami della Funzionalità Epatica (ALT, AST, Bilirubina Totale)",
    orderUltrasound: "Ecografia Addominale (Fegato e Colecisti)",
    orderCBC: "Emocromo Completo (CBC)",
    btnConfirmOrders: "Conferma e Invia Prescrizioni al Paziente",
    alertNoOrder: "Seleziona almeno un esame clinico.",
    docOrderFeedback: "✓ Prescrizioni confermate e sincronizzate nella Vista Paziente.",

    // Stage 3
    stage3Title: "Fase 3: Carica Referti / Immagini e Spiegazione Chiara",
    stage3Desc:
      "Carica il referto del sangue o l'immagine ecografica (o usa il caso esempio). CoConsult evidenzia valori come <strong>ALT / AST</strong> in linguaggio semplice per aiutarti a comprendere gli esami.",
    ordersReceivedTitle: "Esami Prescritti dal Medico (Pronti per il Caricamento):",
    uploadLabel: "Carica Analisi del Sangue o Immagine Diagnostica (JPG / PNG / PDF):",
    btnLoadSampleLab: "Carica Referto Epatico ed Ecografia di Esempio",
    btnAnalyseLab: "Spiega Referto con IA (Simulato)",
    labLoadingText: "Il motore OCR e IA simulato sta analizzando i marcatori (ALT / AST / Ecografia)...",
    badgeAILab: "Spiegazione Referti IA (Simulata)",
    labDisclaimer: "Solo spiegazione preliminare — la diagnosi finale spetta al medico",
    sampleFileLabel: "Esempio Caricato: Pannello_Epatico_ed_Ecografia.pdf (Dati Simulati)",
    alertNoLab: "Carica prima un file oppure clicca su 'Carica Referto Epatico ed Ecografia di Esempio'.",

    // Free-Text Q&A
    qaTitle: "Fai Qualsiasi Domanda di Approfondimento (Testo Libero)",
    qaDesc:
      "Scrivi liberamente qualsiasi dubbio (es. ALT/AST, antidolorifici, dieta, gravità). Le domande fuori dal perimetro sicuro vengono salvate automaticamente per il medico.",
    qaPlaceholder: "Scrivi qui la tua domanda (es. Gli antidolorifici alzano l'ALT? È qualcosa di grave?)...",
    btnQASend: "Chiedi all'IA",
    alertEmptyQA: "Inserisci prima una domanda.",
    savedQuestionsTitle: "Domande Salvate per il Medico (Sincronizzate per la Visita):",
    btnSendLabDoctor: "Invia Referto e Domande al Pannello Medico →",
    labSentFeedback:
      "✓ Inviato! La spiegazione del referto e le tue domande sono ora pronte nel Pannello Medico.",

    // Doctor Panel
    docPanelTitle: "Pannello Medico — Scheda Pre-Visita del Paziente",
    badgeDoctorPanel: "Controllo Clinico",
    docEmptyTitle: "Nessuna scheda pre-visita ricevuta al momento.",
    docEmptyDesc:
      "Vai su <strong>1. Vista Paziente</strong>, genera la valutazione pre-visita e clicca su 'Invia Sintesi al Pannello Medico'.",
    docSymptomsHeading: "Sintomi Riferiti dal Paziente",
    docAISharedHeading: "Consultazione Pre-Visita IA del Paziente (Condivisa)",
    badgeAISimulated: "Assistito da IA (Simulato)",
    docAIHiddenNotice:
      "<strong>Avviso:</strong> Il paziente ha scelto di <em>non</em> condividere la sintesi IA pre-visita. Sono mostrati solo i sintomi diretti.",
    docLabHeading: "Fase 3: Referti del Paziente, Ipotesi Preliminare IA e Domande",
    docLabEmpty: "Nessun referto caricato al momento. Completa la Fase 3 nella Vista Paziente per visualizzarlo qui.",
    docQuestionsHeading: "Domande Aperte del Paziente (Da Discutere in Visita)",
    docNoQuestions: "Nessuna domanda aperta segnalata dal paziente.",

    v3DoctorTitle: "Fase 4: Diagnosi Finale, Riconciliazione e Approvazione Schermo",
    badgeNextV3: "Prossimo Aggiornamento (v3)",
    v3DoctorDesc:
      "I controlli per confermare o superare l'ipotesi dell'IA, inserire il ragionamento clinico e sbloccare lo Schermo Condiviso saranno aggiunti nella v3.",

    // Shared Display
    sharedTitle: "Schermo Condiviso in Ambulatorio",
    badgeDoctorGated: "Visibilità Controllata dal Medico",
    sharedLockTitle: "🔒 In Attesa della Conferma Finale del Medico",
    sharedLockDesc:
      "Le interpretazioni dei referti e le ipotesi preliminari dell'IA restano nascoste qui finché il medico non verifica la diagnosi finale e clicca Approva (in arrivo nella v3).",

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
          <small>Valori normali: 7–56 U/L</small>
          <p class="marker-explain"><strong>In parole semplici:</strong> Un enzima presente soprattutto nelle cellule del fegato. Quando il fegato è affaticato (per grasso, farmaci, virus o stress), l'ALT passa nel sangue.</p>
        </div>
        <div class="marker-card abnormal">
          <div class="marker-top">
            <strong>AST (Aspartato Transaminasi)</strong>
            <span class="urgency-tag">74 U/L ↑ ALTO</span>
          </div>
          <small>Valori normali: 10–40 U/L</small>
          <p class="marker-explain"><strong>In parole semplici:</strong> Un altro enzima presente nel fegato e nei muscoli. Un lieve aumento insieme all'ALT indica uno stress epatico temporaneo.</p>
        </div>
        <div class="marker-card normal">
          <div class="marker-top">
            <strong>Bilirubina Totale</strong>
            <span class="normal-tag">14 µmol/L ✓ NORMALE</span>
          </div>
          <small>Valori normali: 3–20 µmol/L</small>
          <p class="marker-explain"><strong>In parole semplici:</strong> Un pigmento eliminato dal fegato. Un valore normale è rassicurante: indica che le vie biliari non sono ostruite.</p>
        </div>
      </div>

      <div class="ai-section-block">
        <h4>Sintesi Ecografia Addominale (Linguaggio Semplice)</h4>
        <ul>
          <li>Referto: <span class="key-term">Lieve aumento dell'ecogenicità epatica</span> — significa che il fegato appare leggermente più "brillante" del normale all'ecografia, <strong>senza masse o calcoli biliari</strong>.</li>
        </ul>
      </div>

      <div class="ai-section-block">
        <h4>Ipotesi Preliminare IA (In Attesa di Verifica Medica)</h4>
        <ul>
          <li>Basandosi solo sui valori numerici e sull'ecografia, lo schema statisticamente più comune è una <span class="key-term">Lieve Steatosi Epatica Non Alcolica (Fegato Grasso)</span>.</li>
          <li><strong>Limite dell'IA:</strong> Questa bozza non valuta la storia completa dei farmaci né l'esame obiettivo: sarà il medico a stabilire la causa reale.</li>
        </ul>
      </div>
    `,

    qaAnswers: {
      cancer:
        "<strong>Rassicurazione Calibrata:</strong> Valori lievemente elevati di ALT (118) e AST (74) con bilirubina normale e <em>nessuna massa</em> all'ecografia dipendono <strong>molto più spesso da cause reversibili</strong> (steatosi, farmaci o stress) che da tumori. Il medico chiarirà la causa esatta.",
      meds:
        "<strong>Fattore Farmaci:</strong> Sì, gli <span class='key-term'>antidolorifici da banco (es. paracetamolo/FANS)</span> e gli integratori sono metabolizzati dal fegato e possono alzare temporaneamente ALT/AST. <strong>Non assumere integratori fai-da-te</strong> prima di parlare con il medico e riferisci nomi e dosi esatte.",
      lifestyle:
        "<strong>Consigli Pratici in Attesa della Visita:</strong> Evita completamente l'<span class='key-term'>alcol</span>, riposa adeguatamente e mantieni pasti leggeri. Attendi la conferma del medico per eventuali terapie.",
      markers:
        "<strong>ALT vs. AST in Breve:</strong> L'<span class='key-term'>ALT</span> è il campanello d'allarme più specifico del fegato, mentre l'<span class='key-term'>AST</span> riflette uno stress cellulare più generale. Un aumento moderato segnala irritazione temporanea, non un danno permanente.",
      fallback:
        "<strong>Limite di Sicurezza Clinica:</strong> Questa domanda richiede una valutazione clinica personalizzata oltre la base simulata. L'ho <strong>salvata automaticamente nelle tue 'Domande per il Medico'</strong> qui sotto per parlarne direttamente in visita.",
    },
  },
};