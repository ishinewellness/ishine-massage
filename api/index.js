const express = require('express');
const cors = require('cors');
const path = require('path');
const servicesRoutes = require('../server/routes/services');
const storesRoutes = require('../server/routes/stores');
const therapistsRoutes = require('../server/routes/therapists');
const ordersRoutes = require('../server/routes/orders');

const app = express();

app.use(cors());

// Body parsing — tolerant of Vercel's pre-parsed request body (avoids 400 on re-read)
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') return next(); // Vercel already parsed it
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
