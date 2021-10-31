const { jwtMiddleware } = require(`./src/middlewares/`);

const controllerRouter = require('./src/middlewares/controller-router.middleware');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const swaggerUi = require('swagger-ui-express')

const app = express();

const port = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

if (process.env.ENV_NAME === 'heroku') {
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(require('./swagger-output-heroku.json')));
} else if (process.env.ENV_NAME === 'local') {
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(require('./swagger-output-local.json')));
}

/* app.use(jwtMiddleware); */

app.use(controllerRouter);

app.use((req, res) => res.status(404).send({ errorMessage: 'Operação não suportada' }));
app.listen(port , () => {
  console.log(`
  App :: rodando em http://localhost:${port}
  Swagger UI :: disponível em http://localhost:${port}/doc.
  `);
});