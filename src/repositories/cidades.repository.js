const { MongoRepository } = require('./common/mongo.repository');

const { Cidade } = require('../models/cidade.model');

class CidadesRepository extends MongoRepository {

  constructor() {
    super(Cidade);
  }

}

module.exports = { CidadesRepository };