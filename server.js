const express = require('express');
const app = express();

const { CidadeController } = require('./src/controllers/cidade.controller');

const port = process.env.APP_PORT || 3000;

app.get(`${CidadeController.endpoint}/222`, new CidadeController().teste)

app.post('/', (req, res) => {
  res.send('sou o post!');
});

app.listen(port , () => {
  console.log(`App :: rodando em http://localhost:${port}`);
});
