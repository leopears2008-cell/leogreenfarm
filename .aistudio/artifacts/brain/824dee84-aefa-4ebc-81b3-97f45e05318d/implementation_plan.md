# Leo Green Farm — Premium Agricultural SaaS & Animated Video Dashboard

Leo Green Farm is a full-stack agricultural intelligence platform tailored for Indian farmers with dedicated Tamil Nadu regionalization. It pairs an editorial cinematic landing page with a dark-olive, glowing glassmorphism animated dashboard matching the user's video reference, delivering live weather, Tamil/English/Hindi AI assistance, multimodal crop health scanning, irrigation calculations, and market mandi prices.

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural directions below incorporate the user's confirmed choices from Phase 1 alongside strict visual guidelines from the uploaded video reference.

- **Confirmed Experience Flow**: Hero landing page with seamless one-click transition into the interactive animated dashboard and instant toggle back.
- **Confirmed Visual Reference**: The dashboard replicates the dark-forest glassmorphism aesthetic shown in the user's video: a central interactive botanical inspector with live glowing sensor pins, 7-day weather outlook, pentagon crop health radar, ambient AI assistant orb, and live field metrics.
- **Confirmed Regional Focus**: Tailored for Tamil Nadu agro-climatic zones (Cauvery Delta, Western Zone, Southern Zone) with instant language switching across Tamil (தமிழ்), English, and Hindi (हिंदी).
- **Security Hardening**: Immediate deletion of the tracked `. env` file, strict `.gitignore` update, safe `.env.example`, and upgrade of server-side Gemini integration to `gemini-3.8-flash` with rate limiting and timeout safeguards.

---

## 1. Overview & Core Concept

- **What It Does**: Provides farmers and agribusiness managers with a dual-experience platform:
  1. An editorial landing page articulating sustainable, intelligent farming practices.
  2. A real-time agricultural operations dashboard featuring a glowing botanical health inspector, 7-day microclimate forecast, multimodal AI crop disease diagnosis, interactive pentagon crop vitality radar, irrigation calculator, and Tamil Nadu mandi market prices.
- **Target Audience**: Farmers, agronomists, and farm managers in Tamil Nadu and across India seeking accessible, high-tech decision support in their native language.
- **Key Value**: Delivers actionable agricultural insights without technical clutter, providing clear guidance on pest management, irrigation schedules, and market timing while strictly adhering to safety standards (referring high-risk issues to local Krishi Vigyan Kendras / KVKs).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Discovery & Exploration (Landing Page)**:
   - Visitor arrives at an editorial agricultural scene with warm sunrise lighting.
   - Reads clear value propositions, interactive feature teasers, and Tamil Nadu agro-zone insights.
   - Clicks "Explore Dashboard" or "Ask Leo AI" to smoothly transition into the live operations workspace.

2. **Farm Operations & Visual Plant Inspection (Dashboard)**:
   - User enters the dark-forest glassmorphism workspace featuring a live botanical inspector with dewy foliage and pulsing hotspot pins (Health Score: 92%, Moisture: 78%).
   - Toggles sensor pins to view live leaf moisture, soil bio-activity, and root hydration telemetry.
   - Explores the 7-day weather forecast, pentagon crop health radar, and farm telemetry tiles.

3. **Multilingual AI Agronomist & Voice Dictation**:
   - Interacts with Leo AI via text or Web Speech voice dictation in Tamil, English, or Hindi.
   - Receives contextual answers with local crop nuances (Paddy/Ponni, Banana/Nendran, Sugarcane, Coconut).

4. **Crop Health Scanner (Gemini Vision)**:
   - Uploads or snaps a photo of affected crop foliage; receives instant structured assessments with confidence levels, organic treatments, and KVK advisory warnings.

5. **Mandi Market Trends & Planner**:
   - Filters genuine Tamil Nadu market data (Madurai, Coimbatore, Thanjavur, Tiruchirappalli) for key commodities with timestamps and unit prices.
   - Adds seasonal farming milestones and irrigation schedules.

### Visual Identity & Theme Tokens

- **Aesthetic Direction**: Lush Dark-Forest Botanical Glassmorphism (dashboard) paired with Warm Sunrise Editorial (landing page).
- **Color Palette**:
  - `Canvas / Background`: Deep Forest `#0B130E` and Deep Olive `#121E16`
  - `Surfaces`: Translucent frosted glass `rgba(18, 30, 22, 0.72)` with hairline borders `rgba(52, 211, 153, 0.15)`
  - `Primary / Accent`: Vivid Emerald `#10B981` and Luminous Neon Mint `#34D399`
  - `Warm Accent`: Sunrise Amber `#F59E0B`
  - `Typography`: Clean high-legibility sans (`Plus Jakarta Sans` / `Outfit`) with `font-mono tabular-nums` for all telemetry and sensor metrics.
- **Strict Anti-Slop Enforcement**:
  - No static pill badges on metadata (clean `·` unboxed text only).
  - No fake latency telemetry or mock compiler logs.
  - No thick asymmetric left accent borders (`border-l-4`).
  - No decorative status dots beside static headlines.
  - Real interactive handlers for all tabs, filters, pins, and modals.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Trade-Offs |
| :--- | :--- | :--- |
| **View Architecture** | Dual-Mode State Engine (`landing` $\leftrightarrow$ `dashboard`) with deep linking | Allows marketing narrative for new visitors while enabling direct deep-linking to full-screen dashboard operations. |
| **Plant Health Inspector** | High-fidelity canvas/SVG botanical renderer with dewy leaves, glowing hotspot pins, and backdrop motion | Directly mirrors the uploaded video's signature plant-center widget with zero lag and interactive hotspot drilldowns. |
| **AI Agronomist Model** | Upgraded to `gemini-3.8-flash` on Express backend | Follows the latest SDK guidelines; fast latency, multimodal image reasoning, and accurate Tamil/Hindi/English responses. |
| **Security & Git Hygiene** | Purge `. env` file, update `.gitignore`, strictly validate payloads | Resolves critical credential leaks and enforces safe server-side proxying without exposing keys. |
| **Tamil Nadu Localization** | Native translations for Madurai, Thanjavur, Coimbatore regions with Ponni rice, groundnut, and coconut data | Tailors practical farming context directly to the user's primary region rather than generic placeholder crops. |

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          LEO GREEN FARM WEB APP                        │
├──────────────────────────────────┬─────────────────────────────────────┤
│      Landing Page View           │       Video Dashboard View          │
│  - Editorial Hero & Story        │  - Minimal Vertical Left Rail       │
│  - Agro Feature Highlights       │  - Top Tab Bar (Overview, Weather,  │
│  - Regional TN Zone Guide        │    Irrigation, Analytics)           │
│  - FAQ & Footer Links            │  - Central Botanical Inspector      │
│  - Fast Dashboard Launch CTA     │  - 7-Day Forecast & Radar Chart     │
│                                  │  - AI Assistant (Web Speech + TTS)  │
│                                  │  - Multimodal Crop Health Scanner   │
│                                  │  - Tamil Nadu Mandi Market Prices   │
└─────────────────┬────────────────┴──────────────────┬──────────────────┘
                  │                                   │
                  ▼                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Shared State & Context Layer                     │
│  - LanguageContext (ta, en, hi)    - FarmStore (Tasks, Crops, Metrics) │
│  - WeatherStore (Live & Forecast)  - Notification & Alert Drawer       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         Express Server (server.ts)                     │
│  - POST /api/chat (gemini-3.8-flash, bilingual prompt, KVK safety)     │
│  - POST /api/analyze-crop (gemini-3.8-flash multimodal vision)         │
│  - GET  /api/weather (Microclimate & 7-day outlook)                    │
│  - GET  /api/market-prices (Tamil Nadu regulated APMC data)            │
│  - Rate limiting, payload validation (10MB limit), and safe errors     │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & State Lifecycle

1. **Interactive Botanical Inspector**:
   - `selectedPin` state (`health`, `moisture`, `roots`, `sunlight`) controls the active telemetry callout.
   - Users can click thumbnail photos of crops to switch the inspected crop (e.g., Young Paddy Shoot, Tea Plant, Maize Sprout).
2. **Crop Radar Chart**:
   - Dynamic SVG pentagon visualization measuring Health, Soil Biology, Water, Minerals, and Temperature Tolerance with live metric hover tips.
3. **Conversational Assistant with Web Speech**:
   - `startListening()` selects the correct BCP-47 tag (`ta-IN`, `hi-IN`, `en-IN`).
   - Chat history maintains conversational context and handles safety guardrails for chemical dosage warnings.
4. **Mandi Market Data**:
   - Filter by commodity (Paddy / நெல், Turmeric / மஞ்சள், Tomato / தக்காளி, Coconut / தேங்காய்) and Tamil Nadu district markets (Thanjavur, Madurai, Coimbatore, Tiruchirappalli).

---

## 5. Security & Verification Plan

1. **Security Audit & File Cleanup**:
   - Delete the `. env` file in the root.
   - Verify `.gitignore` contains `.env`, `.env.*`, `node_modules`, `dist`.
   - Update `.env.example` with clean placeholders.
2. **Compilation & Build**:
   - Execute `compile_applet` and test server bundle build (`npm run build`).
3. **Functional Verification**:
   - Verify view switching between Landing and Dashboard.
   - Test all interactive pins on the botanical widget.
   - Test Web Speech API voice capture across Tamil, English, and Hindi.
   - Test AI Chat and Crop Disease Detection endpoints with structured fallback for key availability.
