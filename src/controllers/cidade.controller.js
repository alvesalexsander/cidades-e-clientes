const { Controller } = require('./common/controller');
const { CidadesRepository } = require('../repositories/');

class CidadeController extends Controller {
  static endpoint = '/cidade';
  #repository = new CidadesRepository();

  routes = [
    this.get(/222/, (req, res) => this.getAll(req, res)),
    this.post(/222/, this.answerPost),
    this.get('/teste', () => this.res.send('testeeee22'))
  ];

  async getAll(req, res) {
    res.send(await this.#repository.collection.find().toArray());
  }

  answerPost(req, res, data) {
    res.send(data.body);
  }
}

module.exports = { CidadeController };