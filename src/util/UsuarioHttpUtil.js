const API_URL = 'http://localhost:3000/usuarios';
import axios from 'axios';

export default {

  async buscartodos(){
    return axios.get(API_URL)
    .then((response) => response.data)
    .catch(e => console.log(e));
  },

  async adicionar(usuario){
    return axios.post(API_URL, usuario)
    .then((response) => response)
    .catch(e => console.log(e));
  },

  async editar(usuario){
    return axios.put(API_URL, usuario)
    .then((response) => response)
    .catch(e => console.log(e));
  }
}