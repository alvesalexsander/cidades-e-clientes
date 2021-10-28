const { Controller } = require('./common/controller');

class CidadeController extends Controller {
  static endpoint = /\/cidade.*/;

  routes = [
    { path: /222/, do: (req, res) => res.send(`foiiii`)},
    { path: `teste`, do: (req, res) => res.send(`foiiii2`)},
  ];
}

module.exports = { CidadeController };