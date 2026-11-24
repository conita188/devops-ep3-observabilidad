
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Microservicio iniciado en el puerto ${PORT}`);
});

// Cierre controlado del servidor
process.on('SIGTERM', () => {
  console.log('Recibida señal SIGTERM. Cerrando servidor...');

  server.close(() => {
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Recibida señal SIGINT. Cerrando servidor...');

  server.close(() => {
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });
});
