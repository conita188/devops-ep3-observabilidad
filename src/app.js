
const express = require('express');

const app = express();
const {
  register,
  httpRequestsTotal,
  httpRequestDuration
} = require('./metrics');

app.use(express.json());
// Middleware de observabilidad HTTP
app.use((req, res, next) => {
  // No contabilizar las consultas al endpoint de métricas
  if (req.path === '/metrics') {
    return next();
  }

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1e9;

    const route = req.route?.path || 'unmatched';

    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode)
    };

    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, duration);
  });

  next();
});

// Datos de ejemplo del microservicio
const products = [
  {
    id: 1,
    name: 'Notebook',
    price: 599990
  },
  {
    id: 2,
    name: 'Mouse',
    price: 12990
  }
];

// Endpoint de métricas para Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).send('Error al obtener las métricas');
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Microservicio de productos funcionando',
    status: 'online'
  });
});

// Verificación de salud del servicio
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Servicio funcionando correctamente'
  });
});

// Obtener todos los productos
app.get('/products', (req, res) => {
  res.status(200).json({
    total: products.length,
    products
  });
});

// Registrar un producto
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  if (!name || typeof name !== 'string' || !name.trim() ||
      price === undefined || typeof price !== 'number' ||
      !Number.isFinite(price) || price <= 0) {
    return res.status(400).json({
      error: 'El nombre y el precio válido son obligatorios'
    });
  }

  const newProduct = {
    id: products.length
      ? Math.max(...products.map(product => product.id)) + 1
      : 1,
    name: name.trim(),
    price
  };

  products.push(newProduct);

  res.status(201).json({
    message: 'Producto creado correctamente',
    product: newProduct
  });
});

module.exports = app;
