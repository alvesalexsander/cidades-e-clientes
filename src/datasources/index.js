const { MongoDBDatasource } = require('./mongo.datasource');

const datasources = {
  mongoDB: new MongoDBDatasource()
}

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

module.exports = {
  ...datasources,
  initDatasources,
  closeDatasources
};