/* eslint-disable */
<template>
  <div>

  <v-card class="my-8 mx-auto" width="50%" v-if="mostrarForm">
    <v-btn
      small
      absolute
      dark
      fab
      top
      right
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
            label="Nome"
            outlined
            v-model="usuarioAtual.nome"
          ></v-text-field>
        </v-col>   

        <v-col cols="12" sm="6">
          <v-text-field
            label="E-mail"
            outlined
            v-model="usuarioAtual.email"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            label="Username"
            outlined
            v-model="usuarioAtual.username"           
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            label="Senha"
            outlined
            type="password"
            v-model="usuarioAtual.senha"
          ></v-text-field>
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

    <v-data-table
    :headers="cabecalho"
    :items="usuarios"
    class="elevation-1"
  >

    <template v-slot:top >
      <v-toolbar flat color="white">
        <v-toolbar-title>Usuários Cadastrados</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="abrirFormulario" v-if="!mostrarForm">Novo Usuário</v-btn>
      </v-toolbar>
    </template>


    <template v-slot:[`item.acoes`]="{ item }"> 
      <v-icon
        small
        class="mr-2"
        @click="editar(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="ativarInativar(item)"
      >
        {{ item.ativo ? 'mdi-cancel' : 'mdi-check-bold'}}
      </v-icon>
    </template>


    <template v-slot:no-data>
      <v-subheader>Nenhum usuário cadastrado</v-subheader>
    </template>

  </v-data-table>
  </div>
</template>

<script>
import UsuarioHttpUtil from '../util/UsuarioHttpUtil'

  export default {
    data: () => ({
      itemEdicao: null,
      usuarioAtual: {},
      mostrarForm: false,
      usuarios: [],
      cabecalho: [
        {
          text: 'Name',
          value: 'nome'
        },
        {
          text: 'Username',
          value: 'username'
        },
        {
          text: 'E-mail',
          value: 'email'
        },{
          text: 'Ações',
          value: 'acoes',
          sortable: false,
        }
      ]
    }),

    computed: {
      formTitulo () {
        return this.itemEdicao == null ? 'Novo usuário' : 'Editar Usuário';
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        UsuarioHttpUtil.buscartodos()
          .then((usuarios) => {
            this.usuarios = usuarios;
          })
      },

      abrirFormulario() {
        this.mostrarForm = true;
      },

      ativarInativar(usuario){
        if(window.confirm("Tem certeza que deseja mudar o status deste usuário?")){         
          usuario.ativo = !usuario.ativo;
          UsuarioHttpUtil.editar(usuario).then((res) => {
            if(res.status == 200){
              alert("Status do usuário alterado!")
            }
            else{
              alert("Erro ao alterar status do usuário")
            }
          })
        }
      },

      salvar(){
          if(this.itemEdicao == null){ //add
            this.adicionar();
          }
          else{ // edit
            this.salvarEdicao();
          }
        this.mostrarForm = false;
        this.cancelar();
      },

      editar(usuario){
        let userCopy = {}; 
        Object.assign(userCopy, usuario);
        this.itemEdicao = userCopy;
        this.usuarioAtual = userCopy;
        this.mostrarForm = true;
      },

      salvarEdicao(){
        UsuarioHttpUtil.editar(this.itemEdicao).then((res) => {
          if(res.status == 200){
            alert('Usuario editado com sucesso!');
            this.initialize();
          }
          else{
            alert('Erro ao editar usuario!');
          }
        });
      },

      adicionar(){
        let userCopy = {}; 
        Object.assign(userCopy, this.usuarioAtual);
        userCopy.ativo = true;

        UsuarioHttpUtil.adicionar(userCopy).then((res) => {
          if(res.status == 200){
            alert('Usuário Adicionado com sucesso!');
            this.initialize();
          }
          else{
            alert('Erro ao Cadastrar usuário');
          }
        })
      },

      cancelar(){
        this.usuarioAtual = {};
        this.itemEdicao = null;
      }

      
    },
  }
</script>