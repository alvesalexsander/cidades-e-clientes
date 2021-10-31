const { Controller } = require('./common/controller');
const { CidadesRepository } = require('../repositories/');
const { Cidade } = require('../models/cidade.model');
const { Estado } = require('../enums/estado.enum');

class CidadeController extends Controller {
  static endpoint = '/cidade';

  #repository = new CidadesRepository();

  routes = [
    this.get(/\/cidade\/\?nome=([a-z_A-ZÀ-ž%.{2}]{2,100}|[%.{2}]{1,100}$)/, (req, res, data) => this.getCidadeByNome(req, res, data)),
    this.get(/\/cidade\/\?estado=([a-zA-Z]{2}$)/, (req, res, data) => this.getCidadeByEstado(req, res, data)),
    this.post('cadastrar', (req, res, data) => this.createCidade(req, res, data)),
  ];

  async getCidadeByNome(req, res, data) {
    const match = data.query.nome.replace(/_/gm, ' ');
    if (!match) {
      res.status(400).send('Requisição inválida no parâmetro "nome".');
    }
    
    res.status(200).send(await this.#repository.getCollection().find({
      nome: match
    }).toArray());
  }

  async getCidadeByEstado(req, res, data) {
    const match = data.query.estado.replace(/_/gm, ' ');
    if (!match) {
      res.status(400).send('Requisição inválida no parâmetro "estado".');
    }
    
    res.status(200).send(await this.#repository.getCollection().find({
      estado: Estado[match]
    }).toArray());
  }

  async createCidade(req, res, data) {
    const entity = new Cidade();
    entity.nome = data.body.nome.charAt(0).toUpperCase() + data.body.nome.slice(1);
    entity.estado = Estado[data.body.estado];
    try {
      await this.#repository.create(entity);
      res.status(200).send('Cidade cadastrada com sucesso.');
    } catch (error) {
      res.status(400).send(`Erro ao cadastrar a cidade :: ${error.message}`);
    }
  }

}

module.exports = { CidadeController };