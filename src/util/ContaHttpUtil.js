//const API_URL = 'http://localhost:3000/contas';
const API_URL = 'https://contascontrole-api.herokuapp.com/contas';
import axios from 'axios';

export default {

  async buscartodos(){
    return axios.get(API_URL)
    .then((response) => response.data)
    .catch(e => console.log(e));
  },

  async adicionar(conta){
    return axios.post(API_URL, conta)
    .then((response) => response)
    .catch(e => console.log(e));
  },

  async deletar(conta){
    return axios.delete(API_URL + `/${conta._id}`)
    .then((response) => response)
    .catch(e => console.log(e));
  }
}