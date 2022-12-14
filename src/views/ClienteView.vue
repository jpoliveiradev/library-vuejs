<template>
  <div class="app">
    <div class="d-flex flex-column align-center">
      <tbody>
        <v-row class="text-center">
          <v-col cols="12">
            <v-card elevation="3" class="table" style="border: 1px solid #004d40">
              <v-card-title>
                <h3>Clientes |</h3>
                <v-dialog v-model="dialog" persistent max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn slot="activator" @click="titleModal = 'Cadastrar Cliente'" class="novo mb-2" v-bind="attrs" v-on="on" color="#004D40" dark rounded> Novo <span>+</span> </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5 font-weight-bold"> {{ titleModal }} </span>
                    </v-card-title>
                    <v-card-text>
                      <v-form class="px-2" ref="form" lazy-validation>
                        <v-text-field :rules="nomeRules" label="Nome do Cliente" color="#004D40" v-model="cliente.nomeUsuario" append-icon="mdi-account" :counter="50" required></v-text-field>
                        <v-text-field :rules="rules" label="Endereço do Cliente" color="#004D40" v-model="cliente.endereco" append-icon="mdi-home-city" :counter="50" required></v-text-field>
                        <v-text-field :rules="rules" label="Cidade do Cliente" color="#004D40" v-model="cliente.cidade" append-icon="mdi-city" :counter="50" required></v-text-field>
                        <v-text-field :rules="emailRules" label="Email do Cliente" color="#004D40" v-model="cliente.email" append-icon="mdi-email" :counter="50" required></v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="error" text @click="close"> Fechar </v-btn>
                      <v-btn color="#004D40" text @click="salvar" :disabled="awaitCliente"> Salvar </v-btn>
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
                :items="clientes"
                :items-per-page="5"
                :footer-props="{
                  itemsPerPageOptions: [5, 10, 25, 50],
                  itemsPerPageText: 'Linhas por página',
                }"
                :search="search"
                :header-props="headerProps"
                :loading="loading"
                loading-text="Carregando dados... Aguarde!"
                no-results-text="Nenhum cliente encontrado">
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
import Cliente from "../services/clientes";

export default {
  name: "clientes",
  data: () => {
    return {
      headerProps: {
        sortByText: "Ordenar Por",
      },
      search: "",
      awaitCliente: true,
      nomeRules: [
        (value) => !!value || "Este campo é obrigatório.",
        (value) => (value && value.length <= 50) || "Máximo 50 caracteres",
        (value) => (value && value.length >= 3) || "Mínimo 3 caracteres",
        (value) => /^[a-zA-ZÀ-ú ]+$/.test(value) || "Campo com caracteres inválidos.",
        (value) => /[a-zA-ZÀ-ú ]+$/.test(value) || "Campo com caracteres inválidos.",
        (value) => /^[^-\s]/.test(value) || "Este campo não pode ter espaçamento no início.",
      ],
      rules: [
        (value) => !!value || "Este campo é obrigatório.",
        (value) => (value && value.length <= 50) || "Máximo 50 caracteres",
        (value) => (value && value.length >= 3) || "Mínimo 3 caracteres",
        (value) => /^[^-\s]/.test(value) || "Este campo não pode ter espaçamento no início.",
      ],
      emailRules: [
        (value) => !!value || "Este campo é obrigatório.",
        (value) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || "Email Inválido.",
      ],
      headers: [
        { text: "Id", value: "id", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Nome", value: "nomeUsuario", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Endereço", value: "endereco", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Cidade", value: "cidade", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Email", value: "email", class: "text-md-body-1 font-weight-bold black--text" },
        { text: "Ações", value: "acoes", class: "acoes text-md-body-1 mr-12 font-weight-bold black--text", sortable: false },
      ],
      loading: (true, "#004D40"),
      dialog: false,
      titleModal: "",
      cliente: {
        id: "",
        nomeUsuario: "",
        endereco: "",
        cidade: "",
        email: "",
      },
      clientes: [],
    };
  },
  mounted() {
    this.listar();
  },
  methods: {
    async listar() {
      this.awaitCliente = true;
      await Cliente.listar()
        .then((resposta) => {
          this.clientes = resposta.data;
          this.loading = false;
          this.awaitCliente = false;
        })
        .catch(() => {
          this.awaitCliente = true;
        });
    },
    async salvar() {
      this.awaitCliente = true;
      if (this.$refs.form.validate()) {
        if (!this.cliente.id) {
          await Cliente.salvar(this.cliente)
            .then(() => {
              this.cliente = {};
              this.dialog = false;
              this.$refs.form.resetValidation();
              this.$swal("Cliente Adicionado com Sucesso", "", "success");
              this.listar();
              this.awaitCliente = false;
            })
            .catch((e) => {
              this.$swal({
                title: "Erro ao Adicionar Cliente",
                text: e.response.data,
                icon: "error",
              });
              this.dialog = false;
              this.cliente = {};
              this.$refs.form.resetValidation();
              this.awaitCliente = false;
            });
        } else {
          this.atualizar();
        }
      }
    },
    showEdit(cliente) {
      this.titleModal = "Editar Cliente";
      this.dialog = true;
      this.cliente = { ...cliente };
    },
    async atualizar() {
      this.awaitCliente = true;
      await Cliente.atualizar(this.cliente)
        .then(() => {
          this.cliente = {};
          this.dialog = false;
          this.$refs.form.resetValidation();
          this.$swal("Cliente Atualizado com Sucesso", "", "success");
          this.listar();
          this.awaitCliente = false;
        })
        .catch((e) => {
          this.$swal({
            title: "Erro ao Atualizar Cliente",
            text: e.response.data,
            icon: "error",
          });
          this.dialog = false;
          this.cliente = {};
          this.$refs.form.resetValidation();
          this.awaitCliente = false;
        });
    },
    async remover(id) {
      await this.$swal({
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
          Cliente.excluir(id)
            .then(() => {
              this.$swal("Cliente Deletado com Sucesso!", "", "success");
              this.listar();
            })
            .catch((e) => {
              this.$swal({
                title: "Erro ao Deletar Cliente",
                text: e.response.data,
                icon: "error",
              });
            });
        } else {
          this.$swal("Cliente não Deletado", "", "info");
        }
      });
    },
    showModal() {
      this.titleModal = "Cadastrar Cliente";
      this.dialog = true;
      this.cliente = {};
      this.$nextTick(() => {
        this.$refs.form.resetValidation();
      });
    },
    close() {
      this.dialog = false;
      this.cliente = {};
      this.$refs.form.resetValidation();
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

@media (max-width: 1300px) {
  tbody {
    width: 90%;
  }
}
@media (max-width: 1200px) {
  tbody {
    width: 100%;
  }
  .app {
    margin: 20px 50px 10px 50px;
  }
}
@media (max-width: 900px) {
  tbody {
    width: 100%;
  }
  .app {
    margin: 20px 5px 5px 5px;
  }
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    padding: 10px;
    font-size: 0.8rem;
    padding-left: 8px;
  }
}
@media (max-width: 940px) {
  .app {
    margin: 20px 10px 10px 10px;
  }
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
@media (max-width: 750px) {
  tbody {
    width: 100%;
    margin: 10px;
  }
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
    padding: 10px;
    font-size: 0.8rem;
    padding-left: 8px;
  }
}
@media (max-width: 720px) {
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    padding: 0px 0px;
    margin: 10px;
    font-size: 0.75rem;
  }
}
@media (max-width: 650px) {
  tbody {
    width: 100%;
    margin: 10px;
  }
}
@media (max-width: 599px) {
  tbody {
    margin: 0px;
    width: 100%;
  }
  .v-data-table {
    margin-top: 0px;
    margin-left: 7px;
  }
  .v-data-table > .v-data-table__wrapper .v-data-table__mobile-row {
    height: initial;
    min-height: 29px;
  }
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-size: 1rem;
    padding-top: 0px;
    padding-right: 50px;
    padding-bottom: 0px;
    padding-left: 50px;
  }
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td.acoes {
    font-size: 3rem;
  }
  .v-data-table__mobile-row {
    display: flex;
    justify-content: space-between;
    margin: 3px 28px 4px 5px;
    align-items: center;
  }
  .v-btn--fab.v-size--x-small {
    display: inline-block;
    padding: 7px;
    margin: 0;
    height: 32px;
    width: 32px;
  }
}
</style>
