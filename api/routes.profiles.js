'use strict';

const express = require('express');
const { supabase } = require('./supabaseClient');
const { requireAuth } = require('./authMiddleware');

const router = express.Router();

// GET /profiles
router.get('/profiles', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { role } = req.query;
    let query = supabase.from('profiles').select('*');

    if (role) {
      query = query.eq('role', role);
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

// POST /profiles
router.post('/profiles', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const payload = req.body;

    const { data, error } = await supabase
      .from('profiles')
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

// GET /profiles/:id
router.get('/profiles/:id', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { id } = req.params;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('No rows')) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      return res.status(500).json({ message: error.message });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// PATCH /profiles/:id
router.patch('/profiles/:id', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { id } = req.params;
    const payload = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('No rows')) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      return res.status(500).json({ message: error.message });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// DELETE /profiles/:id
router.delete('/profiles/:id', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

module.exports = router;
