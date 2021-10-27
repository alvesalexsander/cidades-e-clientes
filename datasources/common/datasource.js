class Datasource {
  connection;
  connectionUrl;

  connect() {
    throw new Error(`${this.constructor.name} :: connect :: método connect não implementado.`);
  }

  close() {
    throw new Error(`${this.constructor.name} :: close :: método close não implementado.`);
  }
}

module.exports = { Datasource };