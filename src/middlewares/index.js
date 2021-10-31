const { jwtMiddleware } = require('./jwt.middleware');
const { controllerRoutes } = require('./controller-routes.middleware');

module.exports = {
  jwtMiddleware,
  controllerRoutes
};