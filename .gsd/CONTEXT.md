# PeriodFLO Context & Objectives

## Core Mission
A privacy-first, cross-platform mobile application for iOS & Android dedicated to menstrual cycle tracking, predictive health analytics, rich non-repetitive daily hormonal insights, and empathetic partner synchronization.

## Architectural Decisions
1. **Frontend / Mobile Client**: React Native + Expo (TypeScript), Expo Router, Reanimated & Gesture Handler for 60/120fps fluid physics, Expo Haptics, Expo Notifications, and Lucide React Native icons.
2. **Local-First Encrypted Storage**: SQLite with AES-256-GCM encryption at rest; master key managed via `expo-secure-store`.
3. **App Lock**: Biometric FaceID/Fingerprint & PIN security gate.
4. **Zero-Knowledge E2EE Relay**: Cloudflare Worker / Hono Node.js serverless relay in `server/`. Ephemeral mailboxes with ECDH X25519 key exchange, 6-char rendezvous PIN (10-minute expiry, 3-attempt throttle), and client-side encryption. Zero health data or dates exposed to server.
5. **Dynamic Contextual Insights (NLG Engine)**: Deep physiological hormone model (day-in-phase, estrogen/progesterone curves, logged symptoms, sleep, energy) with anti-repetition semantic phrasing and empathetic partner translations.
6. **Data Migration**: Comprehensive parsers for Flo (CSV/JSON), Clue (CSV/JSON), Apple Health export, and generic RFC 4180 CSV.
7. **Apple Design & Emil Polish**: 160ms `scale(0.97)` active states, spring animations, warm restorative palette (`#E07A5F`, `#FDFBF7`, `#81B29A`, `#8D82A2`, `#121214`), dark mode support.
