# Task List

---

## Epic: Improve Health

- [ ] **Build Workout Booking UI (Frontend)**
  - *User Story:* As a young professional, I want to book and track workouts so I can stay consistent with my fitness goals.  
  - **Acceptance Criteria**
    - Users can select workout type, date, duration, and notes.  
    - Data saved via `POST /workouts`.  
    - Workouts listed via `GET /workouts`.

- [ ] **Create `/workouts` API Endpoints**
  - **Acceptance Criteria**
    - `POST /workouts` creates a workout log.  
    - `GET /workouts` returns user workouts.  
    - `DELETE /workouts/:id` deletes an entry.  
    - Returns `200`/`201` on success.

- [ ] **Weekly Progress Reminder Job (Backend)**
  - **Acceptance Criteria**
    - Cron/Lambda runs weekly.  
    - Finds users with ≥ 1 logged session.  
    - Sends reminder or console notification (v1 mock).

---

- [ ] **Build Health Journal UI (Frontend)**
  - *User Story:* As a user, I want to manage my health journal so I can track improvement.  
  - **Acceptance Criteria**
    - Add/edit/delete journal entries.  
    - Display visual trends over time.  
    - Export entries to CSV.

- [ ] **Create `/journal` API Endpoints**
  - **Acceptance Criteria**
    - `POST /journal` creates entry.  
    - `GET /journal` lists all entries.  
    - `PUT /journal/:id` updates entry.  
    - `DELETE /journal/:id` removes entry.

---

## Epic: Improve Finances

- [ ] **Build Spending Tracker UI (Frontend)**
  - *User Story:* As a user, I want to track my monthly spending so I can stay within my budget.  
  - **Acceptance Criteria**
    - Add expense with category, amount, and date.  
    - Show monthly summary and category breakdown.  
    - Alert when spending exceeds budget.

- [ ] **Create `/finance` API Endpoints**
  - **Acceptance Criteria**
    - `POST /finance/expense` adds an expense.  
    - `GET /finance/summary` returns totals per month.  
    - Returns `200 OK` and warning if budget limit exceeded.

---

## Epic: Protect Legally

- [ ] **Build Legal Templates Library (Frontend)**
  - *User Story:* As a freelancer, I want to access contract templates so I can handle client work independently.  
  - **Acceptance Criteria**
    - Templates for NDAs and freelance agreements.  
    - Editable fields (name, payment, terms).  
    - Download as PDF or DOCX.

- [ ] **Create `/legal/templates` API Endpoints**
  - **Acceptance Criteria**
    - `GET /legal/templates` returns list of templates.  
    - `GET /legal/templates/:id` returns single template.  
    - `POST /legal/templates/fill` returns filled file for download.

---

- [ ] **Build Legal FAQs UI (Frontend)**
  - *User Story:* As a user, I want to access legal FAQs so I can learn basics without hiring a lawyer.  
  - **Acceptance Criteria**
    - Browse by topic (contracts, taxes).  
    - View short, clear answers.  
    - Link to related templates when relevant.

- [ ] **Create `/legal/faqs` API Endpoint**
  - **Acceptance Criteria**
    - Returns JSON array of FAQs by topic.  
    - Supports query `?topic=contracts`.  
    - Responds `200 OK` on success.

---

## Epic: Enjoy Lifestyle

- [ ] **Build Clubs Discovery UI (Frontend)**
  - *User Story:* As a user, I want to join local wellness or book clubs so I can connect with like-minded people.  
  - **Acceptance Criteria**
    - Search clubs by category or location.  
    - Join adds club to personal list/calendar.  
    - “My Clubs” tab displays joined clubs.

- [ ] **Create `/clubs` API Endpoints**
  - **Acceptance Criteria**
    - `GET /clubs` returns searchable list.  
    - `POST /clubs/join` adds club to user profile.  
    - `GET /clubs/my` lists joined clubs.

---

## Epic: Use AI Support

- [ ] **Build Onboarding Quiz (Frontend)**
  - *User Story:* As a new user, I want to receive suggestions from the AI assistant so I can explore the right tools.  
  - **Acceptance Criteria**
    - Quiz collects user goals/interests.  
    - Results personalize feature suggestions.  
    - Data stored via `POST /ai/onboard`.

- [ ] **Create `/ai/suggestions` API Endpoints**
  - **Acceptance Criteria**
    - `POST /ai/suggestions` saves quiz data.  
    - `GET /ai/suggestions` returns list of features.  
    - Weekly reminder message generated server-side.

---

## Epic: Manage Goals

- [ ] **Build Goal Management UI (Frontend)**
  - *User Story:* As a user, I want to set health, finance, and lifestyle goals in one place to balance my efforts.  
  - **Acceptance Criteria**
    - Create/update/delete goals with deadlines.  
    - Progress bars show completion %.  
    - AI prompts when imbalance detected.

- [ ] **Create `/goals` API Endpoints**
  - **Acceptance Criteria**
    - `POST /goals` creates new goal.  
    - `GET /goals` lists all goals.  
    - `PUT /goals/:id` updates progress.  
    - `DELETE /goals/:id` deletes goal.

---

## Shared / Supporting

- [ ] **Authentication (Frontend + API)**
  - *User Story:* As a user, I want to sign in with a one-time email code.  
  - **Acceptance Criteria**
    - Supabase Auth OTP provides JWT.  
    - API protected routes require `Authorization: Bearer <token>`.

- [ ] **Create `/auth/otp/start` and `/auth/otp/verify` API Endpoints**
  - **Acceptance Criteria**
    - `start` sends code to email.  
    - `verify` exchanges code for JWT session.  
    - Tokens required for all write endpoints.
