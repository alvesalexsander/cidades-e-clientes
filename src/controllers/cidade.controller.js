const { Controller } = require('./common/controller');
const { CidadesRepository } = require('../repositories/');
const { Cidade } = require('../models/cidade.model');

class CidadeController extends Controller {
  static endpoint = '/cidade';
  #repository = new CidadesRepository();

  routes = [
    this.get(/\/consulta\/(\w.[^\/|\?]*)/, (req, res) => this.getCidade(req, res)),
    this.post('cadastrar', (req, res, data) => this.createCidade(req, res, data)),
  ];

  async getCidade(req, res) {
    let match = req.url.match(/\/consulta\/(\w.[^\/|\?]*)/)?.[1];
    match = match.replace(/_/gm, ' ');
    res.send(await this.#repository.getCollection().find({ nome: decodeURIComponent(match) }).toArray());
  }

  async createCidade(req, res, data) {
    const entity = new Cidade();
    entity.nome = data.body.nome;
    entity.estado = data.body.estado;
    try {
      await this.#repository.create(entity);
      res.status(200).send();
    } catch(error) {
      res.status(400).send(error.message);
    }
  }

  answerPost(req, res, data) {
    res.send(data.body);
  }
}

module.exports = { CidadeController };