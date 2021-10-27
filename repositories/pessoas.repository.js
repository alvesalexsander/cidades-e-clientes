const { MongoRepository } = require('./common/mongo.repository');

const { Pessoa } = require('../models/pessoa.model');

class PessoasRepository extends MongoRepository {

  constructor() {
    super(Pessoa);
  }

}

module.exports = { PessoasRepository };