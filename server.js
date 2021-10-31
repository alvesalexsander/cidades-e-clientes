const { controllerMiddleware, jwtMiddleware } = require(`./src/middlewares/`);

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

const port = process.env.APP_PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));


app.use(jwtMiddleware);
app.use(controllerMiddleware);

app.get(/.*/, (req, res) => res.status(404).send('Not found'));

app.listen(port , () => {
  console.log(`App :: rodando em http://localhost:${port}`);
});
