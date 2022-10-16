<template>
  <div>
    <v-container>
      <v-card color="grey" dark>
        <v-card-title>
          Balanço do Ano
        </v-card-title>
      </v-card>
    <v-card
    class="mt-4 mx-auto"
    color="blue"
    >
    <v-sparkline
      :labels="rotulos"
      :value="valores"
      color="white"
      line-width="1"
      padding="20"
      >
    </v-sparkline>
    </v-card>


    <v-card color="green" class="my-4" dark>
      <v-card-title>
          Total Receitas: {{ totalReceitas.toFixed(2) }}
      </v-card-title>
    </v-card>

    <v-card color="red" class="my-4" dark>
      <v-card-title>
        Total Despesas: {{ totalDespesas.toFixed(2) }}
      </v-card-title>
    </v-card>

    </v-container>
  </div>
</template>

<script>
import ContaHttpUtil from '../util/ContaHttpUtil'

  export default {
    data: () => ({
      totalDespesas: 0,
      totalReceitas: 0,
      rotulos: [],
      valores: [],
      contas: [],
      mesAbrev: [
        "Jan", 
        "Fev", 
        "Mar", 
        "Abr", 
        "Mai", 
        "Jun", 
        "Jul", 
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez"
      ]
    }),
    created(){
      this.buscarContas();
    },
    methods:{
      initialize(){
               
        let hoje = new Date().toISOString().slice(0, 10);

        let anoAtual = hoje.slice(0,4);
        let mesAtual = hoje.slice(5, 7);

        this.rotulos = this.mesAbrev.slice(0, parseInt(mesAtual));
        this.valores = new Array(parseInt(mesAtual)).fill(0);

      
        this.contas.forEach((conta) => {
          if(anoAtual === conta.data.slice(0, 4)){
              let mesConta = parseInt(conta.data.slice(5, 7));

              if(conta.tipo === 'Receita'){
                this.valores[mesConta -1] += conta.valor;
              }
              else{
                this.valores[mesConta -1] += conta.valor * -1; //inverte negativo
              }
          }

          if(conta.tipo === 'Receita'){
            this.totalReceitas += conta.valor;
          }
          else{
            this.totalDespesas += conta.valor
          }
        });
      },

      buscarContas(){
          ContaHttpUtil.buscartodos().then(contas => {
          this.contas = contas;
          this.initialize();
        })
      }
    }
  }
</script>
