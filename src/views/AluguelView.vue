<template>
  <div class="app">
    <div class="d-flex flex-column align-center">
      <tbody>
        <v-card elevation="3" style="border: 1px solid #004d40">
          <v-card-title>
            <h3>Alugueis |</h3>
            <v-dialog v-model="dialog" persistent max-width="450px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn slot="activator" @click="titleModal = 'Alugar Livro'" class="novo mb-2" v-bind="attrs" v-on="on" color="#004D40" dark rounded> Novo <span>+</span> </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5 font-weight-bold"> {{ titleModal }} </span>
                </v-card-title>
                <v-card-text>
                  <v-form class="px-2" ref="form" lazy-validation>
                    <v-select
                      v-model="aluguel.livroId"
                      :rules="[rules.required]"
                      :items="livros"
                      item-text="nomeLivro"
                      item-value="id"
                      label="Nome do Livro"
                      color="#004D40"
                      append-icon="mdi-book-open-page-variant"
                      required></v-select>
                    <v-select
                      v-model="aluguel.clienteId"
                      :rules="[rules.required]"
                      :items="clientes"
                      item-text="nomeUsuario"
                      item-value="id"
                      label="Nome do Cliente"
                      color="#004D40"
                      append-icon="mdi-account"
                      required></v-select>
                    <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="aluguel.dataAluguel" transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="aluguel.dataAluguel"
                          label="Data de Aluguel"
                          append-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#004D40"
                          :rules="[rules.required]"></v-text-field>
                      </template>
                      <v-date-picker v-model="aluguel.dataAluguel" scrollable :max="date" color="#004D40" locale="pt-br">
                        <v-spacer></v-spacer>
                        <v-btn text color="error" @click="menu = false"> Cancelar </v-btn>
                        <v-btn text color="#004D40" @click="$refs.menu.save(aluguel.dataAluguel)"> OK </v-btn>
                      </v-date-picker>
                    </v-menu>

                    <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :return-value.sync="aluguel.dataPrevisao" transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="aluguel.dataPrevisao"
                          label="Data de Aluguel"
                          append-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#004D40"
                          :rules="[rules.required]"></v-text-field>
                      </template>
                      <v-date-picker v-model="aluguel.dataPrevisao" scrollable :min="aluguel.dataAluguel" color="#004D40" locale="pt-br">
                        <v-spacer></v-spacer>
                        <v-btn text color="error" @click="menu2 = false"> Cancelar </v-btn>
                        <v-btn text color="#004D40" @click="$refs.menu2.save(aluguel.dataPrevisao)"> OK </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-form>
                </v-card-text>
                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" text @click="close"> Fechar </v-btn>
                  <v-btn color="004D40" text @click="salvar"> Salvar </v-btn>
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
            loading="#004D40"
            loading-color="green"
            loading-text="Carregando dados... Aguarde!"
            no-results-text="Nenhum cliente encontrado">
            <template v-slot:[`item.dataAluguel`]="{ item }">
              <v-card elevation="0">
                <v-card-text style="font-family: arial; color: black">
                  <span>{{ dateFormatBr1(item.dataAluguel) }}</span>
                </v-card-text>
              </v-card>
            </template>

            <template v-slot:[`item.dataPrevisao`]="{ item }">
              <v-card elevation="0">
                <v-card-text style="font-family: arial; color: black">
                  <span>{{ dateFormatBr2(item.dataPrevisao) }}</span>
                </v-card-text>
              </v-card>
            </template>

            <template v-slot:[`item.dataDevolucao`]="{ item }">
              <v-card elevation="0">
                <v-card-text style="font-family: arial; color: black">
                  <v-chip :color="getColor(item.dataDevolucao, item.dataPrevisao)" dark>
                    {{
                      item.dataDevolucao
                        ? item.dataDevolucao > item.dataPrevisao
                          ? `${dateFormatBr3(item.dataDevolucao)} (Com atraso)`
                          : `${dateFormatBr3(item.dataDevolucao)} (No prazo)`
                        : "Não devolvido"
                    }}
                  </v-chip>
                </v-card-text>
              </v-card>
            </template>

            <template v-slot:[`item.acoes`]="{ item }">
              <v-tooltip top color="#F57F17">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-if="!item.dataDevolucao" x-large v-bind="attrs" v-on="on" color="#F57F17" text @click="devolver(item)">
                    <v-icon> mdi-book-check </v-icon>
                  </v-btn>
                </template>
                <span>Devolver</span>
              </v-tooltip>
              <v-tooltip top color="red">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-if="item.dataDevolucao" v-bind="attrs" v-on="on" class="mx-2" elevation="1" fab x-small color="error" @click="remover(item)">
                    <v-icon> mdi-delete </v-icon>
                  </v-btn>
                </template>
                <span>Remover</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </tbody>
    </div>
  </div>
</template>

<script>
import Aluguel from "../services/alugueis";
import Livro from "../services/livros";
import Cliente from "../services/clientes";
import moment from "moment";

export default {
  name: "alugueis",
  data: () => {
    return {
      search: "",
      rules: {
        required: (value) => !!value || "Este campo é obrigatório.",
      },
      headers: [
        { text: "Id", value: "id", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Livro", value: "livro.nomeLivro", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Cliente", value: "cliente.nomeUsuario", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Data do Aluguel", align: "center", value: "dataAluguel", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Previsão de Devolução", align: "center", value: "dataPrevisao", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Data de Devolução", align: "center", value: "dataDevolucao", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Ações", value: "acoes", align: "center", class: "text-md-body-1 font-weight-bold black--text", sortable: false },
      ],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      dialog: false,
      titleModal: "",
      aluguel: {
        id: "",
        livroId: "",
        livro: "",
        clienteId: "",
        cliente: "",
        dataAluguel: "",
        dataPrevisao: "",
        dataDevolucao: "",
      },
      alugueis: [],
      livros: [],
      clientes: [],
    };
  },
  mounted() {
    this.listar(), this.listarLivro(), this.listarCliente();
  },
  methods: {
    listar() {
      Aluguel.listar().then((resposta) => {
        this.alugueis = resposta.data;
      });
    },
    listarLivro() {
      Livro.listar().then((resposta) => {
        this.livros = resposta.data;
      });
    },
    listarCliente() {
      Cliente.listar().then((resposta) => {
        this.clientes = resposta.data;
      });
    },
    salvar() {
      if (this.$refs.form.validate()) {
        if (!this.aluguel.id) {
          Aluguel.salvar(this.aluguel)
            .then(() => {
              this.aluguel = {};
              this.dialog = false;
              this.$refs.form.resetValidation();
              this.$swal("Livro Alugado com Sucesso", "", "success");
              this.listar();
            })
            .catch((e) => {
              this.aluguel = {};
              this.dialog = false;
              this.$refs.form.resetValidation();
              this.$swal({ title: "Erro ao Alugar Livro", text: e.response.data, icon: "error" });
              this.listar();
            });
        }
      }
    },
    devolver(aluguel) {
      this.$swal({
        title: "Você deseja devolver este livro?",
        icon: "warning",
        confirmButtonColor: "#004D40",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        confirmButtonText: "Devolver!",
      }).then((resposta) => {
        if (resposta.isConfirmed) {
          this.aluguel = { ...aluguel };
          this.aluguel.dataDevolucao = this.date;
          Aluguel.atualizar(this.aluguel).then(() => {
            this.aluguel = {};
            this.$swal("Livro Devolvido com Sucesso!", "", "success");
            this.listar();
          });
        } else {
          this.$swal("Livro não Devolvido", "", "info");
          this.listar();
        }
      });
    },
    remover(id) {
      this.$swal({
        title: "Você deseja realmente apagar?",
        icon: "warning",
        confirmButtonColor: "#004D40",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        confirmButtonText: "Apagar!",
      }).then((resposta) => {
        if (resposta.isConfirmed) {
          Aluguel.excluir(id).then(() => {
            this.$swal("Aluguel Deletado com Sucesso!", "", "success");
            this.listar();
          });
        } else {
          this.$swal("Aluguel não Deletado", "", "info");
        }
      });
    },
    close() {
      this.dialog = false;
      this.aluguel = {};
      this.$refs.form.resetValidation();
    },
    dateFormatBr1(dataAluguel) {
      return moment(dataAluguel).format("DD/MM/YYYY");
    },
    dateFormatBr2(dataPrevisao) {
      return moment(dataPrevisao).format("DD/MM/YYYY");
    },
    dateFormatBr3(dataDevolucao) {
      return moment(dataDevolucao).format("DD/MM/YYYY");
    },
    getColor(dataDevolucao, dataPrevisao) {
      if (dataDevolucao == null) return "orange";
      else if (dataDevolucao > dataPrevisao) return "red";
      else return "green";
    },
  },
};
</script>

<style scoped>
tbody {
  margin: 30px;
  margin-top: 5px;
  margin-bottom: 5px;
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
