<template>
  <div class="app">
    <div class="d-flex flex-column align-center">
      <tbody>
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
                    <v-text-field :rules="rules" label="Nome do Cliente" color="#004D40" v-model="cliente.nomeUsuario" append-icon="mdi-account" :counter="50" required></v-text-field>
                    <v-text-field :rules="enderecoRules" label="Endereço do Cliente" color="#004D40" v-model="cliente.endereco" append-icon="mdi-home-city" :counter="50" required></v-text-field>
                    <v-text-field :rules="rules" label="Cidade do Cliente" color="#004D40" v-model="cliente.cidade" append-icon="mdi-city" :counter="50" required></v-text-field>
                    <v-text-field :rules="emailRules" label="Email do Cliente" color="#004D40" v-model="cliente.email" append-icon="mdi-email" :counter="50" required></v-text-field>
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
            :items="clientes"
            :items-per-page="5"
            :footer-props="{
              itemsPerPageOptions: [5, 10, 25, 50],
              itemsPerPageText: 'Linhas por página',
            }"
            :search="search"
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
      search: "",
      rules: [
        (value) => !!value || "Este campo é obrigatório.",
        (value) => (value && value.length <= 50) || "Máximo 50 caracteres",
        (value) => (value && value.length >= 3) || "Mínimo 3 caracteres",
        (value) => /^[a-zA-ZÀ-ú ]+$/.test(value) || "Campo com caracteres inválidos.",
        (value) => /[a-zA-ZÀ-ú ]+$/.test(value) || "Campo com caracteres inválidos.",
        (value) => /^[^-\s]/.test(value) || "Este campo não pode ter espaçamento no início.",
      ],
      enderecoRules: [
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
        { text: "Ações", value: "acoes", class: "text-md-body-1 font-weight-bold black--text", sortable: false },
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
    listar() {
      Cliente.listar().then((resposta) => {
        this.clientes = resposta.data;
        this.loading = false;
      });
    },
    salvar() {
      if (this.$refs.form.validate()) {
        if (!this.cliente.id) {
          Cliente.salvar(this.cliente)
            .then(() => {
              this.cliente = {};
              this.dialog = false;
              this.$refs.form.resetValidation();
              this.$swal("Cliente Adicionado com Sucesso", "", "success");
              this.listar();
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
    atualizar() {
      Cliente.atualizar(this.cliente)
        .then(() => {
          this.cliente = {};
          this.dialog = false;
          this.$refs.form.resetValidation();
          this.$swal("Cliente Atualizado com Sucesso", "", "success");

          this.listar();
        })
        .catch((e) => {
          this.$swal({
            title: "Erro ao Atualizar Cliente",
            text: e.response.data,
            icon: "error",
          });
          this.dialog = false;
          this.$refs.form.resetValidation();
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
  width: 70%;
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
