class Controller {
  static endpoint;
  routes = [];

  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  handle() {
    for (const handler of this.routes) {
      if (this.req.url.match(handler.path)) {
        handler.do(this.req, this.res);
        return;
      }
    }
    this.res.status(404).send();
  }
}

module.exports = { Controller };