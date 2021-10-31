const controllers = require('../controllers/index');
const router = require('express').Router();

function controllerRoutes() {
  for (const controller of Object.values(controllers)) {
    const instance = new controller();
    for (const routeConfig of instance.routes) {
      router[routeConfig.method](routeConfig.path, (req, res, next) => new controller().handle(req, res, next))
    }
  }
  return router;
}

module.exports = { controllerRoutes };