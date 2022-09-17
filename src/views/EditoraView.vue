<template>
  <div class="app">
    <div class="d-flex flex-column align-center">
      <tbody>
        <v-card elevation="3" style="border: 1px solid #8f16cc">
          <v-card-title>
            <h3>Editoras |</h3>
            <v-dialog v-model="dialog" persistent max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <!-- <v-btn color="" dark class="novo mb-2" v-bind="attrs" v-on="on" rounded> Novo <span>+</span> </v-btn> -->
                <v-btn slot="activator" @click="titleModal = 'Cadastrar Editora'" class="novo mb-2" v-bind="attrs" v-on="on" color="#7433FB" dark rounded> Novo <span>+</span> </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5 font-weight-bold"> {{ titleModal }} </span>
                </v-card-title>
                <v-card-text>
                  <v-form class="px-2" ref="form" lazy-validation>
                    <v-text-field :rules="[rules.required, rules.maxValue, rules.minValue]" label="Nome da Editora" color="deep-purple" v-model="editora.nomeEditora" append-icon="mdi-bookshelf"></v-text-field>
                    <v-text-field :rules="[rules.required, rules.maxValue, rules.minValue]" label="Cidade da Editora" color="deep-purple" v-model="editora.cidade" append-icon="mdi-city" required></v-text-field>
                  </v-form>
                </v-card-text>
                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" text @click="close"> Fechar </v-btn>
                  <v-btn color="deep-purple" text @click="salvar"> Salvar </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="editoras" :items-per-page="5" :search="search" loading="items" loading-text="Carregando dados... Aguarde!" no-results-text="Nenhuma editora encontrada">
            <template v-slot:[`item.acoes`]="{ item }">
              <v-tooltip top color="#8f16cc">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" elevation="1" fab x-small color="#5E35B1" dark @click="showEdit(item)">
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
import Editora from "../Services/editoras";

export default {
  name: "editoras",
  data: () => {
    return {
      search: "",
      rules: {
        required: (value) => !!value || "Este campo é obrigatório.",
        maxValue: (value) => (value && value.length <= 50) || "Máximo 50 caracteres",
        minValue: (value) => (value && value.length >= 3) || "Mínimo 3 caracteres",
      },
      headers: [
        { text: "Id", value: "id", class: "deep-purple darken-3,  font-weight-bold, white--text herd" },
        { text: "Nome", value: "nomeEditora", class: "deep-purple darken-3, font-weight-bold, white--text" },
        { text: "Cidade", value: "cidade", class: "deep-purple darken-3, font-weight-bold, white--text" },
        { text: "Ações", value: "acoes", class: "deep-purple darken-3, font-weight-bold, white--text", sortable: false },
      ],
      dialog: false,
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
        confirmButtonColor: "#8f16cc",
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
.novo {
  margin: 12px;
}
.novo span {
  padding-left: 3px;
  font-size: 1.5rem;
}
</style>
