'use strict';

const express = require('express');
const { supabase } = require('./supabaseClient');
const { requireAuth } = require('./authMiddleware');

const router = express.Router();

// GET /clubs
router.get('/clubs', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { category } = req.query;
    let query = supabase.from('clubs').select('*');

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

// POST /clubs
router.post('/clubs', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const payload = req.body;

    const { data, error } = await supabase
      .from('clubs')
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

// GET /clubs/:clubId
router.get('/clubs/:clubId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { clubId } = req.params;

    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('club_id', clubId)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Club not found' });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// PATCH /clubs/:clubId
router.patch('/clubs/:clubId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { clubId } = req.params;
    const payload = req.body;

    const { data, error } = await supabase
      .from('clubs')
      .update(payload)
      .eq('club_id', clubId)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ message: 'Club not found' });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// DELETE /clubs/:clubId
router.delete('/clubs/:clubId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { clubId } = req.params;

    const { error } = await supabase
      .from('clubs')
      .delete()
      .eq('club_id', clubId);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

module.exports = router;
