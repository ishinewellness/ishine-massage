const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json');

function readOrders() {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

router.get('/', (req, res) => {
  const orders = readOrders();
  const { phone } = req.query;
  if (phone) {
    return res.json(orders.filter(o => o.phone === phone));
  }
  res.json(orders);
});

router.get('/:id', (req, res) => {
  const orders = readOrders();
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

router.post('/', (req, res) => {
  const orders = readOrders();
  const { mode, serviceId, storeId, therapistId, customerName, phone, address, date, time, note } = req.body;

  const order = {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    mode,
    serviceId,
    storeId: storeId || null,
    therapistId: therapistId || null,
    customerName,
    phone,
    address: address || null,
    date,
    time,
    note: note || '',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  saveOrders(orders);
  res.status(201).json(order);
});

router.patch('/:id/status', (req, res) => {
  const orders = readOrders();
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status;
  saveOrders(orders);
  res.json(order);
});

module.exports = router;
