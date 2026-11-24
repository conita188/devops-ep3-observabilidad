
const request = require('supertest');
const app = require('../src/app');

describe('Pruebas del microservicio', () => {

  test('GET / debe responder con estado 200', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('online');
  });

  test('GET /health debe indicar que el servicio está UP', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('UP');
  });

  test('GET /products debe devolver una lista de productos', async () => {
    const response = await request(app).get('/products');

    expect(response.statusCode).toBe(200);
    expect(response.body.products).toBeInstanceOf(Array);
    expect(response.body.total).toBeGreaterThanOrEqual(2);
  });

  test('POST /products debe crear un producto correctamente', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        name: 'Monitor',
        price: 149990
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.product.name).toBe('Monitor');
    expect(response.body.product.price).toBe(149990);
  });

  test('POST /products debe rechazar datos inválidos', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        name: '',
        price: 0
      });

    expect(response.statusCode).toBe(400);
  });

  test('GET /metrics debe entregar métricas de Prometheus', async () => {
  const response = await request(app).get('/metrics');

  expect(response.statusCode).toBe(500);
  expect(response.text).toContain('http_requests_total');
  expect(response.text).toContain('http_request_duration_seconds');
  expect(response.text).toContain('nodejs_');
});

});
