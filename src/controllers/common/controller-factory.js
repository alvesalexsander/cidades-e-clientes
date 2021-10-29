const controllers = require('../index');

const controllerClasses = {};

for (const controller of Object.values(controllers)) {
  controllerClasses[controller.endpoint] = controller;
}

function controllerFactory(endpoint) {
  const foundClass = controllerClasses[endpoint];
  if (foundClass) {
    return foundClass;
  }
  return null;
}

module.exports = { controllerFactory };