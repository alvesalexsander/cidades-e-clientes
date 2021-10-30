const express = require('express');
const { controllerMiddleware } = require(`./src/controllers/common`);

const app = express();

const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(controllerMiddleware);

app.get(/.*/, (req, res) => res.send('qqlr coisa'));

app.listen(port , () => {
  console.log(`App :: rodando em http://localhost:${port}`);
});
