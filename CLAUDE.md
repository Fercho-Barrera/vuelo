# Vuelo

Mobile-only golf coach app (iOS and Android). Spec: `docs/brief.es.md` (Spanish, source of truth).
App copy is Spanish (Mexico). Code, comments, commits and docs are English.

## Rules for this project

- Docker is not excluded (the owner's dislike is about Supabase). Tooling currently runs on the host; propose a
  Dockerfile and docker-compose.yml before adding more dependencies, per the global rule.
- No OpenSpec proposals. Work follows the phases in the brief, one branch per phase
  (`feature/phase-N-name`), one PR per phase.
- Basecamp is deferred: do not create the Basecamp project or todos until the owner says so.
  Pending owner tasks live in `docs/owner-tasks.md`.
- No real accounts, payments, bookings or network publishing. The backend is behind an adapter
  (`src/lib/data`), with a local mock adapter. The owner does not want Supabase: the backend is still to be chosen.
- Every screen is built from the base components in `src/components/glass`. If a component is
  missing, add it there first. No hardcoded colors in screens, only tokens from `src/design/tokens.css`.
- Never promise launch-monitor accuracy: ball speed and distance always read "aprox." with a margin.
- Never invent clubs, prices or hours. Data needs a source URL or stays out.
- Node 18 on this machine: Vite 5, React 18, Capacitor 6.

## Commands

- `npm run dev` dev server, `npm run build` typecheck and build, `npm test` unit tests.
