const { Controller } = require('./common/controller');

class CidadeController extends Controller {
  static endpoint = '/cidade';

  routes = [
    this.get(/222/, this.answerGet),
    this.post(/222/, this.answerPost),
    this.get('/teste', () => this.res.send('testeeee22'))
  ];

  answerGet(req, res) {
    res.send(`foii get`);
  }

  answerPost(req, res, data) {
    res.send(data.body);
  }
}

module.exports = { CidadeController };