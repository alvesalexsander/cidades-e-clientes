const { CidadesRepository } = require('../repositories/');
const { Cidade } = require('../models/cidade.model');
const formatters = require('../utils/formatters');
const { Estado } = require('../enums/estado.enum');

const cidadeController = require('express').Router();

const repository = new CidadesRepository();

cidadeController.get(`/cidade`, (req, res, next) => {
  const nome = req.query.nome;
  if (nome) {
    return getCidadeByNome(req, res);
  }
  
  const estado = req.query.estado;
  if (estado) {
    return getCidadeByEstado(req, res);
  }

  next();
});

cidadeController.post('/cidade/cadastrar', (req, res) => {
  const nome = req.body.nome;
  const estado = req.body.estado;

  if (nome && estado) {
    return createCidade(req, res);
  }
  return res.status(404).send({ errorMessage: 'Falha ao cadastrar a cidade. O body da requisição está incompleto.' });
});

async function getCidadeByNome(req, res) {
  try {
    const validNome = formatters.validatedCidadeNome(req.query.nome);
    if (!validNome) {
      return res.status(400).send({ errorMessage: "Requisição inválida no parâmetro 'nome'." });
    }

    res.status(200).send(await repository.getCollection().find({
      nome: validNome
    }).toArray());
  } catch (error) {
    console.log(error);
    res.status(500).send({ errorMessage: 'Occoreu um erro e não será possível prosseguir com a operação' });
  }
}

async function getCidadeByEstado(req, res) {
  try {
    const validEstado = Estado[formatters.validatedEstado(req.query.estado)];
    if (!validEstado) {
      return res.status(400).send({ errorMessage: "Requisição inválida no parâmetro 'estado'." });
    }

    res.status(200).send(await repository.getCollection().find({
      estado: validEstado
    }).toArray());
  } catch (error) {
    res.status(500).send({ errorMessage: 'Occoreu um erro e não será possível prosseguir com a operação' });
  }
}

async function createCidade(req, res) {
  try {
    const validNome = formatters.validatedCidadeNome(req.body.nome);
    if (!validNome) {
      return res.status(400).send({ errorMessage: "Falha ao cadastrar a cidade. O campo 'nome' não é válido." });
    }

    const validEstado = formatters.validatedEstado(req.body.estado);
    if (!validEstado) {
      return res.status(400).send({ errorMessage: "Falha ao cadastrar a cidade. O campo 'estado' não é válido." });
    }

    const entity = new Cidade();
    entity.nome = validNome.charAt(0).toUpperCase() + validNome.slice(1);
    entity.estado = validEstado;
    await repository.create(entity);
    res.status(200).send({ message: 'Cidade cadastrada com sucesso.' });
  } catch (error) {
    if (/duplicate key/.test(error.message)) {
      return res.status(400).send({ errorMessage: 'Erro ao cadastrar a cidade. Cidade já cadastrada.' });
    }
    console.log(error);
    res.status(500).send({ errorMessage: 'Occoreu um erro e não será possível prosseguir com a operação' });
  }
}

module.exports = { cidadeController };