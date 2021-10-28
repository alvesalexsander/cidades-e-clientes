const express = require('express');
const app = express();

const { CidadeController } = require('./src/controllers/cidade.controller');

const port = process.env.APP_PORT || 3000;

app.use((req, res, next) => {
  console.log('oi')
  next('oi');
}, (req, res, next) => {
  console.log('oi denovo');
  next();
});

app.get(CidadeController.endpoint, (req, res) => new CidadeController(req, res).handle());

app.listen(port , () => {
  console.log(`App :: rodando em http://localhost:${port}`);
});
