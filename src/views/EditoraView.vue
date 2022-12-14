<template>
  <div class="app">
    <div class="d-flex flex-column align-center">
      <tbody>
        <v-row class="text-center">
          <v-col cols="12">
            <v-card elevation="3" class="table" style="border: 1px solid #004d40">
              <v-card-title>
                <h3>Editoras |</h3>
                <v-dialog v-model="dialog" persistent max-width="400px">
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
                          class="mb-2"
                          :rules="rules"
                          label="Nome da Editora"
                          color="#004D40"
                          v-model="editora.nomeEditora"
                          append-icon="mdi-bookshelf"
                          :counter="50"
                          required></v-text-field>
                        <v-text-field :rules="rules" label="Cidade da Editora" color="#004D40" v-model="editora.cidade" append-icon="mdi-city" :counter="50" required></v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="error" text @click="close"> Fechar </v-btn>
                      <v-btn color="#004D40" text @click="salvar" :disabled="awaitEditora"> Salvar </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-spacer></v-spacer>
                <v-row class="text-center">
                  <v-col class="ml-5" cols="10"> <v-text-field color="#004D40" v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field></v-col>
                </v-row>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="editoras"
                :items-per-page="5"
                :footer-props="{
                  itemsPerPageOptions: [5, 10, 25, 50],
                  itemsPerPageText: 'Linhas por p??gina',
                }"
                :search="search"
                :header-props="headerProps"
                :loading="loading"
                loading-text="Carregando dados... Aguarde!"
                no-results-text="Nenhuma Editora encontrada">
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
          </v-col>
        </v-row>
      </tbody>
    </div>
  </div>
</template>

<script>
import Editora from "../services/editoras";

export default {
  name: "editoras",
  data: () => {
    return {
      headerProps: {
        sortByText: "Ordenar Por",
      },
      awaitEditora: true,
      search: "",
      rules: [
        (value) => !!value || "Este campo ?? obrigat??rio.",
        (value) => (value && value.length <= 50) || "M??ximo 50 caracteres",
        (value) => (value && value.length >= 3) || "M??nimo 3 caracteres",
        (value) => /^[^-\s]/.test(value) || "Este campo n??o pode ter espa??amento no in??cio.",
      ],
      headers: [
        { text: "Id", value: "id", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Nome", value: "nomeEditora", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Cidade", value: "cidade", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "A????es", value: "acoes", class: "text-md-body-1 font-weight-bold black--text", sortable: false },
      ],
      dialog: false,
      loading: (true, "#004D40"),
      titleModal: "",
      editora: { id: "", nomeEditora: "", cidade: "" },
      editoras: [],
    };
  },
  mounted() {
    this.listar();
  },
  methods: {
    async listar() {
      this.awaitEditora = true;
      await Editora.listar()
        .then((resposta) => {
          this.editoras = resposta.data;
          this.loading = false;
          this.awaitEditora = false;
        })
        .catch(() => {
          this.awaitEditora = true;
        });
    },
    async salvar() {
      this.awaitEditora = true;
      if (this.$refs.form.validate()) {
        if (!this.editora.id) {
          await Editora.salvar(this.editora)
            .then(() => {
              this.dialog = false;
              this.editora = {};
              this.$refs.form.resetValidation();
              this.$swal("Editora Adicionada com Sucesso", "", "success");
              this.listar();
              this.awaitEditora = false;
            })
            .catch((e) => {
              this.dialog = false;
              this.editora = {};
              this.$refs.form.resetValidation();
              this.$swal({ title: "Erro ao Adicionar Editora", text: e.response.data, icon: "error" });
              this.awaitEditora = false;
            });
        } else {
          this.atualizar();
        }
      }
    },
    showEdit(editora) {
      this.titleModal = "Editar Editora";
      this.dialog = true;
      this.editora = { ...editora };
    },
    async atualizar() {
      this.awaitEditora = true;
      await Editora.atualizar(this.editora)
        .then(() => {
          this.editora = {};
          this.dialog = false;
          this.$refs.form.resetValidation();
          this.$swal("Editora Atualizada com Sucesso", "", "success");
          this.listar();
          this.awaitEditora = false;
        })
        .catch((e) => {
          this.$swal({ title: "Erro ao Atualizar Editora", text: e.response.data, icon: "error" });
          this.dialog = false;
          this.editora = {};
          this.$refs.form.resetValidation();
          this.awaitEditora = false;
        });
    },
    async remover(id) {
      await this.$swal({
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
          Editora.excluir(id)
            .then(() => {
              this.$swal("Editora Deletada com Sucesso", "", "success");
              this.listar();
            })
            .catch((e) => {
              this.$swal({ title: "Erro ao Deletar Editora", text: e.response.data, icon: "error" });
            });
        } else {
          this.$swal("Editora n??o Deletada", "", "info");
        }
      });
    },
    showModal() {
      this.titleModal = "Cadastrar Editora";
      this.dialog = true;
      this.editora = {};
      this.$nextTick(() => {
        this.$refs.form.resetValidation();
      });
    },
    close() {
      this.dialog = false;
      this.editora = {};
      this.$refs.form.resetValidation();
    },
  },
};
</script>
<style scoped>
tbody {
  margin: 20px;
  width: 80%;
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
@media (max-width: 1100px) {
  .app {
    margin: 20px 20px 10px 20px;
  }
}
@media (max-width: 910px) {
  tbody {
    margin: 10px;
    width: 100%;
  }
}
@media (max-width: 750px) {
  tbody {
    margin: 20px;
    width: 100%;
  }
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    padding: 0;
  }
}
@media (max-width: 599px) {
  .v-data-table {
    margin-top: 0px;
    margin-left: 7px;
  }
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    padding-top: 0px;
    padding-right: 1px;
    padding-bottom: 0px;
    padding-left: 0px;
  }
}
</style>
