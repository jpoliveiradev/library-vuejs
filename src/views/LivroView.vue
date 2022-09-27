<template>
  <div class="app">
    <div class="d-flex flex-column align-center">
      <tbody>
        <v-card elevation="3" class="table" style="border: 1px solid #004d40">
          <v-card-title>
            <h3>Livros |</h3>
            <v-dialog v-model="dialog" persistent max-width="450px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn slot="activator" @click="titleModal = 'Cadastrar Livro'" class="novo mb-2" v-bind="attrs" v-on="on" color="#004D40" dark rounded> Novo <span>+</span> </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5 font-weight-bold"> {{ titleModal }} </span>
                </v-card-title>
                <v-card-text>
                  <v-form class="px-2" ref="form" lazy-validation>
                    <v-text-field
                      :rules="[rules.required, rules.maxValue, rules.minValue]"
                      label="Nome do Livro"
                      color="#004D40"
                      v-model="livro.nomeLivro"
                      append-icon="mdi-book-open-page-variant"
                      :counter="50"
                      required></v-text-field>

                    <v-select
                      v-model="livro.editoraId"
                      :rules="[rules.required]"
                      :items="editoras"
                      item-text="nomeEditora"
                      item-value="id"
                      label="Editora do Livro"
                      color="#004D40"
                      append-icon="mdi-bookshelf"
                      required></v-select>

                    <v-text-field
                      :rules="[rules.required, rules.maxValue, rules.minValue]"
                      label="Autor do Livro"
                      color="#004D40"
                      v-model="livro.autor"
                      append-icon="mdi-account-edit"
                      :counter="50"
                      required></v-text-field>

                    <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="livro.lancamento" transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="livro.lancamento"
                          label="Lançamento do Livro"
                          append-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#004D40"
                          :rules="[rules.required]"></v-text-field>
                      </template>
                      <v-date-picker v-model="livro.lancamento" scrollable :max="date" color="#004D40" locale="pt-br">
                        <v-spacer></v-spacer>
                        <v-btn text color="error" @click="menu = false"> Cancelar </v-btn>
                        <v-btn text color="#004D40" @click="$refs.menu.save(livro.lancamento)"> OK </v-btn>
                      </v-date-picker>
                    </v-menu>

                    <v-text-field
                      :rules="[rules.required, rules.minQuant]"
                      label="Quantidade do Livro"
                      type="number"
                      color="#004D40"
                      v-model="livro.quantidade"
                      append-icon="mdi-numeric"
                      required></v-text-field>
                  </v-form>
                </v-card-text>
                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" text @click="close"> Fechar </v-btn>
                  <v-btn color="#004D40" text @click="salvar"> Salvar </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
          </v-card-title>
          <v-data-table
            class="elevation-1"
            :headers="headers"
            :items="livros"
            :items-per-page="5"
            :footer-props="{
              itemsPerPageOptions: [5, 10, 25, 50],
              itemsPerPageText: 'Linhas por página',
            }"
            :search="search"
            :loading="loading"
            loading-text="Carregando dados... Aguarde!"
            no-results-text="Nenhum livro encontrado">
            <!-- <template v-slot:[`item.lancamento`]="{ item }">
              <v-card elevation="0">
                <v-card-text style="font-family: arial; color: black">
                  <span>{{ dateFormatBr(item.lancamento) }}</span>
                </v-card-text>
              </v-card>
            </template> -->
            <template v-slot:[`item.quantidade`]="{ item }">
              <v-chip :color="getColor(item.quantidade)" dark>
                {{ item.quantidade }}
              </v-chip>
            </template>

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
  </div>
</template>

<script>
import Livro from "../services/livros";
import Editora from "../services/editoras";
import moment from "moment";

export default {
  name: "livros",
  data: () => {
    return {
      search: "",
      rules: {
        required: (value) => !!value || "Este campo é obrigatório.",
        maxValue: (value) => (value && value.length <= 50) || "Máximo 50 caracteres",
        minValue: (value) => (value && value.length >= 3) || "Mínimo 3 caracteres",
        minQuant: (value) => (value && value >= 1) || "Mínimo 1 quantidade",
      },
      headers: [
        { text: "Id", value: "id", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Nome", value: "nomeLivro", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Editora", value: "editora.nomeEditora", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Autor", value: "autor", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Lançamento", align: "center", value: "lancamento", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Quantidade", align: "center", value: "quantidade", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Ações", align: "center", value: "acoes", class: "text-md-body-1 font-weight-bold black--text", sortable: false },
      ],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      nowDate: new Date().toISOString().slice(0, 10),
      loading: (true, "#004D40"),
      dialog: false,
      titleModal: "",
      livro: {
        id: "",
        nomeLivro: "",
        autor: "",
        editoraId: "",
        editora: "",
        lancamento: "",
        quantidade: "",
      },
      livros: [],
      editoras: [],
      dateF: [],
    };
  },
  mounted() {
    this.listar(), this.listarEditora();
  },
  methods: {
    listar() {
      Livro.listar().then((resposta) => {
        this.livros = resposta.data;

        this.livros.forEach((a) => {
          this.dateF = moment(a.lancamento).format("YYYY-MM-DD");
          return (a.lancamento = this.dateF);
        });
        this.loading = false;
      });
    },
    listarEditora() {
      Editora.listar().then((resposta) => {
        this.editoras = resposta.data;
      });
    },
    salvar() {
      if (this.$refs.form.validate()) {
        if (!this.livro.id) {
          Livro.salvar(this.livro)
            .then(() => {
              this.livro = {};
              this.dialog = false;
              this.$refs.form.resetValidation();
              this.$swal("Livro Adicionado com Sucesso", "", "success");
              this.listar();
            })
            .catch((e) => {
              this.livro = {};
              this.dialog = false;
              this.$refs.form.resetValidation();
              this.$swal({ title: "Erro ao Adicionar Livro", text: e.response.data, icon: "error" });
              this.listar();
            });
        } else {
          this.atualizar();
        }
      }
    },
    showEdit(livro) {
      this.titleModal = "Editar Livro";
      this.dialog = true;
      this.livro = { ...livro };
    },
    atualizar() {
      Livro.atualizar(this.livro)
        .then(() => {
          this.livro = {};
          this.dialog = false;
          this.$refs.form.resetValidation();
          this.$swal("Livro Atualizado com Sucesso", "", "success");
          this.listar();
        })
        .catch((e) => {
          this.livro = {};
          this.dialog = false;
          this.$refs.form.resetValidation();
          this.$swal({ title: "Erro ao Atualizar Livro", text: e.response.data, icon: "error" });
          this.listar();
        });
    },
    remover(id) {
      this.$swal({
        title: "Você deseja realmente apagar?",
        text: "Você não será capaz de reverter isso!",
        icon: "warning",
        confirmButtonColor: "#004D40",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        confirmButtonText: "Apagar!",
      }).then((resposta) => {
        if (resposta.isConfirmed) {
          Livro.excluir(id)
            .then(() => {
              this.$swal("Livro Deletado com Sucesso!", "", "success");
              this.listar();
            })
            .catch((e) => {
              this.$swal({
                title: "Erro ao Deletar Livro",
                text: e.response.data,
                icon: "error",
              });
            });
        } else {
          this.$swal("Livro não Deletado", "", "info");
        }
      });
    },
    close() {
      this.dialog = false;
      this.livro = {
        id: "",
        nomeLivro: "",
        autor: "",
        editoraId: "",
        editora: "",
        lancamento: "",
        quantidade: "",
      };
      this.$refs.form.resetValidation();
    },

    getColor(quantidade) {
      if (quantidade >= 10) return "green";
      else if (quantidade >= 1) return "orange";
      else return "red";
    },
    // dateFormatBr(lancamento) {
    //   return moment(lancamento).format("DD/MM/YYYY");
    // },
  },
};
</script>
<style scoped>
tbody {
  margin: 30px;
  min-width: 85%;
}

.table {
  border-radius: 10px;
}

.v-data-table {
  margin-top: 10px;
  margin-left: 20px;
}
.novo {
  margin: 12px;
}
.novo span {
  padding-left: 3px;
  font-size: 1.5rem;
}
</style>
