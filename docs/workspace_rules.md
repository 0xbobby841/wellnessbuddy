# WORKSPACE_RULES.md

---

## 0) Summary (read this first)

- **Phase 1 & 2:** build and run everything locally (React client + Express API).  
  Use **Supabase Cloud** for Postgres + Auth.  
  Push to GitHub at least once per work session for instructor visibility.  

- **Phase 3:** deploy the client to **AWS Amplify** and the API to **AWS Lambda** (serverless-http wrapper).

---

## 1) Git & Branching

- **Workflow:** `main` only (simple mode).  
- **Commit early/often** — target 5–10 commits per week.  
- Optional short-lived feature branches: `feat/<short>` → fast-forward merge to `main`.  
- **Tag milestones:**  
  - `v0.1-proto1`  
  - `v0.2-proto2`  
  - `v1.0-proto3`

### Commit message format

```
[scope]: imperative summary

# examples
api: add POST /workouts endpoint
client: wire spending chart to GET /finance/summary
docs: update PRD and site map
```

---

## 2) Repo Layout

```
/client/          # React PWA (local dev: Vite)
/api/             # Express API (local dev: Node)
/supabase/        # SQL migrations + seeds
/docs/            # PRD, site map, OpenAPI, deployment notes
README.md
```

**`.gitignore` must include:**  
`node_modules/`, `.env`, `.DS_Store`, `dist/`, `build/`

---

## 3) Environments & Secrets

Keep real `.env` files **out of git** — commit only `.env.example`.

### `/client/.env.example`

```bash
VITE_API_URL=http://localhost:3000/api/v1
VITE_SUPABASE_URL=<public-supabase-url>
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

### `/api/.env.example`

```bash
PORT=3000
SUPABASE_URL=<supabase-url>
SUPABASE_SERVICE_KEY=<service-role-key>
JWT_SECRET=dev-secret
```

**Rules**
- Client uses only `VITE_*` public keys.  
- All CRUD flows through the API; never use service keys in the client.

---

## 4) Local Dev

### Scripts

#### `/client`
- `npm run dev` – local dev server  
- `npm run lint`, `npm test`

#### `/api`
- `npm run dev` – nodemon on port 3000  
- `npm run lint`, `npm test`

### Run both
- **Terminal A** → `cd api && npm run dev`  
- **Terminal B** → `cd client && npm run dev`

### Health checks
- **API:** `GET http://localhost:3000/api/v1/health` → `{"status":"ok"}`  
- **Client:** loads and successfully calls an endpoint (e.g., `GET /workouts`).

---

## 5) API Conventions

- **Base path:** `/api/v1`
- **Resources:** `/workouts`, `/finance`, `/legal`, `/clubs`, `/goals`, `/ai`
- **Methods:** standard REST (`GET`, `POST`, `PUT`, `DELETE`)
- **Pagination/filters:** query params (`?page=1&limit=20&type=health`)

### JSON response shape
```json
{
  "data": [...],
  "meta": { "page": 1, "limit": 20, "total": 42 }
}
```

### Error shape
```json
{
  "error": { "code": "VALIDATION_ERROR", "message": "amount must be positive" }
}
```

- **Auth:** Bearer JWT required for all writes.  
  Roles = `user`, `freelancer`, `admin` (future option).

---

## 6) Testing & Quality

- **API:** Jest + supertest (happy path, validation, auth).  
- **Client:** smoke tests for key screens (Health, Finance, Legal, AI Support).  
- **Linting:** ESLint + Prettier on both layers.  
- **Soft goal:** ~60 % line coverage by P2.

---

## 7) Documentation

Keep these updated:
- `/docs/PRD.md` – scope & requirements  
- `/docs/OpenAPI.yaml` – endpoint definitions  
- `/docs/site-map.png` – tree diagram only  
- `/docs/DEPLOYMENT.md` – AWS setup notes

**Per feature include:**
- Linked user story ID  
- Acceptance criteria  
- Sample request/response (JSON or cURL)

---

## 8) Logging & Observability

- API uses `morgan` in dev.  
- Central error handler returns clean JSON errors.  
- Include a `traceId` field in responses for debugging.

---

## 9) Supabase Rules

- Supabase = Postgres + Auth (hosted).  
- Server/API holds **service role key**; client uses **anon key**.  
- If enabling Row Level Security, document policies in `/supabase/`.

---

## 10) Instructor Visibility

- Push daily so commit history shows steady progress.  
- Keep `README.md` updated with:
  - Run instructions  
  - Known issues  
  - Endpoint checklist (✅/⏳)  
- Screenshots or GIFs of UI + sample cURL responses in `/docs/`.

---

## 11) Prototype Milestones

### Prototype 1 – Scaffolding (Local)
- Repo + env configured; Express API skeleton running.  
- Core read endpoints: `GET /workouts`, `GET /finance/summary`, `GET /legal/faqs`.  
- Client loads and renders data from API.  
- OpenAPI outline + site map added.

### Prototype 2 – Feature Building (Local)
- Write endpoints: `POST /workouts`, `POST /journal`, `POST /goals`.  
- Update routes: `PUT /goals/:id`.  
- Basic Jest tests + lint passing.

### Prototype 3 – Deployment
- Client → AWS Amplify (connected to GitHub main).  
- API → AWS Lambda (serverless-http).  
- CORS restricted to Amplify domain in prod.  
- Update `/docs/DEPLOYMENT.md` with build settings & URLs.

---

## 12) Definition of Ready (DoR)

A task is ready when:
- Story + acceptance criteria are clear.  
- API path and sample JSON drafted.  
- UI component(s) identified.  
- Basic tests listed.

---

## 13) Definition of Done (DoD)

A task is done when:
- Code + tests pass locally.  
- Docs (OpenAPI + README + examples) updated.  
- Committed & pushed to GitHub.  
- Demo (screenshot or GIF) added to `/docs/`.

---

## 14) Quick Setup Checklist

- [ ] Clone repo; install deps in `/client` and `/api`.  
- [ ] Create `.env` files from examples.  
- [ ] Run `npm run dev` in `/api`, then `npm run dev` in `/client`.  
- [ ] Hit `GET /api/v1/health` → `{"status":"ok"}`.  
- [ ] Client calls `GET /workouts` successfully.  
- [ ] Commit & push to GitHub.

---

**Last Updated:** October 2025  
**Version:** 1.0
