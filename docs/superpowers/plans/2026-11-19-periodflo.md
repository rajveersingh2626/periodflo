# PeriodFLO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive, privacy-first cross-platform mobile application for iOS and Android dedicated to menstrual cycle tracking, predictive health analytics, rich non-repetitive daily hormonal insights, and empathetic partner synchronization with an E2EE relay.

**Architecture:** Local-first architecture using React Native / Expo with encrypted SQLite (AES-256-GCM) and hardware-backed KeyStore. Zero-knowledge E2EE sync pairs primary and partner devices via ECDH key exchange and an ephemeral Hono relay. A dynamic physiological Natural Language Generation (NLG) engine synthesizes realistic, non-repetitive daily insights and partner empathy tips.

**Tech Stack:** React Native, Expo, TypeScript, Expo Router, React Native Reanimated, Gesture Handler, Expo Haptics, Expo Notifications, Lucide React Native, Hono / Cloudflare Workers (relay).

**Spec:** `docs/superpowers/specs/2026-11-19-periodflo-design.md`

## Global Constraints
- Pure local-first: zero mandatory cloud accounts; fully functional offline.
- Zero-knowledge privacy: relay server stores only ephemeral ciphertext; zero health dates or cycle data exposed.
- Apple & Emil Kowalski craft: `scale(0.97)` active press feedback, spring animations, warm non-clinical palette, dark mode support.
- Multi-app migration: support Flo (CSV/JSON), Clue (CSV/JSON), Apple Health export, and generic RFC 4180 CSV.

## Review Focus
1. Non-standard cycle inputs (irregular cycles <21 days or >45 days, anovulatory cycles): ensure prediction engine does not crash or generate infinite loops.
2. Data migration boundary errors (missing columns, varied date formats like MM/DD/YYYY vs YYYY-MM-DD): ensure parser falls back gracefully without data loss.
3. Relay rendezvous expiration (expired 6-character code, duplicate claims, rate limiting): ensure client reports clear, friendly timeout.
4. Partner permission enforcement: ensure fields marked as private are cryptographically excluded from the payload before encryption.
5. Biometric/PIN lock background resilience: ensure local notification triggers and background fetch do not corrupt locked state.

---

### Task 1: Project Foundation & Cross-Platform Scaffolding
**Files:**
- Create: `package.json`, `tsconfig.json`, `app.json`, `src/theme/colors.ts`, `src/theme/springs.ts`
- Test: `tests/setup.test.ts`

**Interfaces:**
- Produces: Theme tokens (`Colors`, `SpringConfigs`, `Typography`) used across all screens and components.

- [ ] **Step 1: Write test for theme tokens and project configuration**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement project configuration, Expo dependencies, and design tokens**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 2: Core Data Types, Encryption & Local Storage Layer
**Files:**
- Create: `src/types/cycle.ts`, `src/services/storage/crypto.ts`, `src/services/storage/db.ts`
- Test: `tests/storage/crypto.test.ts`, `tests/storage/db.test.ts`

**Interfaces:**
- Produces: `DatabaseService` (`saveCycle`, `getCycles`, `saveDailyLog`, `getDailyLogs`, `wipeDatabase`), `CryptoService` (`encrypt`, `decrypt`, `generateMasterKey`).

- [ ] **Step 1: Write tests for AES-256-GCM encryption and database CRUD operations**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `CryptoService` and `DatabaseService` with encrypted SQLite**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 3: Historical Data Migration Engine
**Files:**
- Create: `src/services/migration/types.ts`, `src/services/migration/floParser.ts`, `src/services/migration/clueParser.ts`, `src/services/migration/appleHealthParser.ts`, `src/services/migration/importer.ts`
- Test: `tests/migration/migration.test.ts`

**Interfaces:**
- Consumes: `PeriodCycle`, `DailyLog` from `src/types/cycle.ts`
- Produces: `MigrationService.importData(fileContent, fileType)` -> `{ cycles, logs, baselineSummary }`

- [ ] **Step 1: Write tests for Flo CSV/JSON, Clue JSON, Apple Health XML, and CSV parsing**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement parsers and baseline calculation (cycle length, period length, regularity)**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 4: Predictive Cycle Intelligence & Dynamic Recalculation
**Files:**
- Create: `src/services/predictions/engine.ts`, `src/services/predictions/phases.ts`
- Test: `tests/predictions/predictions.test.ts`

**Interfaces:**
- Consumes: Historical `PeriodCycle[]`
- Produces: `PredictiveEngine.calculatePredictions(cycles, currentLogs)` -> `CyclePrediction` (next period start, duration, ovulation day, fertile window, phase for given date).

- [ ] **Step 1: Write tests for rolling cycle averages, luteal phase subtraction, and early/late period recalculation**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement prediction math and real-time adjustment logic**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 5: Dynamic Contextual Insights & Non-Repetitive NLG Engine
**Files:**
- Create: `src/services/insights/nlgEngine.ts`, `src/services/insights/vocabulary.ts`, `src/services/insights/wellnessAdvice.ts`, `src/services/insights/partnerEmpathy.ts`
- Test: `tests/insights/nlgEngine.test.ts`

**Interfaces:**
- Consumes: Current cycle day, hormonal phase, recent symptoms, energy, sleep.
- Produces: `InsightEngine.generateDailyInsight(params)` -> `{ primaryNarrative, hormoneStatus, wellnessTips, partnerEmpathyTip }` with rich variation and anti-repetition seed.

- [ ] **Step 1: Write tests verifying diverse, non-repetitive narrative generation across cycle days and symptoms**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement physiological NLG template and slot-filling engine with semantic variety**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 6: Zero-Knowledge E2EE Sync Protocol & Lightweight Relay
**Files:**
- Create: `src/services/sync/e2ee.ts`, `src/services/sync/pairing.ts`, `server/src/index.ts`, `server/package.json`
- Test: `tests/sync/e2ee.test.ts`, `tests/sync/relay.test.ts`

**Interfaces:**
- Produces: `E2EESyncService.generatePairingPackage()`, `E2EESyncService.pairWithCode(code)`, `E2EESyncService.encryptPayload(data, permissions)`, `E2EESyncService.decryptPayload(ciphertext)` and Hono relay endpoints (`POST /rendezvous`, `GET /rendezvous/:code`, `POST /mailbox/:id`, `GET /mailbox/:id`).

- [ ] **Step 1: Write tests for ECDH key derivation, payload encryption with granular permissions, and relay mailbox flow**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement E2EE sync service and Hono relay server**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 7: Primary Experience: Interactive Calendar & 1-Tap Daily Check-In
**Files:**
- Create: `src/components/calendar/CalendarGrid.tsx`, `src/components/calendar/PhaseRing.tsx`, `src/components/logging/QuickLogModal.tsx`, `src/components/ui/TactileButton.tsx`, `src/components/ui/Chip.tsx`
- Test: `tests/components/logging.test.ts`

**Interfaces:**
- Consumes: `PredictiveEngine`, `DatabaseService`, `Theme`
- Produces: Visual month calendar, cycle ring, quick-log bottom sheet for flow, cramps, moods, sleep, BBT.

- [ ] **Step 1: Write test for log submission and date selection state**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement Calendar Grid, Phase Ring, and 1-tap Quick Log with `scale(0.97)` active press feedback**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 8: Primary Experience: Daily Insights & Holistic Wellness
**Files:**
- Create: `src/components/insights/DailyInsightCard.tsx`, `src/components/wellness/WellnessCards.tsx`, `src/components/analytics/CycleAnalytics.tsx`, `app/(tabs)/insights.tsx`, `app/(tabs)/analytics.tsx`
- Test: `tests/components/insights.test.ts`

**Interfaces:**
- Consumes: `InsightEngine`, `DatabaseService`
- Produces: Daily insight cards, nutrition/hydration/workout recommendations, cycle regularity and symptom frequency charts.

- [ ] **Step 1: Write test for wellness advice mapping and analytics aggregations**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement Daily Insight Card, Wellness Recommendations, and Analytics screen**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 9: Dedicated Partner Mode Dashboard & Discreet Alerts
**Files:**
- Create: `src/components/partner/PartnerHero.tsx`, `src/components/partner/EmpathyCard.tsx`, `src/components/partner/PartnerSharingModal.tsx`, `src/services/notifications/localScheduler.ts`, `app/partner/index.tsx`
- Test: `tests/partner/partner.test.ts`

**Interfaces:**
- Consumes: `E2EESyncService`, `InsightEngine`
- Produces: Partner dashboard, empathy advice cards, privacy sharing settings, and local OS alert scheduler.

- [ ] **Step 1: Write tests for partner permission filtering and local notification scheduling**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement Partner Dashboard, Empathy Card, and Sharing Controls with discreet alerts**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 10: Security, App Lock & Data Sovereignty
**Files:**
- Create: `src/components/security/LockScreen.tsx`, `src/services/security/appLock.ts`, `src/services/export/dataExport.ts`, `app/(tabs)/settings.tsx`
- Test: `tests/security/appLock.test.ts`

**Interfaces:**
- Produces: PIN/Biometric lock UI, 1-tap JSON/CSV export, and instantaneous cryptographic data wipe.

- [ ] **Step 1: Write test for PIN validation, export format integrity, and complete database zeroing**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement LockScreen, Export/Wipe settings, and App Lock lifecycle listener**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**
