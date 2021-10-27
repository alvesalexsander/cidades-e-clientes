const { MongoDBDatasource } = require('./mongo.datasource');

module.exports = {
  mongoDB: new MongoDBDatasource()
};