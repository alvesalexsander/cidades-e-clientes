const { Controller } = require('./common/controller');

class CidadeController extends Controller {
  static endpoint = '/cidade';

  teste(req, res) {
    res.send('eu sou teste');
  }
}

module.exports = { CidadeController };