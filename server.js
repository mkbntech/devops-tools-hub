const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./src/config/config');
const { initDatabase } = require('./src/db/database');
const { register, metricsMiddleware } = require('./src/middleware/metrics');

const webRoutes = require('./src/routes/web');
const apiRoutes = require('./src/routes/api');

// Initialize database
initDatabase();

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(metricsMiddleware);

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: config.serviceName,
    version: config.version,
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api', apiRoutes);
app.use('/', webRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found — ' + config.siteTitle,
    toolId: null
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).send('Internal Server Error');
});

const server = app.listen(config.port, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 ${config.siteTitle} v${config.version}`);
  console.log(`🌍 Web Application:   http://localhost:${config.port}`);
  console.log(`📡 REST API:          http://localhost:${config.port}/api/tools`);
  console.log(`📊 Prometheus Metrics: http://localhost:${config.port}/metrics`);
  console.log(`💚 Health Check:       http://localhost:${config.port}/health`);
  console.log(`======================================================\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server.');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

module.exports = app;
