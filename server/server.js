const express = require('express');
const cors = require('cors');
const path = require('path');
const servicesRoutes = require('./routes/services');
const storesRoutes = require('./routes/stores');
const therapistsRoutes = require('./routes/therapists');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/services', servicesRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/therapists', therapistsRoutes);
app.use('/api/orders', ordersRoutes);

// Serve frontend static files
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`iShine server running on http://localhost:${PORT}`);
});
