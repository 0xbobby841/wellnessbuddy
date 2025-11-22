-- 02_seed.sql
-- Sample data for Wellness Buddy core tables
-- Assumes tables from 01_schema.sql already exist
-- and these auth.users IDs already exist:
-- 05c3df7a-ea34-4770-b9cb-d726cd7446c7
-- 1a3f0604-65d8-4b57-bf03-94e010bb1acf
-- 14efc39d-b5f4-4686-91a9-aa5d2663afb7

-- OPTIONAL: clear existing data (uncomment if you want a full reset)
-- TRUNCATE TABLE
--   expenses,
--   contract_templates,
--   memberships,
--   clubs,
--   ai_recommendations,
--   posts,
--   journal_entries,
--   goals,
--   profiles
-- RESTART IDENTITY CASCADE;

------------------------------------------------------------
-- profiles (3 sample users mapped to existing auth.users)
------------------------------------------------------------

INSERT INTO profiles (id, full_name, email, role)
VALUES
  ('05c3df7a-ea34-4770-b9cb-d726cd7446c7', 'Alex Rivera',   'alex@example.com',   'traveler'),
  ('1a3f0604-65d8-4b57-bf03-94e010bb1acf', 'Jordan Chen',   'jordan@example.com', 'traveler'),
  ('14efc39d-b5f4-4686-91a9-aa5d2663afb7', 'Taylor Morgan', 'taylor@example.com', 'moderator')
ON CONFLICT (id) DO NOTHING;

------------------------------------------------------------
-- goals (health, finance, legal, lifestyle)
------------------------------------------------------------

INSERT INTO goals (goal_id, user_id, category, description, target_date)
VALUES
  -- Alex: health & finance goals
  ('11111111-1111-1111-1111-111111111111',
    '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
    'health',
    'Workout 3 times per week for the next month.',
    CURRENT_DATE + INTERVAL '30 days'),
  ('22222222-2222-2222-2222-222222222222',
    '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
    'finance',
    'Reduce eating-out spending by 25% this month.',
    CURRENT_DATE + INTERVAL '30 days'),

  -- Jordan: legal & lifestyle goals
  ('33333333-3333-3333-3333-333333333333',
    '1a3f0604-65d8-4b57-bf03-94e010bb1acf',
    'legal',
    'Set up a standard freelance contract for all new clients.',
    CURRENT_DATE + INTERVAL '45 days'),
  ('44444444-4444-4444-4444-444444444444',
    '1a3f0604-65d8-4b57-bf03-94e010bb1acf',
    'lifestyle',
    'Attend at least 2 wellness club events this month.',
    CURRENT_DATE + INTERVAL '30 days')
ON CONFLICT (goal_id) DO NOTHING;

------------------------------------------------------------
-- journal_entries (each linked to a goal + user)
------------------------------------------------------------

INSERT INTO journal_entries
  (entry_id, goal_id, user_id, entry_date, content, mood_rating)
VALUES
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111111',
    '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
    CURRENT_DATE - INTERVAL '2 days',
    'Morning run felt great, energy was high.',
    5),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '11111111-1111-1111-1111-111111111111',
    '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
    CURRENT_DATE - INTERVAL '1 day',
    'Skipped workout, long workday. A bit disappointed.',
    3),
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    '44444444-4444-4444-4444-444444444444',
    '1a3f0604-65d8-4b57-bf03-94e010bb1acf',
    CURRENT_DATE - INTERVAL '1 day',
    'Attended first yoga club session. Feeling calmer.',
    4)
ON CONFLICT (entry_id) DO NOTHING;

------------------------------------------------------------
-- posts (community style, tied to users)
------------------------------------------------------------

INSERT INTO posts
  (post_id, user_id, title, content, rating, status)
VALUES
  ('ccccccc1-cccc-cccc-cccc-ccccccccccc1',
    '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
    'Weekly workout check-in',
    'Hit 3 out of 3 planned workouts this week.',
    5,
    'approved'),
  ('ccccccc2-cccc-cccc-cccc-ccccccccccc2',
    '1a3f0604-65d8-4b57-bf03-94e010bb1acf',
    'Trying a new budgeting method',
    'Started tracking coffee + food separately to see patterns.',
    4,
    'pending'),
  ('ccccccc3-cccc-cccc-cccc-ccccccccccc3',
    '14efc39d-b5f4-4686-91a9-aa5d2663afb7',
    'Template suggestions?',
    'Thinking about adding a contractor agreement template. Any interest?',
    5,
    'approved')
ON CONFLICT (post_id) DO NOTHING;

------------------------------------------------------------
-- ai_recommendations (simple rule-based suggestions)
------------------------------------------------------------

INSERT INTO ai_recommendations
  (recommendation_id, user_id, category, message, source)
VALUES
  ('ddddddd1-dddd-dddd-dddd-ddddddddddd1',
    '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
    'health',
    'You logged 2 workouts this week. Schedule one more to hit your goal.',
    'weekly_summary'),
  ('ddddddd2-dddd-dddd-dddd-ddddddddddd2',
    '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
    'finance',
    'Dining-out expenses are higher than average. Consider setting a budget limit.',
    'expense_pattern'),
  ('ddddddd3-dddd-dddd-dddd-ddddddddddd3',
    '1a3f0604-65d8-4b57-bf03-94e010bb1acf',
    'lifestyle',
    'You joined a wellness club. Add an event to your calendar for this week.',
    'club_membership')
ON CONFLICT (recommendation_id) DO NOTHING;

------------------------------------------------------------
-- clubs (wellness + book clubs)
------------------------------------------------------------

INSERT INTO clubs
  (club_id, name, description, category)
VALUES
  ('eeeeeee1-eeee-eeee-eeee-eeeeeeeeeee1',
    'Morning Run Crew',
    'Casual group runs three times a week before work.',
    'wellness'),
  ('eeeeeee2-eeee-eeee-eeee-eeeeeeeeeee2',
    'Mindful Readers Book Club',
    'Monthly meetup to discuss books on mental health and productivity.',
    'book'),
  ('eeeeeee3-eeee-eeee-eeee-eeeeeeeeeee3',
    'Budget Hackers',
    'Online group sharing tips for saving money and reducing stress.',
    'finance')
ON CONFLICT (club_id) DO NOTHING;

------------------------------------------------------------
-- memberships (user ↔ club links, unique per pair)
------------------------------------------------------------

INSERT INTO memberships
  (membership_id, user_id, club_id, joined_at)
VALUES
  ('fffffff1-ffff-ffff-ffff-fffffffffff1',
    '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
    'eeeeeee1-eeee-eeee-eeee-eeeeeeeeeee1',
    CURRENT_TIMESTAMP - INTERVAL '7 days'),
  ('fffffff2-ffff-ffff-ffff-fffffffffff2',
    '1a3f0604-65d8-4b57-bf03-94e010bb1acf',
    'eeeeeee2-eeee-eeee-eeee-eeeeeeeeeee2',
    CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ('fffffff3-ffff-ffff-ffff-fffffffffff3',
    '1a3f0604-65d8-4b57-bf03-94e010bb1acf',
    'eeeeeee1-eeee-eeee-eeee-eeeeeeeeeee1',
    CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (membership_id) DO NOTHING;

------------------------------------------------------------
-- contract_templates (NDA + freelance, read-only-ish)
------------------------------------------------------------

INSERT INTO contract_templates
  (template_id, creator_id, title, category, description, file_url)
VALUES
  ('99999999-9999-9999-9999-999999999991',
    '14efc39d-b5f4-4686-91a9-aa5d2663afb7',
    'Standard NDA (One-Way)',
    'legal',
    'Basic one-way non-disclosure agreement for early-stage projects.',
    'https://example.com/templates/nda_one_way_v1.pdf'),
  ('99999999-9999-9999-9999-999999999992',
    '14efc39d-b5f4-4686-91a9-aa5d2663afb7',
    'Freelance Services Agreement',
    'legal',
    'Short-form agreement for freelance work with simple payment terms.',
    'https://example.com/templates/freelance_services_v1.pdf')
ON CONFLICT (template_id) DO NOTHING;

------------------------------------------------------------
-- expenses (linked to users, some tied to goals)
------------------------------------------------------------

INSERT INTO expenses
  (expense_id, user_id, goal_id, category, amount, date, description)
VALUES
  ('77777777-7777-7777-7777-777777777771',
    '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
    '22222222-2222-2222-2222-222222222222', -- finance goal
    'dining_out',
    42.50,
    CURRENT_DATE - INTERVAL '3 days',
    'Dinner with friends'),
  ('77777777-7777-7777-7777-777777777772',
    '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
    '22222222-2222-2222-2222-222222222222',
    'groceries',
    96.20,
    CURRENT_DATE - INTERVAL '1 day',
    'Weekly grocery run'),
  ('77777777-7777-7777-7777-777777777773',
    '1a3f0604-65d8-4b57-bf03-94e010bb1acf',
    NULL, -- general expense, not tied to a goal
    'subscriptions',
    12.99,
    CURRENT_DATE - INTERVAL '5 days',
    'Meditation app subscription')
ON CONFLICT (expense_id) DO NOTHING;
