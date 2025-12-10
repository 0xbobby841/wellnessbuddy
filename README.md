# Wellness Buddy

Wellness Buddy is a mobile-first web app that empowers users to take control of their personal well-being by combining tools from four essential areas — health, finance, legal, and lifestyle — in one place.

## Tech Stack
- React (Vite) for the client (PWA)
- Express for the API
- Supabase for the database

## Project Structure
```
/client     # React PWA (local dev: Vite)
/api        # Express API (local dev: Node)
/supabase   # SQL migrations + seeds
/docs       # PRD, site map, OpenAPI, deployment notes, README.md
```

## Live URLs

- **Frontend (Amplify)**  
  https://main.d28ajx45sg35zo.amplifyapp.com

- **API Base URL (API Gateway HTTP API)**  
  https://7hi4yxyb54.execute-api.us-east-1.amazonaws.com

- **Health Check Endpoint**  
  GET https://7hi4yxyb54.execute-api.us-east-1.amazonaws.com/api/v1/health

## Getting Started (Local Dev)

1. **Install dependencies**
   - From `/client`: `npm install`
   - From `/api`: `npm install`

2. **Environment variables**
   - Copy `.env` examples (if provided) and set:
     - Client: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`), `VITE_API_BASE`
     - API (local only): `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`)

3. **Run locally**
   - From `/client`: `npm run dev` (Vite dev server, default `http://localhost:5173`)
   - From `/api`: `npm run offline` (Serverless Offline HTTP API)

## Troubleshooting (Deployment)

- **API returns 500 and CloudWatch shows `ResourceNotFoundException` for Secrets Manager**
  - Confirm the secret exists in region `us-east-1` with name `WellnessBuddy/api/prod`.
  - Ensure `SECRETS_ID=WellnessBuddy/api/prod` in `api/serverless.yml`.

- **API logs `Failed to load secrets` or JSON parse errors**
  - Check the secret value is valid JSON with quoted keys and values.
  - Example shape:
    ```json
    {
      "SUPABASE_URL": "https://<project>.supabase.co",
      "SUPABASE_PUBLISHABLE_KEY": "sb_publishable_...",
      "SUPABASE_SECRET_KEY": "sb_secret_...",
      "NODE_ENV": "production",
      "CORS_ORIGIN": "https://main.d28ajx45sg35zo.amplifyapp.com/"
    }
    ```

- **API logs `Supabase environment variables are missing`**
  - Verify the secret JSON contains `SUPABASE_URL` and a server key (`SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`).
  - Confirm Lambda is in `us-east-1` and reading from the correct secret.

- **CORS errors in browser**
  - Allowed origins are configured in `api/serverless.yml` under `provider.httpApi.cors.allowedOrigins`.
  - Ensure your frontend origin matches one of:
    - `https://main.d28ajx45sg35zo.amplifyapp.com`
    - `http://localhost:5173`

## Known Issues / Incomplete Features

- Some UX polish and visual design refinements are still in progress.
- Additional automated tests (unit/integration) are not yet implemented.
- Admin tooling (e.g., managing clubs or legal templates from a dashboard) is not included in this version.

See `deployment.md` for more detailed deployment notes, resource IDs, and commands.
