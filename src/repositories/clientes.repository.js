const { MongoRepository } = require('./common/mongo.repository');

const { Cliente } = require('../models/cliente.model');

class ClientesRepository extends MongoRepository {

  constructor() {
    super(Cliente);
  }

}

module.exports = { ClientesRepository };