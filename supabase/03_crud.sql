-- ============================================
-- PROFILES (uses existing auth.users IDs)
-- ============================================

-- CREATE: make a profile for an existing auth.users row
INSERT INTO profiles (id, full_name, email, role)
VALUES (
  '05c3df7a-ea34-4770-b9cb-d726cd7446c7', -- replace with any auth.users.id
  'Alex Test',
  'alex.test@example.com',
  'traveler'
);

-- READ: see all profiles
SELECT * FROM profiles;

-- READ: find one profile by email
SELECT * FROM profiles
WHERE email = 'alex.test@example.com';

-- UPDATE: change name + role (also tests updated_at trigger)
UPDATE profiles
SET full_name = 'Alex Test (Updated)',
    role       = 'moderator'
WHERE email = 'alex.test@example.com';

-- DELETE: remove that test profile
DELETE FROM profiles
WHERE email = 'alex.test@example.com';



-- ============================================
-- GOALS
-- ============================================

-- CREATE: add a health goal for a known user
INSERT INTO goals (user_id, category, description, target_date)
VALUES (
  '05c3df7a-ea34-4770-b9cb-d726cd7446c7',   -- profiles.id
  'health',
  'Workout 3 times per week for 4 weeks',
  CURRENT_DATE + INTERVAL '28 days'
)
RETURNING goal_id;  -- copy this goal_id for later tests

-- READ: list all goals for that user
SELECT * FROM goals
WHERE user_id = '05c3df7a-ea34-4770-b9cb-d726cd7446c7';

-- UPDATE: change target_date for one goal (paste a real goal_id)
UPDATE goals
SET target_date = CURRENT_DATE + INTERVAL '35 days'
WHERE goal_id = '11111111-1111-1111-1111-111111111111';

-- DELETE: delete that goal
DELETE FROM goals
WHERE goal_id = '11111111-1111-1111-1111-111111111111';



-- ============================================
-- JOURNAL ENTRIES
-- ============================================

-- CREATE: add a journal entry tied to a goal + user
INSERT INTO journal_entries (goal_id, user_id, entry_date, content, mood_rating)
VALUES (
  '22222222-2222-2222-2222-222222222222',  -- replace with an existing goal_id
  '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
  CURRENT_DATE,
  'First workout this week, felt good.',
  4
)
RETURNING entry_id;

-- READ: list all entries for a user
SELECT * FROM journal_entries
WHERE user_id = '05c3df7a-ea34-4770-b9cb-d726cd7446c7'
ORDER BY entry_date DESC;

-- UPDATE: tweak mood rating/content
UPDATE journal_entries
SET mood_rating = 5,
    content     = 'Updated: felt amazing after run.'
WHERE entry_id = 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1';

-- DELETE: remove that entry
DELETE FROM journal_entries
WHERE entry_id = 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1';



-- ============================================
-- POSTS
-- ============================================

-- CREATE: add a community-style post
INSERT INTO posts (user_id, title, content, rating, status)
VALUES (
  '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
  'Weekly check-in',
  'Hit all my planned workouts this week!',
  5,
  'pending'
)
RETURNING post_id;

-- READ: all posts + filter by status
SELECT * FROM posts;

SELECT * FROM posts
WHERE status = 'pending';

-- UPDATE: approve a post
UPDATE posts
SET status = 'approved'
WHERE post_id = 'ccccccc1-cccc-cccc-cccc-ccccccccccc1';

-- DELETE: remove a post
DELETE FROM posts
WHERE post_id = 'ccccccc1-cccc-cccc-cccc-ccccccccccc1';



-- ============================================
-- AI RECOMMENDATIONS
-- ============================================

-- CREATE: add a recommendation for a user
INSERT INTO ai_recommendations (user_id, category, message, source)
VALUES (
  '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
  'health',
  'You logged 2 workouts this week. Schedule one more to hit your goal.',
  'weekly_summary'
)
RETURNING recommendation_id;

-- READ: all recommendations for a user
SELECT * FROM ai_recommendations
WHERE user_id = '05c3df7a-ea34-4770-b9cb-d726cd7446c7'
ORDER BY created_at DESC;

-- (No UPDATE/DELETE usually needed for these, but you can:)
UPDATE ai_recommendations
SET message = 'Updated message text'
WHERE recommendation_id = 'ddddddd1-dddd-dddd-dddd-ddddddddddd1';

DELETE FROM ai_recommendations
WHERE recommendation_id = 'ddddddd1-dddd-dddd-dddd-ddddddddddd1';



-- ============================================
-- CLUBS
-- ============================================

-- CREATE: add a club
INSERT INTO clubs (name, description, category)
VALUES (
  'Morning Run Crew',
  'Casual group runs before work, 3x per week.',
  'wellness'
)
RETURNING club_id;

-- READ: list all clubs
SELECT * FROM clubs;

-- UPDATE: change description
UPDATE clubs
SET description = 'Updated description for Morning Run Crew.'
WHERE club_id = 'eeeeeee1-eeee-eeee-eeee-eeeeeeeeeee1';

-- DELETE: remove a club (will also delete memberships due to FK)
DELETE FROM clubs
WHERE club_id = 'eeeeeee1-eeee-eeee-eeee-eeeeeeeeeee1';



-- ============================================
-- MEMBERSHIPS (user ↔ club join table)
-- ============================================

-- CREATE: user joins a club
INSERT INTO memberships (user_id, club_id)
VALUES (
  '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
  'eeeeeee2-eeee-eeee-eeee-eeeeeeeeeee2'  -- existing club_id
)
RETURNING membership_id;

-- READ: all clubs for a user
SELECT m.*, c.name AS club_name
FROM memberships m
JOIN clubs c ON c.club_id = m.club_id
WHERE m.user_id = '05c3df7a-ea34-4770-b9cb-d726cd7446c7';

-- DELETE: user leaves a club
DELETE FROM memberships
WHERE user_id = '05c3df7a-ea34-4770-b9cb-d726cd7446c7'
  AND club_id = 'eeeeeee2-eeee-eeee-eeee-eeeeeeeeeee2';



-- ============================================
-- CONTRACT TEMPLATES
-- ============================================

-- CREATE: add a contract template
INSERT INTO contract_templates (creator_id, title, category, description, file_url)
VALUES (
  '14efc39d-b5f4-4686-91a9-aa5d2663afb7',  -- profiles.id of a "creator"
  'Standard NDA (One-Way)',
  'legal',
  'Simple NDA to protect confidential info.',
  'https://example.com/templates/nda-one-way.pdf'
)
RETURNING template_id;

-- READ: list all templates
SELECT * FROM contract_templates;

-- UPDATE: tweak description (though spec says "read-only", this tests the table)
UPDATE contract_templates
SET description = 'Updated NDA description for testing.'
WHERE template_id = '99999999-9999-9999-9999-999999999991';

-- DELETE: remove a template
DELETE FROM contract_templates
WHERE template_id = '99999999-9999-9999-9999-999999999991';



-- ============================================
-- EXPENSES
-- ============================================

-- CREATE: add an expense tied to a user + optional goal
INSERT INTO expenses (user_id, goal_id, category, amount, date, description)
VALUES (
  '05c3df7a-ea34-4770-b9cb-d726cd7446c7',
  '22222222-2222-2222-2222-222222222222',  -- existing finance goal_id or NULL
  'dining_out',
  32.75,
  CURRENT_DATE - INTERVAL '1 day',
  'Dinner with friends'
)
RETURNING expense_id;

-- READ: list all expenses for a user (most recent first)
SELECT * FROM expenses
WHERE user_id = '05c3df7a-ea34-4770-b9cb-d726cd7446c7'
ORDER BY date DESC;

-- UPDATE: change amount/description
UPDATE expenses
SET amount = 29.99,
    description = 'Updated: dinner amount corrected.'
WHERE expense_id = '77777777-7777-7777-7777-777777777771';

-- DELETE: remove that expense
DELETE FROM expenses
WHERE expense_id = '77777777-7777-7777-7777-777777777771';
