const express = require('express');
const cors = require('cors');
const path = require('path');
const servicesRoutes = require('../server/routes/services');
const storesRoutes = require('../server/routes/stores');
const therapistsRoutes = require('../server/routes/therapists');
const ordersRoutes = require('../server/routes/orders');

const app = express();

app.use(cors());

// DEBUG app.post direct
app.post('/api/echo2', (req, res) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString();
    res.json({ src: 'app.post', rawLength: raw.length, rawPreview: raw.slice(0, 200) });
  });
  req.on('error', () => res.json({ src: 'app.post', error: 'stream error' }));
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
