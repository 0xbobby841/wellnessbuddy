# Product Requirements Document (PRD)

## Project Title
**Wellness Buddy**

## Description
Wellness Buddy is a mobile-first web app that empowers users to take control of their personal well-being by combining tools from four essential areas — health, finance, legal, and lifestyle — in one place.

## Scope
Based on the Analyst’s Level 1 Specification, Wellness Buddy v1 will include features in four epics:

- **Improve Health**
  - Book, track, log workouts
  - Manage health journal, progress summaries

- **Improve Finances**
  - Track spending, categorize expenses
  - View charts, get over-budget alerts

- **Protect Legally**
  - Access templates (NDA, freelance, etc.)
  - Browse FAQs, download documents

- **Enjoy Lifestyle**
  - Join wellness/book clubs
  - Add events to calendar, connect locally

- **Use AI Support**
  - Onboarding quiz, feature suggestions
  - Weekly reminders, balanced goal nudges

### Out of Scope
- Live expert chat
- Wearable/device sync
- Family or multi-user accounts
- Payments or banking tools
- Social or messaging features
- Medical/legal diagnoses
- Multi-language support (English only)

---

## Technical Architecture

### Frontend (Client)
- **React + Vite + TypeScript** (PWA, mobile-first design)
- **TailwindCSS** + **shadcn/ui** components (Radix primitives: accessible + customizable)
- **React Router** for navigation
- Deployed via **AWS Amplify**

### Backend (API Layer)
- **Express.js REST API (Node.js)**
  - Serves as the single gateway for all data operations
  - Handles authentication, validation, and routing
  - Organizes CRUD endpoints by feature area (e.g., `/workouts`, `/finance`, `/legal`, `/clubs`)
  - Middleware for logging, error handling, and request validation
- **Rule:** All CRUD operations go through the API — the frontend must **not** call Supabase DB directly.

### Database & Authentication
- **Supabase (Postgres-based)** for:
  - Data persistence
  - Authentication (OTP email code; role-based access)
  - Realtime subscriptions (optional for v1)
- The API connects to Supabase via the Supabase client or `pg` driver.
- **Authentication approach:**
  - Frontend may call Supabase Auth (OTP email code) directly to obtain a session/JWT.
  - API also exposes OTP wrappers (`/auth/otp/start`, `/auth/otp/verify`) for future clients and policy controls.
  - All protected API routes require `Authorization: Bearer <JWT>`.

### Deployment Strategy
- **Frontend:** AWS Amplify (continuous deployment from GitHub)
- **API Layer:** Serverless functions
  - **AWS Lambda (preferred)** — Express wrapped with `serverless-http`
- **Database:** Managed directly in the Supabase cloud instance

### Development Tools
- **GitHub** for version control and collaboration
- **Windsurf IDE** for coding environment
- **Trello** for task management
- **Slack** for team communication

---

## Key Considerations
- **Separation of Concerns:** Clear distinction between frontend (UI), API (business logic), and DB (persistence).
- **Role-Based Access:** API enforces role permissions (e.g., User vs. Admin).
- **Environment Variables:** API keys stored in `.env` (never committed).
- **Scalability:** Architecture is overkill for a class project, but reflects industry practices.