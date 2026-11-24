# Owner tasks (move to Basecamp when the project is opened)

Blocking native builds:
- [ ] Install full Xcode (App Store), accept the license, and install CocoaPods.
- [ ] Install Android Studio and the Android SDK.
- [ ] Apple Developer Program account (needed for Sign in with Apple, push on a real iPhone, TestFlight). No signing identity was found on this Mac.
- [ ] Choose the backend. The brief says Supabase but the owner does not want it. Options to discuss: own API with Postgres in Docker, Firebase, or another BaaS.

Needs a person:
- [ ] Decide with Moy whether he joins the Basecamp project, then create "Vuelo (App de golf)" with the phase lists from the brief.
- [ ] Validate the club list in `docs/clubs-research.md` (every row has a source).
- [ ] Record 20 real swing videos (face-on and down-the-line, phone on the ground, no tripod) and have a coach confirm the detected faults.
- [ ] Field test of ball tracing: compare estimated distance to a known distance and note the error in `DECISIONS.md`.
- [ ] Talk to 10 amateur golfers (brief section 10).
- [ ] Review the visual result on a real iPhone and a real Android phone.
- [ ] Choose the support email and set `SUPPORT_EMAIL` in `src/lib/support.ts` (questions and reviews open the mail app to it; empty means the person types the recipient).
