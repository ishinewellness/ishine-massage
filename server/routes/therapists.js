const express = require('express');
const router = express.Router();
const therapists = require('../data/therapists.json');

router.get('/', (req, res) => {
  const { available } = req.query;
  let result = therapists;
  if (available === 'true') {
    result = result.filter(t => t.available);
  }
  res.json(result);
});

router.get('/:id', (req, res) => {
  const therapist = therapists.find(t => t.id === req.params.id);
  if (!therapist) return res.status(404).json({ error: 'Therapist not found' });
  res.json(therapist);
});

module.exports = router;
