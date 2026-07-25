const express = require('express');
const router = express.Router();
const services = require('../data/services.json');

router.get('/', (req, res) => {
  const { category } = req.query;
  let result = services.services;
  if (category) {
    result = result.filter(s => s.category === category);
  }
  res.json(result);
});

router.get('/:id', (req, res) => {
  const service = services.services.find(s => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

module.exports = router;
