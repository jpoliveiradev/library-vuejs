<template>
  <div class="app">
    <v-card>
      <v-card-title>
        Alugueis |  
        <template >
        <!-- <template /*v-slot:activator="{ on, attrs }"*/> -->
          <v-btn color="primary" dark class="novo mb-2" v-bind="attrs" v-on="on" rounded> Novo <span>+</span> </v-btn>
        </template>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="alugueis" :search="search"></v-data-table>
    </v-card>
  </div>
</template>

<script>
import Aluguel from "../Services/alugueis";
//import Editora from "../Services/editoras";

export default {
  name: "alugueis",
  data: () => {
    return {
      search: "",
      headers: [
        { text: "Id", value: "id" },
        { text: "Livro", value: "livro.nomeLivro" },
        { text: "Cliente", value: "cliente.nomeUsuario" },
        { text: "Data do Aluguel", value: "dataAluguel" },
        { text: "Previsão de Devolução", value: "dataPrevisao" },
        { text: "Data de Devolução", value: "dataDevolucao" },
      ],
      alugueis: [],
    };
  },
  mounted() {
    Aluguel.listar().then((resposta) => {
      this.alugueis = resposta.data;
    });
  },
};
</script>
<style scoped>
.novo {
  margin: 12px;
  font-size: 18px;
}
</style>