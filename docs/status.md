# Status (2026-11-18)

Built and tested on the host (46 unit tests, production build, visual check at 390px):

| Phase | State |
|---|---|
| 0 Setup | Repo, docs, decisions, Capacitor config done. Basecamp deferred on purpose. Native iOS/Android not added (no Xcode). |
| 1 Design | Tokens, 8 glass components, tab shell, Hoy, Perfil done. Real-device review pending. |
| 2 Profile | Onboarding and editable profile on a local adapter. Real auth waits for Supabase. |
| 3 Swing | Analysis engine done (rules, tested on synthetic swings). Camera, MediaPipe, trim and storage not started: need a device. |
| 4 Stats | Scorecard, history, handicap estimate, loss areas done. Per-club distances wait for Phase 6. |
| 5 Clubs | Screen with filters, sheet, WhatsApp, favorites, plus 22 researched clubs. Data is thin, owner must validate. |
| 6 Ball | Not started: needs field tests, depth cannot be derived without them. |
| 7 Dual camera | Not started: needs two devices and Supabase. |
| 8 Push | Rules engine done. Tokens, tables, center and cron wait for Supabase and APNs/FCM. |
| 9 Pro | Limits, prices and practice plan logic done. Paywall, billing, GPS caddie, challenges, bookings not started. |
| 10 Launch | Not started. |
