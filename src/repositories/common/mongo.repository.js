const { Repository } = require('./repository');
const { mongoDB } = require('../../datasources');

class MongoRepository extends Repository {
  #collection;
  #model;

  constructor(model) {
    super(mongoDB);

    if (!model || !model?.constructor?.name) {
      throw new Error(`${this.constructor.name} :: construction :: invalid model`);
    }

    this.#model = model;
    this.#collection = this.datasource.connection.collection(new this.#model().constructor.name);
  }

  async create(entity) {
    return this.#collection.insertOne(entity);
  }

  async find(query = {}, projection = {}) {
    return this.#collection.find(query, projection);
  }

  async findOne(query = {}, projection = {}) {
    return this.#collection.findOne(query, projection);
  }

  async update(query = {}, update = {}) {
    if (!Object.keys(update)?.length) {
      throw new Error(`${this.constructor.name} :: update :: missing update data`);
    }

    const result = await this.#collection.update(query, update);
    
    if (result.nModified) {
      return { code: 200, message: `${result.nModified} registro(s) modificado(s) com sucesso.` }
    }

    return { code: 202, message: 'Nenhum registro modificado.' };
  }

  async updateOne(query = {}, update = {}) {
    if (!Object.keys(update)?.length) {
      throw new Error(`${this.constructor.name} :: update :: missing update data`);
    }

    const result = await this.#collection.updateOne(query, update);
    if (!result.acknowledged) {
      throw new Error(`Ocorreu um erro ao tentar executar a operação.`)
    }
    
    if (result.modifiedCount) {
      return { code: 200, message: 'Registro modificado com sucesso.' }
    }

    return { code: 202, message: 'Nenhum registro modificado.' };
  }

  async delete(query = {}) {
    const result = await this.#collection.delete(query);
    if (!result.acknowledged) {
      throw new Error(`Ocorreu um erro ao tentar executar a operação.`)
    }
    
    if (result.deletedCount) {
      return { code: 200, message: `${result.deletedCount} registro(s) removido(s) com sucesso.` }
    }

    return { code: 202, message: 'Nenhum registro removido.' };
  }

  async deleteOne(query = {}) {
    const result = await this.#collection.deleteOne(query);
    if (!result.acknowledged) {
      throw new Error(`Ocorreu um erro ao tentar executar a operação.`)
    }
    
    if (result.deletedCount) {
      return { code: 200, message: 'Registro removido com sucesso.' }
    }

    return { code: 202, message: 'Nenhum registro removido.' };
  }

  getCollection() {
    return this.#collection;
  }

}

module.exports = { MongoRepository };