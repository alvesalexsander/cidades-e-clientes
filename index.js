require('dotenv').config();

const { initDatasources, closeDatasources } = require('./src/datasources');

initDatasources().then(() => {
  require('./server');
});

async function gracefulShutdown() {
  console.log('App :: gracefulShutdown :: tentando graceful shutdown da aplicação...');
  try {
    await closeDatasources();
    console.log('App :: gracefulShutdown :: sucesso, saindo da aplicação');
  } catch (err) {
    console.log('App :: gracefulShutdown :: erro durante o graceful shutdown...', JSON.stringify(err));
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.info('SIGTERM');
  await gracefulShutdown().finally(() => {
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.info('SIGINT');
  await gracefulShutdown().finally(() => {
    process.exit(0);
  });
});