const { controllerFactory } = require('./controller-factory');

function controllerMiddleware(req, res, next) {
  const target = req.url.match(/(\/\w*)/gm)[0];
  const handlerController = controllerFactory(target)
  if (handlerController) {
    new handlerController(req, res).handle();
    return;
  }
  console.log(`calling next`)
  next();
}


module.exports = { controllerMiddleware };