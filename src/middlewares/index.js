const { jwtMiddleware } = require('./jwt.middleware');
const controllerRouter = require('./controller-router.middleware');

module.exports = {
  jwtMiddleware,
  controllerRouter
};