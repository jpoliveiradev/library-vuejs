<template>
  <div class="app">
    <div class="d-flex flex-column align-center">
      <tbody>
        <v-card elevation="3" style="border: 1px solid #004d40">
          <v-card-title>
            <h3>Alugueis |</h3>
            <v-dialog v-model="dialog" persistent max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <!-- <v-btn color="" dark class="novo mb-2" v-bind="attrs" v-on="on" rounded> Novo <span>+</span> </v-btn> -->
                <v-btn slot="activator" @click="titleModal = 'Cadastrar Cliente'" class="novo mb-2" v-bind="attrs" v-on="on" color="#004D40" dark rounded> Novo <span>+</span> </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5 font-weight-bold"> {{ titleModal }} </span>
                </v-card-title>
                <v-card-text>
                  <v-form class="px-2" ref="form" lazy-validation>
                    <v-text-field :rules="[rules.required, rules.maxValue, rules.minValue]" label="Nome do Livro" color="#004D40" v-model="aluguel.livroId" append-icon="mdi-account"></v-text-field>
                    <v-text-field :rules="[rules.required, rules.maxValue, rules.minValue]" label="Nome do Cliente" color="#004D40" v-model="aluguel.clienteId" append-icon="mdi-home-city" required></v-text-field>
                    <v-text-field :rules="[rules.required, rules.maxValue, rules.minValue]" label="Data do Aluguel" color="#004D40" v-model="aluguel.dataAluguel" append-icon="mdi-city" required></v-text-field>
                    <v-text-field :rules="[rules.required, rules.email]" label="Data Previsão Devolução" color="#004D40" v-model="aluguel.dataPrevisao" append-icon="mdi-email" required></v-text-field>
                  </v-form>
                </v-card-text>
                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" text @click="close"> Fechar </v-btn>
                  <v-btn color="004D40" text> Salvar </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-spacer></v-spacer>
            <v-text-field color="#004D40" v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
          </v-card-title>
          <v-data-table
            class="elevation-1"
            :headers="headers"
            :items="alugueis"
            :items-per-page="5"
            :footer-props="{
              itemsPerPageOptions: [5, 10, 25, 50],
              itemsPerPageText: 'Linhas por página',
            }"
            :search="search"
            loading="items"
            loading-text="Carregando dados... Aguarde!"
            no-results-text="Nenhum cliente encontrado"
          >
          <template v-slot:[`item.acoes`]="{ item }">
              <v-tooltip top color="#004D40">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" elevation="1" fab x-small color="#004D40" dark @click="showEdit(item)">
                    <v-icon> mdi-pencil </v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
              <v-tooltip top color="red">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" class="mx-2" elevation="1" fab x-small color="error" @click="remover(item)">
                    <v-icon> mdi-delete </v-icon>
                  </v-btn>
                </template>
                <span>Deletar</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </tbody>
    </div>

    <!-- </v-dialog> -->
  </div>
</template>

<script>
import Aluguel from "../services/alugueis";

export default {
  name: "alugueis",
  data: () => {
    return {
      search: "",
      rules: {
        required: (value) => !!value || "Este campo é obrigatório.",
        maxValue: (value) => (value && value.length <= 50) || "Máximo 50 caracteres",
        minValue: (value) => (value && value.length >= 3) || "Mínimo 3 caracteres",
        email: (value) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || "Email Inválido.",
      },
      headers: [
        { text: "Id", value: "id", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Livro", value: "livro.nomeLivro", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Cliente", value: "cliente.nomeUsuario", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Data do Aluguel", value: "dataAluguel", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Previsão de Devolução", value: "dataPrevisao", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Data de Devolução", value: "dataDevolucao", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Ações", value: "acoes", class: "text-md-body-1 font-weight-bold black--text", sortable: false },
      ],
      dialog: false,
      titleModal: "",
      aluguel: {
        id: "",
        livroId: "",
        clienteId: "",
        dataAluguel: "",
        dataPrevisao: "",
        dataDevolucao: "",
      },
      alugueis: [],
    };
  },
  mounted() {
    this.listar();
  },
  methods: {
    listar() {
      Aluguel.listar().then((resposta) => {
        this.alugueis = resposta.data;
      });
    },
    close() {
      this.dialog = false;
      this.aluguel = {};
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style scoped>
tbody {
  margin: 30px;
  width: 95%;
}
.v-data-table {
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
}
.novo {
  margin: 12px;
}
.novo span {
  padding-left: 3px;
  font-size: 1.5rem;
}
</style>
