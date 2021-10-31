const { ClientesRepository, CidadesRepository } = require('../repositories');
const { Cliente } = require('../models/cliente.model');
const formatters = require('../utils/formatters');
const { Sexo } = require('../enums/sexo.enum');

const { ObjectId } = require('mongodb');
const { DateTime } = require('luxon');

const clienteRepository = new ClientesRepository();
const cidadeRepository = new CidadesRepository();

const clientController = require('express').Router();

clientController.post('/cliente/cadastrar', (req, res) => {
  const nomeCompleto = req.body.nomeCompleto;
  const sexo = req.body.sexo;
  const dataNascimento = req.body.dataNascimento;
  const cidade = req.body.cidade;
  const estado = req.body.estado;

  if (nomeCompleto && sexo && dataNascimento && cidade && estado) {
    return registerCliente(req, res);
  }
  return res.status(404).send({ errorMessage: 'Falha ao cadastrar o cliente. O body da requisição está incompleto.' });
});

clientController.get('/cliente', (req, res, next) => {
  const nome = req.query.nome;
  const id = req.query.id;

  if (nome && id) {
    return res.status(400).send({ errorMessage: 'Requisição inválida. Consulte as cidades pelo nome OU pelo id, não ambos.' });
  }

  if (nome) {
    return getClienteByNomeCompleto(req, res);
  }

  if (id) {
    return getClienteById(req, res);
  }
  next();
});

clientController.delete('/cliente', (req, res, next) => {
  const id = req.query.id;
  if (id) {
    return removeCliente(req, res);
  }
  next();
});

clientController.put('/cliente', (req, res, next) => {
  const id = req.query.id;
  const novo_nome_completo = req.query.novo_nome_completo;
  if (id && novo_nome_completo) {
    return renameCliente(req, res);
  }
  next();
});

async function registerCliente(req, res) {
  try {
    const cidade = formatters.validatedCidadeNome(req.body.cidade);
    const estado = formatters.validatedEstado(req.body.estado);

    if (!cidade) { return res.status(400).send("Falha ao cadastrar a cidade. O campo 'cidade' não é válido.") }
    if (!estado) { return res.status(400).send("Falha ao cadastrar a cidade. O campo 'estado' não é válido.") }

    const cidadeDoc = await cidadeRepository.findOne({
      nome: { $regex: new RegExp(cidade, 'i') },
      estado: { $regex: new RegExp(estado, 'i') }
    });
    if (!cidadeDoc) {
      return res.status(404).send({
        message: `Falha ao cadastrar o cliente. Motivo: Cidade não encontrada.
        Possíveis causas: 
        1. Erro de ortografia. Verifique se o nome da cidade e a sigla do estado estão corretas.
        2. Cidade ${cidade} não cadastrada no estado ${estado}.`
      });
    }

    const nomeCompleto = formatters.validatedClienteNome(req.body.nomeCompleto);
    const sexo = formatters.validatedSexo(req.body.sexo);
    const dataNascimento = formatters.validatedDataNascimento(req.body.dataNascimento);
    
    if (!nomeCompleto) { return res.status(400).send("Falha ao cadastrar a cidade. O campo 'nomeCompleto' não é válido.") }
    if (!sexo) { return res.status(400).send("Falha ao cadastrar a cidade. O campo 'sexo' não é válido.") }
    if (!dataNascimento) { return res.status(400).send("Falha ao cadastrar a cidade. O campo 'dataNascimento' não é válido.") }

    const entity = new Cliente();
    entity.nomeCompleto = nomeCompleto;
    entity.sexo = Sexo[sexo];
    entity.setDataNascimento(DateTime.fromFormat(dataNascimento, 'dd/LL/yyyy').toJSDate());
    entity.cidade = cidadeDoc._id;

    await clienteRepository.create(entity);
    res.status(200).send({ message: `Cliente ${entity.nomeCompleto} cadastrado(a) com suceso` });
  } catch (error) {
    console.log(`aqui`, error);
    res.status(500).send({ errorMessage: 'Occoreu um erro e não será possível prosseguir com a operação' });
  }
}

async function getClienteByNomeCompleto(req, res) {
  try {
    const match = formatters.validatedClienteNome(req.query.nome);
    if (!match) {
      return res.status(400).send({ errorMessage: "Requisição inválida no parâmetro 'nome'." });
    }

    res.status(200).send(await clienteRepository.getCollection().find({
      nomeCompleto: {
        $regex: new RegExp(match, 'i')
      }
    }).limit(100).toArray());
  } catch (error) {
    console.log(error);
    res.status(500).send({ errorMessage: 'Occoreu um erro e não será possível prosseguir com a operação' });
  }
}

async function getClienteById(req, res) {
  const id = formatters.validatedId(req.query.id);
  try {
    if (!id) {
      res.status(400).send({ errorMessage: "Requisição inválida no parâmetro 'id'." });
      return;
    }

    const result = await clienteRepository.findOne({
      _id: new ObjectId(id)
    });
    if (!result) {
      res.status(404).send({ errorMessage: 'Cliente não encontrado(a)' });
      return;
    }

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ errorMessage: 'Occoreu um erro e não será possível prosseguir com a operação' });
  }
}

async function removeCliente(req, res) {
  try {
    const id = formatters.validatedId(req.query.id);
    if (!id) { return res.status(400).send({ errorMessage: "Requisição inválida no parâmetro 'id'." }); }

    const result = await clienteRepository.deleteOne({
      _id: new ObjectId(id)
    });

    res.status(result.code).send({ message: result.message });
  } catch (error) {
    console.log(error);
    res.status(500).send({ errorMessage: 'Occoreu um erro e não será possível prosseguir com a operação' });
  }
}

async function renameCliente(req, res) {
  try {
    const id = formatters.validatedId(req.query.id);
    if (!id) {
      return res.status(400).send({ errorMessage: "Requisição inválida no parâmetro 'id'." });
    }

    const novo_nome_completo = formatters.validatedClienteNome(req.query.novo_nome_completo);
    if (!novo_nome_completo) {
      return res.status(400).send({ errorMessage: "Requisição inválida no parâmetro 'novo_nome_completo'." });
    }

    const result = await clienteRepository.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: { nomeCompleto: novo_nome_completo }
    });

    res.status(result.code).send({ message: result.message });
  } catch (error) {
    console.log(error);
    res.status(500).send({ errorMessage: 'Occoreu um erro e não será possível prosseguir com a operação' });
  }
}


module.exports = { clientController };