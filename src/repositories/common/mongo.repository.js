const { Repository } = require('./repository');
const { mongoDB } = require('../../datasources');

class MongoRepository extends Repository {
  collection;

  constructor(model) {
    super(mongoDB);

    if (!model || !model?.constructor?.name) {
      throw new Error(`${this.constructor.name} :: construction :: invalid model`);
    }

    this.model = model;
    
    this.collection = this.datasource.connection.collection(new this.model().constructor.name);
  }

  create(entity) {
    return this.collection.insertOne(entity);
  }

  async find(query = {}) {
    return this.collection.find(query);
  }

  async findOne(query = {}) {
    return this.collection.findOne(query);
  }

  async update(query = {}, update = {}) {
    if (!Object.keys(update)?.length) {
      throw new Error(`${this.constructor.name} :: update :: missing update data`);
    }

    return this.collection.update(query, update);
  }

  async updateOne(query = {}, update = {}) {
    if (!Object.keys(update)?.length) {
      throw new Error(`${this.constructor.name} :: update :: missing update data`);
    }

    return this.collection.updateOne(query, update);
  }

  async delete(query = {}) {    
    return this.collection.delete(query);
  }

  async deleteOne(query = {}) {
    return this.collection.deleteOne(query);
  }

}

module.exports = { MongoRepository };