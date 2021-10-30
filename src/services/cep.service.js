const axios = require('axios');

class CEPService {
  consulta(cep) {
    return axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  }
}

module.exports = { CEPService };