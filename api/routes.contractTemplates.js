'use strict';

const express = require('express');
const { supabase } = require('./supabaseClient');
const { requireAuth } = require('./authMiddleware');

const router = express.Router();

// GET /contract-templates
router.get('/contract-templates', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { category } = req.query;
    let query = supabase.from('contract_templates').select('*');

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

// POST /contract-templates
router.post('/contract-templates', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const payload = req.body;

    const { data, error } = await supabase
      .from('contract_templates')
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

// GET /contract-templates/:templateId
router.get('/contract-templates/:templateId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { templateId } = req.params;

    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('template_id', templateId)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Template not found' });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// PATCH /contract-templates/:templateId
router.patch('/contract-templates/:templateId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { templateId } = req.params;
    const payload = req.body;

    const { data, error } = await supabase
      .from('contract_templates')
      .update(payload)
      .eq('template_id', templateId)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ message: 'Template not found' });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// DELETE /contract-templates/:templateId
router.delete('/contract-templates/:templateId', requireAuth, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    const { templateId } = req.params;

    const { error } = await supabase
      .from('contract_templates')
      .delete()
      .eq('template_id', templateId);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

module.exports = router;
