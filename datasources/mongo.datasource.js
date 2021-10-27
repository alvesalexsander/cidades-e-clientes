const { Datasource } = require('./common/datasource');
const { MongoClient } = require('mongodb');

class MongoDBDatasource extends Datasource {
  connectionUrl = process.env.MONGO_URI;

  async connect() {
    if (this.instance) {
      return;
    }

    this.instance = await MongoClient.connect(this.connectionUrl
      .replace('user', process.env.MONGO_USER)
      .replace('password', process.env.MONGO_PASSWORD)).then(client => {
        console.log(`MongoDBDatasource :: connect :: conectado ao datasource com sucesso.`);
        return client;
      }).catch(err => {
        console.log(`MongoDBDatasource :: connect :: error :: erro ao conectar com o datasource.`, JSON.stringify(err));
        throw err;
      });
  }

  async close() {
    if (!this.instance) {
      return;
    }

    await this.instance.close();
  }
}

module.exports = { MongoDBDatasource };