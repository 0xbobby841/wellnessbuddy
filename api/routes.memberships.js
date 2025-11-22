'use strict';

const express = require('express');
const { supabase } = require('./supabaseClient');
const { requireAuth } = require('./authMiddleware');

const router = express.Router();

// GET /memberships
router.get('/memberships', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { userId, clubId } = req.query;
    let query = supabase.from('memberships').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (clubId) {
      query = query.eq('club_id', clubId);
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

// POST /memberships
router.post('/memberships', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const payload = req.body;

    // Prevent duplicate membership (user_id + club_id)
    const { data: existing, error: existingError } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', payload.user_id)
      .eq('club_id', payload.club_id)
      .maybeSingle();

    if (existingError) {
      return res.status(500).json({ message: existingError.message });
    }

    if (existing) {
      return res.status(409).json({ message: 'User already a member of this club' });
    }

    const { data, error } = await supabase
      .from('memberships')
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

// DELETE /memberships/:membershipId
router.delete('/memberships/:membershipId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { membershipId } = req.params;

    const { error } = await supabase
      .from('memberships')
      .delete()
      .eq('membership_id', membershipId);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

module.exports = router;
