'use strict';

const express = require('express');
const { supabase } = require('./supabaseClient');
const { requireAuth } = require('./authMiddleware');

const router = express.Router();

// GET /ai/recommendations
router.get('/ai/recommendations', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { userId, category } = req.query;
    let query = supabase.from('ai_recommendations').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (category) {
      query = query.eq('category', category);
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

// POST /ai/recommendations
router.post('/ai/recommendations', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const payload = req.body;

    const { data, error } = await supabase
      .from('ai_recommendations')
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

module.exports = router;
