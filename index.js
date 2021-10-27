require('dotenv').config();
require('./app');

const datasources = require('./datasources');

const { Sexo } = require('./enums/sexo.enum');
const { Estado } = require('./enums/estado.enum');

const { Pessoa } = require('./models/pessoa.model');
const { Cidade } = require('./models/cidade.model');

const { PessoasRepository } = require('./repositories/pessoas.repository');
const { CidadesRepository } = require('./repositories/cidades.repository');

initDatasources().then(() => {
  const city = new Cidade();
  city.nome = 'Macaé';
  city.estado = Estado.RJ;

  new CidadesRepository().create(city).then(() => {
    console.log('cidade criada!');
  })
});

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
    await ds.connect();
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