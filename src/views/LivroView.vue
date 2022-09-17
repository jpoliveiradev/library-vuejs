<template>
  <div class="app">
    <div class="d-flex flex-column align-center">
      <tbody>
        <v-card elevation="3" style="border: 1px solid #8f16cc">
          <v-card-title>
            Livros |
            <template>
              <!-- <template /*v-slot:activator="{ on, attrs }"*/> -->
              <v-btn color="primary" dark class="novo mb-2" v-bind="attrs" v-on="on" rounded> Novo <span>+</span> </v-btn>
            </template>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="livros" :search="search">
            <template v-slot:[`item.quantidade`]="{ item }">
              <v-chip :color="getColor(item.quantidade)" dark>
                {{ item.quantidade }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </tbody>
    </div>
  </div>
</template>

<script>
import Livro from "../Services/livros";
//import Editora from "../Services/editoras";

export default {
  name: "livros",
  data: () => {
    return {
      search: "",
      headers: [
        { text: "Id", value: "id" },
        { text: "Nome", value: "nomeLivro" },
        { text: "Autor", value: "autor" },
        { text: "Editora", value: "editora.nomeEditora" },
        { text: "Lançamento", value: "lancamento" },
        { text: "Quantidade", value: "quantidade" },
      ],
      livros: [],
    };
  },
  methods: {
    getColor(quantidade) {
      if (quantidade >= 10) return "green";
      else if (quantidade >= 1) return "orange";
      else return "red";
    },
  },
  mounted() {
    Livro.listar().then((resposta) => {
      this.livros = resposta.data;
    });
  },
};
</script>
<style scoped>
tbody {
  margin: 30px;
  width: 70%;
}
.novo {
  margin: 12px;
}
.novo span {
  padding-left: 3px;
  font-size: 1.5rem;
}
</style>
