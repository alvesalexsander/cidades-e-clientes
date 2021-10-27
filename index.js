require('dotenv').config();

const datasources = require('./datasources');

initDatasources();

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

async function initDatasources() {
  for (const ds of Object.values(datasources)) {
    ds.connect();
  }
}

async function closeDatasources() {
  for (const ds of Object.values(datasources)) {
    await ds.close();
  }
}

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