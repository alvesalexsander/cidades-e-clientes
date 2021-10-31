const { jwtMiddleware } = require('./jwt.middleware');
const { controllerMiddleware } = require('./controller-middleware');

module.exports = {
  jwtMiddleware,
  controllerMiddleware
};