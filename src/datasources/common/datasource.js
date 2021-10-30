class Datasource {
  _connection;

  connect() {
    throw new Error(`${this.constructor.name} :: connect :: método connect não implementado.`);
  }

  close() {
    throw new Error(`${this.constructor.name} :: close :: método close não implementado.`);
  }

  get connection() {
    return this._connection;
  }

}

module.exports = { Datasource };