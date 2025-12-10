'use strict';

const express = require('express');
const { getSupabase } = require('./supabaseClient');
const { requireAuth } = require('./authMiddleware');

const router = express.Router();

// GET /expenses - current user's expenses, optional month filter (YYYY-MM)
router.get('/expenses', requireAuth, async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ error: { code: 'SUPABASE_NOT_INITIALIZED', message: 'Supabase client not initialized' } });
    }
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { month } = req.query;

    let query = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (month) {
      const start = `${month}-01`;
      const [yearStr, monthStr] = month.split('-');
      const year = Number(yearStr);
      const m = Number(monthStr);
      const endDate = new Date(Date.UTC(year, m, 0)); // last day of month
      const end = endDate.toISOString().slice(0, 10);
      query = query.gte('date', start).lte('date', end);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: { code: 'DB_ERROR', message: error.message } });
    }

    let responseBody = { data: data || [] };
    if (month && data) {
      const total = data.reduce((sum, row) => sum + Number(row.amount || 0), 0);
      responseBody.monthlyTotal = total;
    }

    return res.json(responseBody);
  } catch (err) {
    return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Internal server error' } });
  }
});

// POST /expenses - create expense for current user
router.post('/expenses', requireAuth, async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
    }

    const { category, amount, date, description, goal_id } = req.body;

    if (!category || amount == null || !date) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'category, amount, and date are required' } });
    }

    let resolvedGoalId = goal_id || null;
    if (resolvedGoalId) {
      const { data: goal, error: goalError } = await supabase
        .from('goals')
        .select('goal_id')
        .eq('goal_id', resolvedGoalId)
        .eq('user_id', userId)
        .single();

      if (goalError || !goal) {
        return res.status(400).json({ error: { code: 'INVALID_GOAL', message: 'Goal does not belong to current user' } });
      }
    }

    const payload = {
      user_id: userId,
      goal_id: resolvedGoalId,
      category,
      amount,
      date,
      description: description || null,
    };

    const { data, error } = await supabase.from('expenses').insert(payload).select().single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({ data });
  } catch (err) {
    return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Internal server error' } });
  }
});

// GET /expenses/:expenseId
router.get('/expenses/:expenseId', requireAuth, async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { expenseId } = req.params;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('expense_id', expenseId)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// PATCH /expenses/:expenseId
router.patch('/expenses/:expenseId', requireAuth, async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { expenseId } = req.params;
    const payload = req.body;

    const { data, error } = await supabase
      .from('expenses')
      .update(payload)
      .eq('expense_id', expenseId)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// DELETE /expenses/:expenseId
router.delete('/expenses/:expenseId', requireAuth, async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { expenseId } = req.params;

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('expense_id', expenseId);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

module.exports = router;
