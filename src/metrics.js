
const client = require('prom-client');

// Registro donde se almacenarán las métricas
const register = new client.Registry();

// Recopilar métricas internas de Node.js
client.collectDefaultMetrics({
  register
});

// Contador de solicitudes HTTP
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de solicitudes HTTP recibidas',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Histograma para medir tiempos de respuesta
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de las solicitudes HTTP en segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register]
});

module.exports = {
  register,
  httpRequestsTotal,
  httpRequestDuration
};
