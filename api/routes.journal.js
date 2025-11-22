'use strict';

const express = require('express');
const { supabase } = require('./supabaseClient');
const { requireAuth } = require('./authMiddleware');

const router = express.Router();

// GET /journal-entries
router.get('/journal-entries', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { userId, goalId, fromDate, toDate } = req.query;
    let query = supabase.from('journal_entries').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (goalId) {
      query = query.eq('goal_id', goalId);
    }

    if (fromDate) {
      query = query.gte('entry_date', fromDate);
    }

    if (toDate) {
      query = query.lte('entry_date', toDate);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// POST /journal-entries
router.post('/journal-entries', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const payload = req.body;

    const { data, error } = await supabase
      .from('journal_entries')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// GET /journal-entries/:entryId
router.get('/journal-entries/:entryId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { entryId } = req.params;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('entry_id', entryId)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// PATCH /journal-entries/:entryId
router.patch('/journal-entries/:entryId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { entryId } = req.params;
    const payload = req.body;

    const { data, error } = await supabase
      .from('journal_entries')
      .update(payload)
      .eq('entry_id', entryId)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// DELETE /journal-entries/:entryId
router.delete('/journal-entries/:entryId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { entryId } = req.params;

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('entry_id', entryId);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

module.exports = router;
