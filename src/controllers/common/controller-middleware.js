const controllers = require('../index');

const controllerCatalog = {};

for (const controller of Object.values(controllers)) {
  controllerCatalog[controller.endpoint] = controller;
}

function controllerMiddleware(req, res, next) {
  const endpoint = req.url.match(/(\/\w*)/gm)[0];
  const handlerController = controllerCatalog[endpoint];
  if (!handlerController) {
    next();
  }
  new handlerController().handle(req, res);
}

module.exports = { controllerMiddleware };