const { DateTime } = require('luxon');

class Cliente {
  nomeCompleto = '';
  sexo = '';
  dataNascimento = '';
  idade = '';
  cidade = '';

  setDataNascimento(date) {
    this.dataNascimento = date;
    this.idade = parseInt(DateTime.local().diff(DateTime.fromJSDate(date), 'years').years);
  }
}

module.exports = { Cliente };