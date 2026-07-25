const express = require('express');
const cors = require('cors');
const path = require('path');
const servicesRoutes = require('./server/routes/services');
const storesRoutes = require('./server/routes/stores');
const therapistsRoutes = require('./server/routes/therapists');
const ordersRoutes = require('./server/routes/orders');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/services', servicesRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/therapists', therapistsRoutes);
app.use('/api/orders', ordersRoutes);

// Serve frontend static files
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

module.exports = app;
