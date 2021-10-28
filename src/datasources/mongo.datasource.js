const { Datasource } = require('./common/datasource');
const { MongoClient } = require('mongodb');

class MongoDBDatasource extends Datasource {
  connectionUrl = process.env.MONGO_URI;
  client;

  async connect() {
    if (this.connection) {
      return;
    }

    this.connection = await MongoClient.connect(this.connectionUrl
      .replace('user', process.env.MONGO_USER)
      .replace('password', process.env.MONGO_PASSWORD)).then(client => {
        console.log(`MongoDBDatasource :: connect :: conectado ao datasource com sucesso.`);
        this.client = client;
        return client.db(process.env.MONGO_DATABASE || 'cidades-e-pessoas');
      }).catch(err => {
        console.log(`MongoDBDatasource :: connect :: error :: erro ao conectar com o datasource.`, JSON.stringify(err));
        throw err;
      });
  }

  async close() {
    if (!this.connection) {
      return;
    }

    await this.client.close();
  }
}

console.log(MongoDBDatasource.oi)

module.exports = { MongoDBDatasource };