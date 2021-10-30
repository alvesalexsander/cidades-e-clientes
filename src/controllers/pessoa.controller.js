const { Controller } = require('./common/controller');
const { PessoasRepository } = require('../repositories/');

class PessoaController extends Controller {
  static endpoint = '/cidade';
  #repository = new PessoasRepository();

  routes = [];

}

module.exports = { PessoaController };