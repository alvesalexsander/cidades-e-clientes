class Repository {
  datasource;
  model;

  constructor(datasourceInstance) {
    this.datasource = datasourceInstance;
  }

}

module.exports = { Repository };