const { ClientesRepository, CidadesRepository } = require('../repositories');
const { Cliente } = require('../models/cliente.model');
const { Sexo } = require('../enums/sexo.enum');

const { ObjectId } = require('mongodb');
const { DateTime } = require('luxon');

const clientController = require('express').Router();

const clienteRepository = new ClientesRepository();
const cidadeRepository = new CidadesRepository();

clientController.post('/cliente/cadastrar', (req, res) => registerCliente(req, res));

clientController.get('/cliente', (req, res, next) => {
  const nome = req.query.nome;
  const id = req.query.id;
  if (nome?.match(/([a-z_A-ZÀ-ž]{1,200}|[%\w{2}]{1,200}$)/)) {
    return getClienteByNomeCompleto(req, res);
  }
  if (id?.match(/([\w]{24}$)/)) {
    return getClienteById(req, res);
  }
  next();
});

clientController.delete('/cliente', (req, res, next) => {
  const id = req.query.id;
  if (id?.match(/([\w]{24}$)/)) {
    return removeCliente(req, res);
  }
  next();
});

clientController.put('/cliente', (req, res, next) => {
  const id = req.query.id;
  if (id?.match(/([\w]{24}$)/) && req.query?.novo_nome_completo?.match(/([a-z_A-ZÀ-ž]{1,200}|[%\w{2}]{1,200}$)/)) {
    return renameCliente(req, res);
  }
  next();
});

async function registerCliente(req, res) {
  const cidade = req.body.cidade;
  const estado = req.body.estado;

  const cidadeDoc = await cidadeRepository.findOne({
    nome: { $regex: new RegExp(cidade, 'i') },
    estado: { $regex: new RegExp(estado, 'i') }
  });
  if (!cidadeDoc) {
    res.status(404).send(`Falha ao cadastrar o cliente. Motivo: Cidade não encontrada.
        Possíveis causas: 
        1. Erro de ortografia. Verifique se o nome da cidade e a sigla do estado estão corretas.
        2. Cidade ${cidade} não cadastrada no estado ${estado}.`);
    return;
  }

  const nomeCompleto = req.body.nomeCompleto;
  const sexo = req.body.sexo;
  const dataNascimento = req.body.dataNascimento;

  const entity = new Cliente();
  entity.nomeCompleto = nomeCompleto;
  entity.sexo = Sexo[sexo];
  entity.setDataNascimento(DateTime.fromFormat(dataNascimento, 'dd/LL/yyyy').toJSDate());
  entity.cidade = cidadeDoc._id;

  try {
    await clienteRepository.create(entity);
    res.status(200).send(`Cliente ${entity.nomeCompleto} cadastrado(a) com suceso`);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

async function getClienteByNomeCompleto(req, res) {
  const nome = req.query.nome;
  try {
    const match = nome.replace(/_/gm, ' ');
    if (!match) {
      res.status(400).send('Requisição inválida no parâmetro "nome".');
    }

    res.status(200).send(await clienteRepository.getCollection().find({
      nomeCompleto: {
        $regex: new RegExp(match, 'i')
      }
    }).limit(100).toArray());
  } catch (error) {
    res.status(400).send(error.message);
  }
}

async function getClienteById(req, res) {
  const id = req.query.id;
  try {
    if (!id) {
      res.status(400).send('Requisição inválida no parâmetro "id".');
      return;
    }

    const result = await clienteRepository.findOne({
      _id: new ObjectId(id)
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

async function removeCliente(req, res) {
  const id = req.query.id;
  try {
    if (!id) {
      res.status(400).send('Requisição inválida no parâmetro "id".');
      return;
    }

    const existingCliente = await clienteRepository.findOne({
      _id: new ObjectId(id)
    });
    if (!existingCliente) {
      res.status(404).send('Cliente não encontrado(a)');
      return;
    }

    const result = await clienteRepository.deleteOne({
      _id: new ObjectId(id)
    });

    res.status(result.code).send(result.message);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

async function renameCliente(req, res) {
  const id = req.query.id;
  const novo_nome_completo = req.query.novo_nome_completo;
  try {
    if (!id) {
      res.status(400).send('Requisição inválida no parâmetro "id".');
    }

    if (!novo_nome_completo) {
      res.status(400).send('Requisição inválida no parâmetro "novo_nome_completo".');
    }

    const result = await clienteRepository.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: { nomeCompleto: novo_nome_completo }
    });

    res.status(result.code).send(result.message);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = { clientController };