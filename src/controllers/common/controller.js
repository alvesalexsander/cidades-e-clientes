class Controller {
  static endpoint;
  routes = [];

  handle(req, res) {
    for (const handler of this.routes) {
      if (!req.url.match(handler.path)) {
        continue;
      }
      
      const handlerFn = handler[req.method.toUpperCase()];
      if (handlerFn) {
        handlerFn(req, res, {
          body: req.body,
          query: req.query,
          route: handler.path
        });
        return;
      }
    }
    res.status(404).send();
  }

  get(path, cb) {
    return { path, GET: cb}
  }

  post(path, cb) {
    return { path, POST: cb}
  }

  delete(path, cb) {
    return { path, DELETE: cb }
  }

  patch(path, cb) {
    return { path, PATCH: cb }
  }

  put(path, cb) {
    return { path, PUT: cb }
  }
}

module.exports = { Controller };