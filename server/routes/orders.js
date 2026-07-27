const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json');

const isVercel = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

function readOrders() {
  const candidates = isVercel ? ['/tmp/orders.json', ORDERS_FILE] : [ORDERS_FILE];
  for (const f of candidates) {
    try {
      const data = fs.readFileSync(f, 'utf-8');
      return JSON.parse(data);
    } catch {
      // try next candidate
    }
  }
  return [];
}

// Read and parse the raw request body (works on Vercel where express.json re-reads a drained stream)
function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString();
      try { resolve(raw ? JSON.parse(raw) : {}); } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function saveOrders(orders) {
  // Vercel's code directory is read-only; fall back to /tmp so the request still succeeds
  const candidates = isVercel ? ['/tmp/orders.json', ORDERS_FILE] : [ORDERS_FILE];
  for (const f of candidates) {
    try {
      fs.writeFileSync(f, JSON.stringify(orders, null, 2));
      return;
    } catch {
      // try next candidate
    }
  }
  console.warn('[orders] could not persist order to disk; request still succeeded');
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

router.post('/', async (req, res) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString();
    res.json({ rawLength: raw.length, rawPreview: raw.slice(0, 200) });
  });
  req.on('error', () => res.json({ error: 'stream error' }));
  return;";
  const body = await readBody(req);
  const orders = readOrders();
  const { mode, serviceId, storeId, therapistId, customerName, phone, address, date, time, note } = body;

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
