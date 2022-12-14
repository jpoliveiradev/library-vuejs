<template>
  <div class="app">
    <div class="d-flex flex-column align-center">
      <tbody>
        <v-card elevation="3" class="table" style="border: 1px solid #004d40">
          <v-card-title>
            <h3>Livros |</h3>
            <v-dialog v-model="dialog" persistent max-width="450px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn slot="activator" @click="showModal()" class="novo mb-2" v-bind="attrs" v-on="on" color="#004D40" dark rounded> Novo <span>+</span> </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5 font-weight-bold"> {{ titleModal }} </span>
                </v-card-title>
                <v-card-text>
                  <v-form class="px-2" ref="form" lazy-validation>
                    <v-text-field
                      :rules="[rules.required, rules.maxValue, rules.minValue, rules.campoInvalido]"
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
                      :rules="[rules.required, rules.maxValue, rules.minValue, rules.campoInvalido]"
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
                          label="Lan??amento do Livro"
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
                  <v-btn color="#004D40" text @click="salvar" :disabled="awaitLivro"> Salvar </v-btn>
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
              itemsPerPageText: 'Linhas por p??gina',
            }"
            :search="search"
            :header-props="headerProps"
            :loading="loading"
            loading-text="Carregando dados... Aguarde!"
            no-results-text="Nenhum livro encontrado">
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
      headerProps: {
        sortByText: "Ordenar Por",
      },
      search: "",
      awaitLivro: true,
      rules: {
        required: (value) => !!value || "Este campo ?? obrigat??rio.",
        maxValue: (value) => (value && value.length <= 50) || "M??ximo 50 caracteres",
        minValue: (value) => (value && value.length >= 3) || "M??nimo 3 caracteres",
        minQuant: (value) => (value && value >= 1) || "M??nimo 1 quantidade",
        campoInvalido: (value) => /^[^-\s]/.test(value) || "Este campo n??o pode ter espa??amento no in??cio.",
      },
      headers: [
        { text: "Id", value: "id", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Nome", value: "nomeLivro", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Editora", value: "editora.nomeEditora", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Autor", value: "autor", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Lan??amento", align: "center", value: "lancamento", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Quantidade", align: "center", value: "quantidade", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "A????es", align: "center", value: "acoes", class: "text-md-body-1 font-weight-bold black--text", sortable: false },
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
    async listar() {
      this.awaitLivro = true;
      await Livro.listar()
        .then((resposta) => {
          this.livros = resposta.data;
          this.livros.forEach((l) => {
            l.lancamento = this.parseDate(l.lancamento);
          });
          this.loading = false;
          this.awaitLivro = false;
        })
        .catch(() => {
          this.awaitLivro = true;
        });
    },
    listarEditora() {
      Editora.listar().then((resposta) => {
        this.editoras = resposta.data;
      });
    },
    parseDate(date) {
      return moment(date).format("DD/MM/yyyy");
    },
    parseDateISO(date) {
      const [dd, mm, yyyy] = date.split("/");
      return `${yyyy}-${mm}-${dd}`;
    },
    async salvar() {
       this.awaitLivro = true;
      if (this.$refs.form.validate()) {
        if (!this.livro.id) {
          await Livro.salvar(this.livro)
            .then(() => {
              this.livro = {};
              this.dialog = false;
              this.$refs.form.resetValidation();
              this.$swal("Livro Adicionado com Sucesso", "", "success");
              this.listar();
               this.awaitLivro = false;
            })
            .catch((e) => {
              this.livro = {};
              this.dialog = false;
              this.$refs.form.resetValidation();
              this.$swal({ title: "Erro ao Adicionar Livro", text: e.response.data, icon: "error" });
              this.listar();
               this.awaitLivro = false;
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
      this.livro.lancamento = this.parseDateISO(livro.lancamento);
    },
   async atualizar() {
       this.awaitLivro = true;
    await  Livro.atualizar(this.livro)
        .then(() => {
          this.livro = {};
          this.dialog = false;
          this.$refs.form.resetValidation();
          this.$swal("Livro Atualizado com Sucesso", "", "success");
          this.listar();
           this.awaitLivro = false;
        })
        .catch((e) => {
          this.livro = {};
          this.dialog = false;
          this.$refs.form.resetValidation();
          this.$swal({ title: "Erro ao Atualizar Livro", text: e.response.data, icon: "error" });
          this.listar();
           this.awaitLivro = false;
        });
    },
    remover(id) {
      this.$swal({
        title: "Voc?? deseja realmente apagar?",
        text: "Voc?? n??o ser?? capaz de reverter isso!",
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
          this.$swal("Livro n??o Deletado", "", "info");
        }
      });
    },
    showModal() {
      this.titleModal = "Cadastrar Livro";
      this.dialog = true;
      this.livro = {};
      this.$nextTick(() => {
        this.$refs.form.resetValidation();
      });
    },
    close() {
      this.dialog = false;
      this.livro = {};
      this.$refs.form.resetValidation();
    },

    getColor(quantidade) {
      if (quantidade >= 10) return "green";
      else if (quantidade >= 1) return "orange";
      else return "red";
    },
  },
};
</script>
<style scoped>
tbody {
  margin: 30px;
  width: 90%;
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

@media (max-width: 1200px) {
  tbody {
    width: 100%;
  }

  .app {
    margin: 20px 30px 10px 30px;
  }
}
@media (max-width: 1100px) {
  tbody {
    width: 100%;
  }

  .app {
    margin: 20px 30px 10px 30px;
  }
}

@media (max-width: 1000px) {
  tbody {
    width: 100%;
  }

  .app {
    margin: 20px 10px 20px 10px;
  }

  .v-data-table {
    margin-top: 0;
    margin-left: 0px;
  }
}
@media (min-width: 600px) and (max-width: 840px) {
  .v-btn--fab.v-size--x-small {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 20px;
    height: 30px;
    width: 30px;
  }
}
@media (min-width: 600px) and (max-width: 690px) {
  .v-btn--fab.v-size--x-small {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 20px;
    height: 30px;
    width: 30px;
  }
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    padding: 0px 8px;
  }
}
@media (max-width: 600px) {
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-size: 0.8rem;
  }
}
</style>
