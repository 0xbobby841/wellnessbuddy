'use strict';

const express = require('express');
const { supabase } = require('./supabaseClient');
const { requireAuth } = require('./authMiddleware');

const router = express.Router();

// GET /expenses
router.get('/expenses', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { userId, fromDate, toDate } = req.query;
    let query = supabase.from('expenses').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (fromDate) {
      query = query.gte('date', fromDate);
    }

    if (toDate) {
      query = query.lte('date', toDate);
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

// POST /expenses
router.post('/expenses', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const payload = req.body;

    const { data, error } = await supabase
      .from('expenses')
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

// GET /expenses/:expenseId
router.get('/expenses/:expenseId', requireAuth, async (req, res) => {
  try {
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
