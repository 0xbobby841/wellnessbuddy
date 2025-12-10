'use strict';

const express = require('express');
const { supabase } = require('./supabaseClient');
const { requireAuth } = require('./authMiddleware');

const router = express.Router();

// GET /journal - current user's journal entries, optional type filter (journal|workout)
router.get('/journal', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { type } = req.query;

    let query = supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (type) {
      query = query.eq('entry_type', type);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({ data: data || [] });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// POST /journal - create entry for current user
router.post('/journal', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { goal_id, entry_date, content, mood_rating, entry_type } = req.body;

    if (!goal_id || !entry_date || !content) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'goal_id, entry_date, and content are required' } });
    }

    // Ensure goal belongs to current user
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('goal_id')
      .eq('goal_id', goal_id)
      .eq('user_id', userId)
      .single();

    if (goalError || !goal) {
      return res.status(400).json({ error: { code: 'INVALID_GOAL', message: 'Goal does not belong to current user' } });
    }

    const payload = {
      user_id: userId,
      goal_id,
      entry_date,
      content,
      mood_rating: mood_rating ?? null,
      entry_type: entry_type || 'journal',
    };

    const { data, error } = await supabase
      .from('journal_entries')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// GET /journal/:entryId - specific entry for current user
router.get('/journal/:entryId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { entryId } = req.params;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('entry_id', entryId)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// PUT /journal/:entryId - update entry for current user
router.put('/journal/:entryId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { entryId } = req.params;
    const { entry_date, content, mood_rating, entry_type } = req.body;
    const payload = {
      ...(entry_date && { entry_date }),
      ...(content && { content }),
      ...(mood_rating !== undefined && { mood_rating }),
      ...(entry_type && { entry_type }),
    };

    const { data, error } = await supabase
      .from('journal_entries')
      .update(payload)
      .eq('entry_id', entryId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// DELETE /journal/:entryId - delete entry for current user
router.delete('/journal/:entryId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { entryId } = req.params;

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('entry_id', entryId)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

module.exports = router;
