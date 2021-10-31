class Controller {
  static endpoint;
  routes = [];

  handle(req, res, next) {
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
        }, next);
        return;
      }
    }
    res.status(404).send();
  }

  get(path, cb) {
    return { path, method: 'get', GET: cb}
  }

  post(path, cb) {
    return { path, method: 'post', POST: cb}
  }

  delete(path, cb) {
    return { path, method: 'delete', DELETE: cb }
  }

  patch(path, cb) {
    return { path, method: 'patch', PATCH: cb }
  }

  put(path, cb) {
    return { path, method: 'put', PUT: cb }
  }
}

module.exports = { Controller };