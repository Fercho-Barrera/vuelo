# Decisions

Format: date, decision, reason.

- 2026-11-17 Stack: React 18 + TypeScript + Vite 5 + Capacitor 6. Node 18 on the dev machine rules out Vite 6+ and Capacitor 7. Camera at 120fps gets a feasibility spike at the start of Phase 3; if Capacitor cannot deliver it, evaluate React Native and record it here.
- 2026-11-17 Correction on 2026-11-18: the owner dislikes Supabase, not Docker (answer 7 was misread). Docker is not excluded for this project. Node currently runs on the host only because nothing was containerized yet. Native iOS and Android builds need Xcode and Android Studio, which do not run in containers anyway.
- 2026-11-17 Native platforms (`ios/`, `android/`) are not added yet. The machine has only Command Line Tools (no Xcode, no CocoaPods, no Android SDK, no signing identities). Add them with `npx cap add ios|android` once Xcode and Android Studio are installed. Until then the app is developed and checked in the browser at phone size.
- 2026-11-17 Data layer is an adapter (`src/lib/data`) with a local mock implementation. Correction on 2026-11-18: the owner does not want Supabase for this project, so the brief's Supabase choice is OPEN. The adapter keeps the backend swappable. Nothing Supabase-specific was written (no migrations, no client calls). Backend to be chosen with the owner.
- 2026-11-17 Push cap: 1 per day, 3 per week, excluding reminders for bookings the user made. Brief section 8.0 and Phase 8 disagreed; the owner chose 8.0.
- 2026-11-17 Liquid Glass on web is approximated with `backdrop-filter`, layered borders and specular highlights, following the `apple-hig` materials rules: glass only for controls and navigation floating over content, standard materials for the content layer, frostier fallback under reduced transparency.
- 2026-11-17 `main` protection: private repos on a free GitHub plan cannot enforce branch protection. Convention instead: never commit to `main`, merge through PRs.
- 2026-11-17 Brief is kept in Spanish at `docs/brief.es.md`; all other docs are English.
- 2026-11-18 Offer push copy must not include prices. Brief section 8.1 example 7 shows prices ("$850 en vez de $1,200") but section 8.0 forbids prices on the lock screen. We follow 8.0: the rules engine blocks any push whose text has an amount, so offers say "Hay un tee time de última hora cerca de ti" and the price lives behind the deep link.
- 2026-11-18 Club map: no embedded map until a map key exists (MapKit JS or Google Maps). The club sheet opens the native map app by coordinates or address instead.
- 2026-11-18 Club reviews (brief 4.5) need the backend and moderation, so they are not in the club sheet yet.
- 2026-11-18 Handicap is an estimate: best 8 of the last 20 score-minus-par differentials times 0.96, because we have no course rating or slope. The UI says "estimado" and "aprox.".
- 2026-11-18 Front redesigned on the owner's request (no literal sun; learn from Revolut and Speechify). Content now sits on flat solid cards with big bold numerals, round-icon list rows, a dark green hero card and pill buttons; ink (near black) is the primary button, green is the only accent. Liquid Glass stays only on the floating tab bar, sheets and video controls, as `apple-hig` recommends (no glass in the content layer). Fonts: system SF Pro stack, heavy weights, tight tracking. No web font bundled yet.
- 2026-11-18 `?demo=1` seeds sample profile and rounds in development only (`import.meta.env.DEV`), so screens can be reviewed with content. It is not in production builds.
