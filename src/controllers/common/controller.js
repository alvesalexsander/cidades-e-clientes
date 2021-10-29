class Controller {
  static endpoint;
  routes = [];

  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  handle() {
    for (const handler of this.routes) {
      if (!this.req.url.match(handler.path)) {
        continue;
      }
      
      const fn = handler[this.req.method.toUpperCase()];
      if (fn) {
        fn(this.req, this.res, {
          body: this.req.body,
          query: this.req.query
        });
        return;
      }
    }
    this.res.status(404).send();
  }

  get(path, cb) {
    return {
      path: path,
      GET: cb
    }
  }

  post(path, cb) {
    return {
      path: path,
      POST: cb
    }
  }

  delete(path, cb) {
    return {
      path: path,
      DELETE: cb
    }
  }

  patch(path, cb) {
    return {
      path: path,
      PATCH: cb
    }
  }

  put(path, cb) {
    return {
      path: path,
      PUT: cb
    }
  }
}

module.exports = { Controller };