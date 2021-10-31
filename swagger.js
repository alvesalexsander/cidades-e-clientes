require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

console.log('Swagger :: Gerando documentação atualizada.');

const doc = {
  info: {
    title: 'Cidades e Clientes API',
    description: `
    Desafio de desenvolvimento de uma Web API Rest da Compasso UOL.

    Desenvolvido por: Alexsander Apulinario Martins Alves.`,
  },
  /* securityDefinitions: {
    oAuthSample: {
      type: 'oauth2',
      authorizationUrl: `https://dev-y0wx5b85.auth0.com/authorize?audience=https://dashboard.heroku.com/apps/cidades-e-clientes`,
      flow: 'implicit',
    }
  }, */
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = 'swagger-output.json';
const endpointsFiles = [
  './src/controllers/cidade.controller.js',
  './src/controllers/cliente.controller.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc);

console.log('Swagger :: Documentação gerada.');