# PeriodFLO: Product Design Document
**Date:** 2026-11-19  
**Status:** In Review / Proposed  
**Author:** Antigravity & User  
**Target Platform:** Cross-Platform Mobile (iOS & Android via React Native / Expo)

---

## 1. Intent & The "Why"
Mainstream menstrual tracking apps frequently suffer from two core problems:
1. **Privacy exploitation**: Sensitive reproductive health data is frequently monetized, shared with third-party data brokers, or held in centralized unencrypted databases vulnerable to surveillance.
2. **Clinical or patronizing UX**: Cluttered interfaces with pink tax stereotypes or stark clinical forms, with zero thoughtful connection to partners or holistic hormonal phase guidance.

**PeriodFLO** is designed to be a private, warm, intelligent, and fluid cross-platform mobile application. It empowers individuals with deep predictive cycle intelligence, seamless historical data migration from existing apps (Flo, Clue, Apple Health), phase-based daily wellness recommendations, and a dedicated, privacy-preserving **Partner Sync Mode** that gives partners empathetic daily context and actionable support tips without exposing unwanted private health logs.

---

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
- **Effortless Migration**: Ingest export files from Flo, Clue, Apple Health, and generic CSV/JSON, immediately generating baseline cycle averages, luteal phase length, and symptom patterns.
- **Dynamic Cycle Intelligence**: Continuously predict upcoming periods, ovulation days, and fertile windows, auto-recalculating instantly when a cycle starts early, late, or lengths fluctuate.
- **Empathetic Partner Sync**: Provide a dedicated Partner view with countdowns, energy forecasts, and actionable empathy tips ("How to support her today") with strict, primary-user-controlled data sharing permissions.
- **Zero-Knowledge Privacy**: Local-first encrypted storage by default; all cloud relay payloads for partner sync are End-to-End Encrypted (E2EE) with keys derived client-side during pairing.
- **Apple-Grade & Emil Kowalski Craft**: 60/120fps fluid spring transitions, tactile active touch feedback (`scale(0.97)`), origin-aware modal sheets, warm restorative aesthetics (no clinical hospital tones).

### Non-Goals
- Not a clinical diagnostic medical device for medical contraception or IVF procedures.
- Not a social network: no public feeds, public user profiles, or social sharing beyond the 1-to-1 secure partner pairing.

### Anti-Goals
- **No Third-Party Ad Networks or Trackers**: No Meta Pixel, Google Analytics, or third-party behavioral telemetry.
- **No Mandatory Cloud Account**: The app must remain 100% usable completely offline with zero sign-up required.
- **No Forced Data Exposure**: The primary user has absolute, granular control over what the partner sees (e.g., phase only, mood/energy, or specific symptoms).

---

## 3. Architecture & Approaches Considered

### Approaches Considered:
1. **Centralized Cloud Database (Supabase / Firebase)**:
   - *Pros*: Simple multi-device sync, built-in push notification dispatch.
   - *Cons*: Plaintext or server-decryptable health data stored in the cloud; severe privacy liability for reproductive health data.
2. **Pure Local-Only Offline App**:
   - *Pros*: Maximum privacy, zero attack surface on the wire.
   - *Cons*: Partner sync only works if both people physically scan QR codes in person; no background notifications when partners are physically apart.
3. **Hybrid Seamless Local-First + Zero-Knowledge E2EE Relay (Selected)**:
   - *Mechanism*: Local SQLite database encrypted with AES-256-GCM. Pairing creates a shared secret between primary and partner devices via a 6-character cryptographic pairing code or QR code. 
   - *Relay*: The sync relay server acts purely as a dumb ciphertext mailbox and push trigger; it has no keys and cannot decrypt any cycle data, phase info, or notes.
   - *Trade-off*: Requires client-side cryptographic key management, but guarantees both remote partner connectivity and inviolable health privacy.

---

## 4. System & Domain Specifications

### A. Historical Data Migration Engine
- **Supported Formats**:
  - Flo App export format (CSV/JSON)
  - Clue App export format (CSV/JSON)
  - Apple Health Export (`export.xml` / exported cycle records)
  - Standard RFC 4180 CSV / structured JSON (`startDate`, `endDate`, `flowIntensity`, `symptoms`)
- **Ingestion Pipeline**:
  1. File Picker reads file into local memory.
  2. Format auto-detection via header inspection.
  3. Sanitization & Normalization to internal `PeriodCycle` schema.
  4. Instant baseline calculation: mean cycle length, standard deviation (regularity score), mean period length, estimated luteal phase (default 14 days if unconfirmed).

### B. Predictive Cycle Engine & Interactive Calendar
- **Predictive Algorithm**:
  - Weighted rolling average of the last 3-12 completed cycles (giving higher weight to the most recent 3 cycles).
  - Outlier filtering (cycles < 18 days or > 60 days flagged as anovulatory or irregular outliers unless confirmed).
  - Ovulation day: Predicted next period start date minus user's personalized luteal phase duration (default 14 days, dynamically refined via historical logs or BBT shift).
  - Fertile Window: 5 days prior to ovulation day through 1 day post-ovulation (6 days total).
  - Dynamic Real-Time Recalculation: If a period is logged earlier or later than predicted, all downstream predictions, fertile windows, and phase forecasts update synchronously.
- **Phase Definitions**:
  1. *Menstrual Phase* (Days 1 to Period End, ~Day 5)
  2. *Follicular Phase* (Post-period to Ovulation - 1 day, ~Days 6–13)
  3. *Ovulatory Phase* (Fertile peak & ovulation day, ~Days 14–16)
  4. *Luteal Phase* (Post-ovulation until next period, ~Days 17–28)

### C. Daily Log & Symptom Tracker
- **Fast 1-Tap Check-In**:
  - Flow: None, Spotting, Light, Medium, Heavy
  - Physical Symptoms: Cramps (Mild/Moderate/Severe), Fatigue, Headache, Bloating, Tender Breasts, Acne, Backache, Nausea
  - Moods: Calm, Happy, Energetic, Sensitive, Irritable, Anxious, Low Energy
  - Biometrics: Basal Body Temperature (BBT in °C/°F), Sleep Duration & Quality (1–5 stars)
  - Custom Notes: Encrypted free-form text.

### D. Daily Phase Insights & Holistic Wellness
- **Daily Narrative**: Contextual explanation of hormonal shifts (Estrogen, Progesterone, LH) and expected energy/symptom patterns.
- **Phase-Specific Recommendations**:
  - Nutrition & Micronutrients (e.g. iron & magnesium in menstrual phase; complex carbs & healthy fats in luteal phase).
  - Hydration Targets.
  - Exercise Intensity (e.g. gentle restorative yoga during menstrual; strength & HIIT during follicular/ovulatory; low-impact LISS during late luteal).
  - Self-Care Prompts.

### E. Dedicated Partner Mode ("Partner Sync")
- **Pairing Ceremony & Rendezvous Protocol**:
  - *Primary Transport (QR Code)*: Generates a QR code embedding the primary user's ephemeral ECDH public key, mailbox ID, and salt. Instant 1-scan pairing with zero server trust.
  - *Secondary Transport (6-Character Code)*: For manual entry, the primary device posts its public key to the ephemeral relay mailbox indexed by the 6-character rendezvous code. Valid for 10 minutes with strict rate-limiting (maximum 3 failed attempts) to prevent brute-force attacks.
  - *Cryptographic Key Exchange*: Both devices derive a shared AES-256-GCM symmetric session key via X25519 ECDH.
- **Granular Privacy Controls**:
  - Toggle: Share Current Phase & Cycle Day (On/Off)
  - Toggle: Share Period Countdown (On/Off)
  - Toggle: Share Energy & Mood Forecast (On/Off)
  - Toggle: Share Common Symptoms (Cramps, Fatigue) (On/Off)
  - Toggle: Detailed Flow & Custom Notes (Strictly hidden by default)
- **Partner Dashboard View**:
  - Hero: Current Cycle Day + Hormonal Phase Badge.
  - Countdown: "Period expected in ~X days" or "Current Cycle: Day X".
  - Empathy & Support Section: Daily actionable, empathetic advice tailored to the phase (e.g., craving suggestions, reminders to offer a heating pad, encouragement for high-energy days).
- **Discreet Partner Alerts (Zero-Knowledge Architecture)**:
  - *Local OS Scheduling*: The partner's device decrypts the received cycle payload and directly schedules OS-level local notifications (via `expo-notifications`) for key shifts (e.g., 3 days before period, 1 day before PMS onset).
  - *Privacy Guarantee*: The relay server never receives event dates, period timers, or push schedules, preserving strict zero-knowledge integrity.

### F. Security, Storage & Key Management
- **Local Storage & Hardware-Backed KeyStore**:
  - Cycles, logs, and sensitive settings are stored in local SQLite, encrypted with AES-256-GCM.
  - The database master key is securely generated on first run and stored in the platform's hardware-backed Secure Enclave / KeyStore via `expo-secure-store`.
  - App Lock (Biometric FaceID/Fingerprint or 4-digit PIN) acts as an application security gate. This allows background tasks (e.g. notification rescheduling, background sync fetch) to operate securely without data corruption while preventing unauthorized physical device access.
- **Data Sovereignty**: Complete one-tap JSON/CSV export, and instantaneous "Wipe All Data" button that securely zeroes all local database keys and deletes local files.

---

## 5. Visual Design & Interaction Architecture

### Apple & Emil Kowalski Design Principles
- **Palette**: Warm Terracotta Rose (`#E07A5F`), Warm Cream/Sand (`#FDFBF7`), Soft Sage (`#81B29A`), Gentle Mauve (`#8D82A2`), and Deep Obsidian Dark Theme (`#121214`).
- **Tactile Feedback**:
  - Every button, chip, and calendar day has a pointer-down scale feedback (`scale(0.97)` with `160ms` spring).
  - Bottom sheets use origin-aware presentation and spring deceleration.
  - Staggered entrances for list items (30–50ms stagger), never animating from `scale(0)`.
- **Navigation Structure**:
  - **Primary User Mode**:
    1. *Today / Forecast*: Phase ring, daily summary, quick-log action, wellness tips.
    2. *Calendar*: Month grid with period bars, predicted spans, fertile dots, ovulation markers.
    3. *Analytics*: Cycle length variation, symptom frequency charts, regularity score.
    4. *Settings & Privacy*: App lock, Partner Sync management, Data import/export/wipe.
  - **Partner Mode**:
    1. *Partner Home*: Hero countdown ring, phase energy status, "How to support her today".
    2. *Partner Calendar*: High-level timeline showing shared windows.
    3. *Partner Settings*: Alert preferences, unlink connection.

---

## 6. What's Left to the Builder
- Selection of specific cross-platform icon pack (Lucide React Native).
- Setup of mock data generators and test suites covering cycle calculations, import parsers, and cryptographic key generation.
- Exact styling tokens and dark/light color themes.
