function route(method, route, handler, controller) {
  controller.router[method](route, handler);
}

module.exports = { route };