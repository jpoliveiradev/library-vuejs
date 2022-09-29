<template>
  <div class="app">
    <div class="d-flex flex-column align-center">
      <tbody>
        <v-card elevation="3" class="table" style="border: 1px solid #004d40">
          <v-card-title>
            <h3>Editoras |</h3>
            <v-dialog v-model="dialog" persistent max-width="400px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn slot="activator" @click="titleModal = 'Cadastrar Editora'" class="novo mb-2" v-bind="attrs" v-on="on" color="#004D40" dark rounded> Novo <span>+</span> </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5 font-weight-bold"> {{ titleModal }} </span>
                </v-card-title>
                <v-card-text>
                  <v-form class="px-2" ref="form" lazy-validation>
                    <v-text-field
                      class="mb-2"
                      :rules="rulesEditora"
                      label="Nome da Editora"
                      color="#004D40"
                      v-model="editora.nomeEditora"
                      append-icon="mdi-bookshelf"
                      :counter="50"
                      required></v-text-field>
                    <v-text-field :rules="rulesEditora" label="Cidade da Editora" color="#004D40" v-model="editora.cidade" append-icon="mdi-city" :counter="50" required></v-text-field>
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
            <v-text-field color="#004D40" v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="editoras"
            :items-per-page="5"
            :footer-props="{
              itemsPerPageOptions: [5, 10, 25, 50],
              itemsPerPageText: 'Linhas por página',
            }"
            :search="search"
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
      search: "",
      rulesEditora: [
        (value) => !!value || "Este campo é obrigatório.",
        (value) => (value && value.length <= 50) || "Máximo 50 caracteres",
        (value) => (value && value.length >= 3) || "Mínimo 3 caracteres",
        (value) => /^[a-zA-ZÀ-ú ]+$/.test(value) || "Campo com caracteres inválidos.",
        (value) => /[a-zA-ZÀ-ú ]+$/.test(value) || "Campo com caracteres inválidos.",
        (value) => /^[^-\s]/.test(value) || "Este campo não pode ter espaçamento no início.",
      ],
      headers: [
        { text: "Id", value: "id", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Nome", value: "nomeEditora", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Cidade", value: "cidade", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Ações", value: "acoes", class: "text-md-body-1 font-weight-bold black--text", sortable: false },
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
    listar() {
      Editora.listar().then((resposta) => {
        this.editoras = resposta.data;
        this.loading = false;
      });
    },
    salvar() {
      if (this.$refs.form.validate()) {
        if (!this.editora.id) {
          Editora.salvar(this.editora)
            .then(() => {
              this.dialog = false;
              this.editora = {};
              this.$refs.form.resetValidation();
              this.$swal("Editora Adicionada com Sucesso", "", "success");
              this.listar();
            })
            .catch((e) => {
              this.dialog = false;
              this.editora = {};
              this.$refs.form.resetValidation();
              this.$swal({ title: "Erro ao Adicionar Editora", text: e.response.data, icon: "error" });
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
    atualizar() {
      Editora.atualizar(this.editora)
        .then(() => {
          this.editora = {};
          this.dialog = false;
          this.$refs.form.resetValidation();
          this.$swal("Editora Atualizada com Sucesso", "", "success");
          this.listar();
        })
        .catch((e) => {
          this.$swal({ title: "Erro ao Atualizar Editora", text: e.response.data, icon: "error" });
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
          Editora.excluir(id)
            .then(() => {
              this.$swal("Editora Deletada com Sucesso", "", "success");
              this.listar();
            })
            .catch((e) => {
              this.$swal({ title: "Erro ao Deletar Editora", text: e.response.data, icon: "error" });
            });
        } else {
          this.$swal("Editora não Deletada", "", "info");
        }
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
  width: 60%;
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
