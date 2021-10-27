const express = require('express');
const app = express();
const port = process.env.APP_PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.APP_PORT , () => {
  console.log(`App :: rodando em http://localhost:${port}`);
});
