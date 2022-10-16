<template>
  <div>

    <!-- Formulario -->
    <v-card class="my-9 mx-auto" width="50%" v-if="mostrarForm">
      <v-btn
        absolute
        dark
        fab
        right
        top
        small
        color="red"
        @click="mostrarForm = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-container>
        <div class="mb-4">{{ formTitulo }}</div>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Descrição"
                outlined
                hide-details
                v-model="contaAtual.descricao"
              ></v-text-field>
            </v-col>   

            <v-col cols="12" sm="6">
              <v-select
                :items="tipo"
                label="Tipo"
                outlined
                hide-details
                v-model="contaAtual.tipo"
                >
              </v-select>
            </v-col>   

            
          </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Valor"
                  outlined
                  hide-details
                  v-model="contaAtual.valor"
                  type="number"
                ></v-text-field>
              </v-col>   

              <v-col cols="12" sm="6">
                <v-menu
                ref="menuDataDialog"
                v-model="menuDataDialog"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dataFormatada"
                    label="Data"
                    outlined       
                    prepend-icon="mdi-calendar"
                    v-on="on"
                    readonly
                  ></v-text-field>
                </template>

                <v-date-picker 
                v-model="contaAtual.data" 
                no-title 
                @input="formatarDataMenu"
                >
                </v-date-picker>
          </v-menu>
            </v-col>   
          </v-row>


          <v-row>
            <v-col cols="12">
              <v-textarea
                outlined
                label="Observações"
                v-model="contaAtual.observacoes"
              >
              </v-textarea>
            </v-col>
          </v-row>

          <v-card-actions>
            <v-row justify="center">
              <v-btn small color="success" @click="salvar" class="mx-1">Salvar</v-btn>
              <v-btn small color="error" @click="cancelar" class="mx-1">Cancelar</v-btn>
            </v-row>
          </v-card-actions>
      </v-container>
    </v-card>


    <!-- Lista de Contas -->
    <v-data-table
    :headers="cabecalho"
    :items="contas"
    class="elevation-1"
    >

    <template v-slot:top >
      <v-toolbar flat color="white">
        <v-toolbar-title>Contas Cadastrados</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="abrirFormulario" v-if="!mostrarForm">Nova Conta</v-btn>
      </v-toolbar>
    </template>


    <template v-slot:[`item.acoes`]="{ item }"> 
      <v-icon
        small
        class="mr-2"
        @click="detalhes(item)"
      >
        mdi-magnify
      </v-icon>
      <v-icon
        small
        @click="excluir(item)"
      >
        mdi-trash-can
      </v-icon>
    </template>

    <template v-slot:[`item.tipo`]="{ item }"> 
      <div :class="item.tipo === 'Receita' ? 'green--text darken-5' : 'red--text darken-5'">
        {{ item.tipo }}
      </div>
    </template>

    <template v-slot:[`item.valor`]="{ item }"> 
     R$ {{ item.valor.toFixed(2) }}
    </template>

    <template v-slot:[`item.data`]="{ item }"> 
     {{ formatarData(item.data) }}
    </template>

    <template v-slot:no-data>
      <v-row justify="center">
        <v-subheader>Nenhuma conta cadastrada</v-subheader>
      </v-row>
    </template>


    <template v-slot:[`body.append`]>
      <v-toolbar flat color="white">
        <v-toolbar-title>Balanço: </v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
          <v-card
          flat
          :class="balancoGeral >= 0 ? 'green--text darken-5' : 'red--text darken-5'"
          >
            R$ {{ balancoGeral.toFixed(2) }}
          </v-card>
      </v-toolbar>
    </template>
    </v-data-table>

    <!-- Janela Confirmação -->
    <v-dialog
    v-model="confirmaExclusaoDialog"
    max-width="290"
    persistent
    >
    <v-card>
      <v-card-title class="headline black--text">
        Tem Certeza que deseja excluir esta conta?
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="confirmarExclusao">Sim</v-btn>
        <v-btn color="" text @click="cancelarExclusao">Não</v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>


    <!-- Janela de detalhes -->
    <v-dialog
    v-model="detalhesDialog"
    max-width="500"
    >
    <v-card>
      <v-card-title class="headline black--text">
        Detalhes da Conta
      </v-card-title>

      <v-card-text>
        <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Descrição"
                outlined
                hide-details
                :value="contaAtualDetalhe.descricao"
                readonly
                disabled
              ></v-text-field>
            </v-col>   

            <v-col cols="12" sm="6">
              <v-select
                :items="tipo"
                label="Tipo"
                outlined
                hide-details
                :value="contaAtualDetalhe.tipo"
                readonly
                disabled
                >
              </v-select>
            </v-col>   

          </v-row>
          
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Valor"
                outlined
                hide-details
                :value="contaAtualDetalhe.valor.toFixed(2)"
                type="number"
                readonly
                disabled
              ></v-text-field>
            </v-col>   

            <v-col cols="12" sm="6">
              <v-text-field
                label="Data"
                outlined
                hide-details
                :value="formatarData(contaAtualDetalhe.data)"
                readonly
                disabled
              ></v-text-field>
            </v-col>        

          </v-row>

          <v-row>
            <v-col cols="12">
              <v-textarea
                outlined
                label="Observações"
                :value="contaAtualDetalhe.observacoes"
                readonly
                disabled
              >
              </v-textarea>
            </v-col>
          </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="detalhesDialog = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DateFormatterUtil from '@/util/DateFormatterUtil'
import ContaHttpUtil from '../util/ContaHttpUtil'

export default {
  data: () => ({
    mostrarForm: false,
    confirmaExclusaoDialog: false,
    detalhesDialog: false,
    menuDataDialog: false,
    dataFormatada: '',
    contaAtualDetalhe: {
      valor: 0,
      data: "",
    },
    contaExcluir: null,
    balancoGeral: 0,
    formTitulo: 'Nova Conta',
    contaAtual: {},
    tipo: ["Receita", "Despesa"],
    cabecalho: [
      {
        text: 'Descrição',
        value: 'descricao'
      },
      {
        text: 'Tipo',
        value: 'tipo'
      },
      {
        text: 'Valor',
        value: 'valor'
      },
      {
        text: 'Data',
        value: 'data'
      },
      {
        text: 'Ações',
        value: 'acoes',
        sortable: false,
      }
    ],
    contas: [],
  }),

  created () {
      this.initialize()
    },

  methods:{
    initialize () {
      ContaHttpUtil.buscartodos().then((contas) => {
        this.contas = contas;
        this.calcularBalanco();
      })
      
    },

    salvar(){
      let newConta = {}
      Object.assign(newConta, this.contaAtual);
      newConta.valor = parseFloat(newConta.valor);

      ContaHttpUtil.adicionar(newConta).then((res) => {
        if(res.status == 200){
          // alert("Conta adicionado com sucesso!");
          this.initialize();
          this.cancelar();
        }
        else{
          alert('Erro ao adicionar conta!');
        }
      })     
    },

    cancelar(){
      this.mostrarForm = false;
      this.contaAtual = {};
      this.contaExcluir = null;
    },

    abrirFormulario(){
      this.mostrarForm = true;  
    },

    detalhes(conta){
      this.detalhesDialog = true;
      this.contaAtualDetalhe = conta;
    },

    excluir(conta){
      this.confirmaExclusaoDialog = true;
      this.contaExcluir = conta;
    },

    confirmarExclusao(){
      ContaHttpUtil.deletar(this.contaExcluir).then((res) => {
        if(res.status == 200){
          alert("Conta excluida com sucesso")
          this.initialize();
        }
        else{
          alert("Erro ao excluir conta")
        }
      })
      
      this.confirmaExclusaoDialog = false;

    },

    cancelarExclusao(){
     // this.contaExcluir = null;
      this.confirmaExclusaoDialog = false;
      this.cancelar();
    },

    calcularBalanco(){
    this.balancoGeral = 0;

    this.contas.forEach(conta => {
        if(conta.tipo === 'Receita')
          this.balancoGeral += conta.valor;
        else
          this.balancoGeral -= conta.valor;
      });
    },

    formatarDataMenu(){
      this.dataFormatada = DateFormatterUtil.ISOtoBR(this.contaAtual.data);
      this.menuDataDialog = false;
    },

    formatarData(data){
      return DateFormatterUtil.ISOtoBR(data);
    }
    
  }
}
</script>

<style scoped>

</style>