const { Controller } = require('./common/controller');
const { ClientesRepository, CidadesRepository } = require('../repositories');
const { Cliente } = require('../models/cliente.model');
const { Sexo } = require('../enums/sexo.enum');

const { ObjectId } = require('mongodb');
const { DateTime } = require('luxon');

class ClienteController extends Controller {
  static endpoint = '/cliente';

  #clienteRepository = new ClientesRepository();
  #cidadeRepository = new CidadesRepository();

  routes = [
    this.post('/cadastrar', (req, res, data) => this.registerCliente(req, res, data)),

    this.get(/\/cliente\/\?nome=([a-z_A-ZÀ-ž]{2,100}|[%\w{2}]{1,100}$)/,
      (req, res, data) => this.getClienteByNomeCompleto(req, res, data)),

    this.get(/\/cliente\/\?id=([\w]{24}$)/,
      (req, res, data) => this.getClienteById(req, res, data)),

    this.delete(/\/cliente\/\?id=([\w]{24}$)/,
      (req, res, data) => this.removeCliente(req, res, data)),

    this.put(/\/cliente\/\?id=([\w]{24})&novo_nome_completo=([a-z_A-ZÀ-ž]{2,100}|[%\w{2}]{1,100}$)/,
      (req, res, data) => this.renameCliente(req, res, data)),
  ];

  async registerCliente(req, res, data) {
    const cidadeDoc = await this.#cidadeRepository.findOne({
      nome: { $regex: new RegExp(data.body.cidade, 'i') },
      estado: { $regex: new RegExp(data.body.estado, 'i') }
    });
    if (!cidadeDoc) {
      res.status(404).send(`Falha ao cadastrar o cliente. Motivo: Cidade não encontrada.
        Possíveis causas: 
        1. Erro de ortografia. Verifique se o nome da cidade e a sigla do estado estão corretas.
        2. Cidade ${data.body.cidade} não cadastrada no estado ${data.body.estado}.`);
      return;
    }

    const entity = new Cliente();
    entity.nomeCompleto = data.body.nomeCompleto;
    entity.sexo = Sexo[data.body.sexo];
    entity.setDataNascimento(DateTime.fromFormat(data.body.dataNascimento, 'dd/LL/yyyy').toJSDate());
    entity.cidade = cidadeDoc._id;

    try {
      await this.#clienteRepository.create(entity);
      res.status(200).send(`Cliente ${entity.nomeCompleto} cadastrado(a) com suceso`);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  async getClienteByNomeCompleto(req, res, data) {
    try {
      const match = data.query.nome.replace(/_/gm, ' ');
      if (!match) {
        res.status(400).send('Requisição inválida no parâmetro "nome".');
      }

      res.status(200).send(await this.#clienteRepository.getCollection().find({
        nomeCompleto: {
          $regex: new RegExp(match, 'i')
        }
      }).limit(100).toArray());
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  async getClienteById(req, res, data) {
    try {
      if (!data.query.id) {
        res.status(400).send('Requisição inválida no parâmetro "id".');
        return;
      }

      const result = await this.#clienteRepository.findOne({
        _id: new ObjectId(data.query.id)
      });
      if (!result) {
        res.status(404).send('Cliente não encontrado(a)');
        return;
      }

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  async removeCliente(req, res, data) {
    try {
      if (!data.query.id) {
        res.status(400).send('Requisição inválida no parâmetro "id".');
        return;
      }

      const existingCliente = await this.#clienteRepository.findOne({
        _id: new ObjectId(data.query.id)
      });
      if (!existingCliente) {
        res.status(404).send('Cliente não encontrado(a)');
        return;
      }

      const result = await this.#clienteRepository.deleteOne({
        _id: new ObjectId(data.query.id)
      });

      res.status(result.code).send(result.message);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  async renameCliente(req, res, data) {
    try {
      if (!data.query.id) {
        res.status(400).send('Requisição inválida no parâmetro "id".');
      }

      if (!data.query.novo_nome_completo) {
        res.status(400).send('Requisição inválida no parâmetro "novo_nome_completo".');
      }

      const result = await this.#clienteRepository.updateOne({
        _id: new ObjectId(data.query.id)
      }, {
        $set: { nomeCompleto: data.query.novo_nome_completo }
      });

      res.status(result.code).send(result.message);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

}

module.exports = { ClienteController };