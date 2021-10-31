const { CidadesRepository } = require('../repositories/');
const { Cidade } = require('../models/cidade.model');
const { Estado } = require('../enums/estado.enum');

const cidadeController = require('express').Router();

const repository = new CidadesRepository();

cidadeController.get(`/cidade`, (req, res, next) => {
  const nome = req.query.nome;
  const estado = req.query.estado;
  if (nome) {
    return getCidadeByNome(req, res);
  }
  if (estado) {
    return getCidadeByEstado(req, res);
  }
  next();
});

cidadeController.post('/cidade/cadastrar', (req, res) => createCidade(req, res));


async function getCidadeByNome(req, res) {
  const nome = req.query.nome;
  const match = nome?.replace(/_/gm, ' ');
  if (!match) {
    res.status(400).send('Requisição inválida no parâmetro "nome".');
  }

  res.status(200).send(await repository.getCollection().find({
    nome: match
  }).toArray());
}

async function getCidadeByEstado(req, res) {
  const estado = req.query.estado;
  const match = estado.replace(/_/gm, ' ');
  if (!match) {
    res.status(400).send('Requisição inválida no parâmetro "estado".');
  }

  res.status(200).send(await repository.getCollection().find({
    estado: Estado[match]
  }).toArray());
}

async function createCidade(req, res) {
  const nome = req.body.nome;
  const estado = req.body.estado;

  const entity = new Cidade();
  entity.nome = nome.charAt(0).toUpperCase() + nome.slice(1);
  entity.estado = Estado[estado];
  try {
    await repository.create(entity);
    res.status(200).send('Cidade cadastrada com sucesso.');
  } catch (error) {
    res.status(400).send(`Erro ao cadastrar a cidade :: ${error.message}`);
  }
}

module.exports = { cidadeController };