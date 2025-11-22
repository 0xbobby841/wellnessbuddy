'use strict';

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
// Prefer new-style env names, but keep backward-compatible fallbacks.
const SUPABASE_SERVER_KEY =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVER_KEY) {
  // Intentionally using console.error instead of throwing so the app can still start
  console.error('Supabase environment variables are missing. Please set SUPABASE_URL and SUPABASE_SECRET_KEY (or another valid server key env).');
}

const supabase = SUPABASE_URL && SUPABASE_SERVER_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVER_KEY)
  : null;

module.exports = {
  supabase,
};
