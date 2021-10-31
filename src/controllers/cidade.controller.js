const { Controller } = require('./common/controller');
const { CidadesRepository } = require('../repositories/');
const { Cidade } = require('../models/cidade.model');
const { Estado } = require('../enums/estado.enum');

class CidadeController extends Controller {
  static endpoint = '/cidade';

  #repository = new CidadesRepository();

  routes = [
    this.get(`/cidade`, (req, res, data, next) => {
      if (data.query?.nome) {
        return this.getCidadeByNome(req, res, data);
      }
      if (data.query?.estado) {
        return this.getCidadeByEstado(req, res, data);
      }
      next();
    }),
    this.post('/cidade/cadastrar', (req, res, data) => this.createCidade(req, res, data)),
  ];

  async getCidadeByNome(req, res, data) {
    const match = data?.query?.nome?.replace(/_/gm, ' ');
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