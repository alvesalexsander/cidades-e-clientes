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
          query: req.query
        });
        return;
      }
    }
    res.status(404).send();
  }

  get(path, cb) {
    return { path: path, GET: cb }
  }

  post(path, cb) {
    return { path: path, POST: cb }
  }

  delete(path, cb) {
    return { path: path, DELETE: cb }
  }

  patch(path, cb) {
    return { path: path, PATCH: cb }
  }

  put(path, cb) {
    return { path: path, PUT: cb }
  }
}

module.exports = { Controller };