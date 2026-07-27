const express = require('express');
const cors = require('cors');
const path = require('path');
const servicesRoutes = require('../server/routes/services');
const storesRoutes = require('../server/routes/stores');
const therapistsRoutes = require('../server/routes/therapists');
const ordersRoutes = require('../server/routes/orders');

const app = express();

app.use(cors());

// DEBUG: inspect what Vercel delivers as the raw request body
app.post('/api/echo', (req, res) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString();
    res.json({
      rawLength: raw.length,
      rawPreview: raw.slice(0, 200),
      bodyType: typeof req.body,
      bodyPreview: typeof req.body === 'string' ? req.body.slice(0, 200) : req.body
    });
  });
  req.on('error', () => res.json({ error: 'stream error' }));
});

// Body parsing — tolerant of Vercel's pre-parsed request body (avoids 400 on re-read)
// Vercel may pre-populate req.body as a JSON *string*; handle string, object, or raw stream.
app.use((req, res, next) => {
  const b = req.body;
  if (b !== undefined && b !== null) {
    if (typeof b === 'string') {
      try { req.body = b ? JSON.parse(b) : {}; } catch { req.body = {}; }
    }
    // already an object/array — keep as-is
    return next();
  }
  // fallback: read the raw stream (local dev / Vite proxy)
  let data = '';
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    try { req.body = data ? JSON.parse(data) : {}; } catch { req.body = {}; }
    next();
  };
  const t = setTimeout(finish, 3000);
  req.on('data', (c) => { data += c; });
  req.on('end', () => { clearTimeout(t); finish(); });
  req.on('error', () => { clearTimeout(t); finish(); });
});

app.use('/api/services', servicesRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/therapists', therapistsRoutes);
app.use('/api/orders', ordersRoutes);

// Serve frontend static files
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

module.exports = app;
