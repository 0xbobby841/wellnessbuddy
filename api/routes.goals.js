'use strict';

const express = require('express');
const { getSupabase } = require('./supabaseClient');
const { requireAuth } = require('./authMiddleware');

const router = express.Router();

// GET /goals - current user's goals
router.get('/goals', requireAuth, async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ error: { code: 'SUPABASE_NOT_INITIALIZED', message: 'Supabase client not initialized' } });
    }
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { data, error } = await supabase
      .from('goals')
      .select('goal_id, category, description, target_date')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: { code: 'DB_ERROR', message: error.message } });
    }

    return res.json({ data: data || [] });
  } catch (err) {
    return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Internal server error' } });
  }
});

// POST /goals - create goal for current user
router.post('/goals', requireAuth, async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { category, description, target_date } = req.body;
    const payload = {
      user_id: userId,
      category,
      description,
      target_date: target_date || null,
    };

    const { data, error } = await supabase.from('goals').insert(payload).select().single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({ data });
  } catch (err) {
    return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Internal server error' } });
  }
});

// GET /goals/:goalId - current user's specific goal
router.get('/goals/:goalId', requireAuth, async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ error: { code: 'SUPABASE_NOT_INITIALIZED', message: 'Supabase client not initialized' } });
    }

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { goalId } = req.params;

    const { data, error } = await supabase
      .from('goals')
      .select('goal_id, category, description, target_date')
      .eq('goal_id', goalId)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Goal not found' } });
    }

    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Internal server error' } });
  }
});

// PUT /goals/:goalId - update current user's goal
router.put('/goals/:goalId', requireAuth, async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { goalId } = req.params;
    const { category, description, target_date } = req.body;
    const payload = {
      ...(category && { category }),
      ...(description && { description }),
      ...(target_date !== undefined && { target_date }),
    };

    const { data, error } = await supabase
      .from('goals')
      .update(payload)
      .eq('goal_id', goalId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Internal server error' } });
  }
});

// DELETE /goals/:goalId - null out related expenses.goal_id, then delete goal if owned by user
router.delete('/goals/:goalId', requireAuth, async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { goalId } = req.params;
    // Null out goal_id on related expenses for this user
    const { error: expenseError } = await supabase
      .from('expenses')
      .update({ goal_id: null })
      .eq('goal_id', goalId)
      .eq('user_id', userId);

    if (expenseError) {
      return res.status(500).json({ error: { code: 'DB_ERROR', message: expenseError.message } });
    }

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('goal_id', goalId)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Internal server error' } });
  }
});

module.exports = router;
