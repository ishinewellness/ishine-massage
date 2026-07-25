const express = require('express');
const router = express.Router();
const stores = require('../data/stores.json');

router.get('/', (req, res) => {
  res.json(stores);
});

router.get('/:id', (req, res) => {
  const store = stores.find(s => s.id === req.params.id);
  if (!store) return res.status(404).json({ error: 'Store not found' });
  res.json(store);
});

module.exports = router;
