# CoConsult
## 1. Project Status

* **Implemented:**
  * Three-role interactive workflow (Patient View, Doctor Dashboard, Shared Display) with trilingual UI localization (`EN` / `中文` / `IT`).
  * Pre-visit symptom appraisal with explicit opt-in AI disclosure to the doctor.
  * Clinician preliminary clinical impression notes paired with a searchable hospital test catalog and custom test entry.
  * Lab report/scan upload with plain-language highlighting and **tiered-privacy** follow-up Q&A (private by default; patients voluntarily select specific Q&A pairs to share).
  * Clinician Q&A audit interface displaying both the patient's question and the AI's original reply, with one-click `Accurate` / `Flag & Correct` overrides projected prominently onto the Shared Display.
  * Clinician final diagnosis control (Agree vs. Override with clinical factors), an optional clinician-triggered AI home action plan with strict **Doctor-Authored** vs. **AI-Drafted** attribution, clinician-gated Shared Display approval/revocation, and a Large-Text Simplified accessibility toggle.
  * Optional BYOK (Bring Your Own Key) Live API configuration modal supporting OpenAI-compatible text and multimodal vision endpoints, alongside a real-time `appState` context memory inspector.
* **Simulated:**
  * Default offline mode using structured templates for symptom appraisal, sample liver lab/ultrasound report (`ALT 118`, `AST 74`, `Bilirubin 14`), keyword-matched Q&A, and home execution plans.
  * Single-browser role tabs simulating three separate physical clinical devices (patient phone, clinician EHR workstation, in-room shared monitor).
* **Unfinished / Planned:**
  * Dedicated hospital backend server with role-based authentication and encrypted audit logging.
  * Live EHR / HL7 FHIR integration, multi-device WebSocket synchronisation, and server-side PDF OCR.

---

## 2. Technology Stack

* **Frontend:** Vanilla HTML5, CSS3, and ES6 JavaScript (`index.html`, `style.css`, `i18n.js`, `app.js`) with zero external frameworks or build steps.
* **Client-Side Media & State:** HTML5 Canvas (resizes uploaded JPG/PNG lab photos to a maximum dimension of 1280px before transmission) and an in-memory `appState` store assembling cross-stage clinical context.
* **AI Integration:** Fetch API (`AbortController` 35-second timeout) calling OpenAI-compatible Chat Completions endpoints. Live text and multimodal vision were tested with Google Gemini (`gemini-2.5-flash`) using JSON-constrained system prompts.
* **Undecided Architectural Choices:** Production delivery format for patients (hospital web portal vs. mobile mini-program) and backend stack (Python/FastAPI AI gateway vs. existing hospital Java/.NET middleware) remain open pending clinical governance requirements.

---

## 3. Running and Inspecting the Work

### Option A: Offline Simulated Mode (Default, Zero Setup)
1. Open the GitHub Pages live link above, or clone/download the repository and open `index.html` in any modern browser.
2. Follow the workflow across the top tabs (`1. Patient View` → `2. Doctor Dashboard` → `1. Patient View` lab upload → `2. Doctor Dashboard` audit & approval → `3. Shared Display`) using the built-in **Load Sample Case** and **Load Sample Liver Lab** buttons.

### Option B: Optional Live API & Vision Mode (BYOK)
No API keys are committed to this repository. To inspect live LLM text and image analysis:
1. Click the top-right **AI Engine: Simulated (Click for API) ⚙** button and select **Live API Mode (BYOK)**.
2. Enter an OpenAI-compatible endpoint, vision-capable model, and your own API key (held strictly in volatile tab memory and cleared on page refresh). Example configuration for Google Gemini:

```text
Endpoint: [https://generativelanguage.googleapis.com/v1beta/openai/chat/completions](https://generativelanguage.googleapis.com/v1beta/openai/chat/completions)
Model:    gemini-2.5-flash
API Key:  <your-own-key>
AI Assistance

* **Tool Used:** Google Gemini (conversational AI assistant).
* **Division of Work:** I defined the interaction problem, clinical workflow, human-centred design choices, scope trade-offs, and all reference selections. I used AI mainly as a productivity assistant for repetitive and structural tasks: scaffolding boilerplate HTML (`div`/card layouts) and CSS styling, structuring JavaScript event handlers and API fetch boilerplate, formatting the trilingual UI dictionary (`EN`/`中文`/`IT`), generating Mermaid diagram syntax, and polishing English phrasing in the report and README.
* **Key Checks, Corrections, and Adaptations Made by the Author:**
  1. **Replacing rigid AI defaults with realistic clinical workflows:** Rejected early AI-scaffolded layouts that offered only three hardcoded test checkboxes and opt-out Q&A sharing; redesigned them into a searchable EHR test catalog with clinician preliminary impressions and private-by-default Q&A.
  2. **Protecting clinician authority and patient safety:** Identified that showing only patient questions hid potential AI misinformation from doctors, and that auto-generating care plans could undermine clinician autonomy. Directed the addition of full clinician Q&A auditing/correction (`v3.1`) and strictly clinician-optional AI home execution plans with separated Doctor vs. AI badges (`v3.3`).
  3. **Catching live-test UI bugs and setting boundaries:** Testing `v3.2` with a photographed paper lab report revealed leftover "Simulated" badges on the Shared Display and hardcoded fatty-liver text in the doctor panel, which were corrected in `v3.3`. Deliberately excluded automatic translation of doctor-authored notes during language switches to avoid clinical mistranslation risks.
