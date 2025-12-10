# Wellness Buddy Deployment

## Environments and URLs

- **Frontend (Amplify)**  
  `https://main.d28ajx45sg35zo.amplifyapp.com`

- **API Base URL (API Gateway HTTP API)**  
  `https://7hi4yxyb54.execute-api.us-east-1.amazonaws.com`

- **Health Check Endpoint**  
  `GET https://7hi4yxyb54.execute-api.us-east-1.amazonaws.com/api/v1/health`

## AWS Resources

- **Region**: `us-east-1`
- **Service name (Serverless)**: `wellness-buddy-api`

- **Lambda function**  
  - Logical name (Serverless): `api`  
  - Handler: `src/lambda.handler`  
  - Deployed function name in AWS will follow the Serverless pattern, e.g.:  
    `wellness-buddy-api-dev-api` or `wellness-buddy-api-prod-api` depending on stage.

- **API Gateway HTTP API**  
  - API ID: `7hi4yxyb54`  
  - Base invoke URL: `https://7hi4yxyb54.execute-api.us-east-1.amazonaws.com`

- **Secrets Manager**  
  - Secret name: `WellnessBuddy/api/prod`  
  - Region: `us-east-1`  
  - Example JSON value:

    ```json
    {
      "SUPABASE_URL": "https://zhddwwfrghohcqhoekxa.supabase.co",
      "SUPABASE_PUBLISHABLE_KEY": "sb_publishable_...",
      "SUPABASE_SECRET_KEY": "sb_secret_...",
      "NODE_ENV": "production",
      "CORS_ORIGIN": "https://main.d28ajx45sg35zo.amplifyapp.com/"
    }
    ```

## Supabase

- **Project name / ref**: `zhddwwfrghohcqhoekxa`  
  (from `https://zhddwwfrghohcqhoekxa.supabase.co`)

- **Client env vars (Vite)**  
  - `VITE_SUPABASE_URL`  
  - `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`)  
  - `VITE_API_BASE` (e.g. `https://7hi4yxyb54.execute-api.us-east-1.amazonaws.com`)

## Deployment Commands

From the `api` folder:

```bash
# Deploy the API to AWS (Lambda + API Gateway HTTP API)
npm run deploy
```

From the `client` folder (local dev):

```bash
# Install deps
npm install

# Run Vite dev server
npm run dev
```

## Notes

- CORS is configured in `api/serverless.yml` to allow:
  - `https://main.d28ajx45sg35zo.amplifyapp.com`
  - `http://localhost:5173`
- Lambda loads secrets from AWS Secrets Manager on cold start using `SECRETS_ID=WellnessBuddy/api/prod`.
- Supabase server client is lazily initialized using environment variables set from the secret.
