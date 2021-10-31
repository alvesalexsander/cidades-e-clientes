const { jwtMiddleware } = require(`./src/middlewares/`);

const controllerRouter = require('./src/middlewares/controller-router.middleware');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')

const app = express();

const port = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

/* app.use(jwtMiddleware); */

app.use(controllerRouter);

app.use((req, res) => res.status(404).send('Operação não suportada'));
app.listen(port , () => {
  console.log(`
  App :: rodando em http://localhost:${port}
  Swagger UI :: disponível em http://localhost:${port}/doc.
  `);
});