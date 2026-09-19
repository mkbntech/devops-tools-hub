const client = require('prom-client');

const register = new client.Registry();
register.setDefaultLabels({ app: 'devops-tools-hub' });
client.collectDefaultMetrics({ register });

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2.5, 5]
});

register.registerMetric(httpRequestDurationSeconds);

function metricsMiddleware(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    let route = req.route ? req.route.path : req.path;
    if (!req.route) {
      route = route.replace(/\/\d+/g, '/:id').replace(/\/tools\/[^\/]+/g, '/tools/:id');
    }
    httpRequestDurationSeconds
      .labels(req.method, route || req.path, res.statusCode)
      .observe(duration);
  });
  next();
}

module.exports = {
  register,
  metricsMiddleware
};
