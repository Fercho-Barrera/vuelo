# Vuelo

Your golf coach in your pocket. Mobile-only (iOS and Android) app with three legs: camera coach
(swing analysis and ball tracing), stats, and a directory of golf clubs in Mexico.

The product spec is `docs/brief.es.md` (Spanish). Technical decisions live in `DECISIONS.md`,
open owner tasks in `docs/owner-tasks.md`.

## Run

```sh
cp .env.example .env
npm install
npm run dev      # open it at phone size, e.g. 390x844
npm test
npm run build
```

Node 18 is supported. Native iOS and Android projects are added with `npx cap add ios|android`
once Xcode and Android Studio are installed (see `docs/owner-tasks.md`).

## Layout

- `src/design` tokens (colors, glass, spacing, motion)
- `src/components/glass` base Liquid Glass components, the only way screens build UI
- `src/screens` one file per screen
- `src/lib` data adapter, notification rules, camera and analysis code
- backend: not chosen yet (the owner does not want Supabase)
