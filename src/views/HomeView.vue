<template>
  <div class="app">
    <v-container>
      <v-row>
        <v-col cols="10" sm="12">
          <v-row class="px-10 mt-n6 ml-5">
            <v-col cols="10" sm="3" v-for="(list, idx) in lists" :key="idx">
              <v-card align="center" color="#F9FAFC" class="rounded-circle border pt-5" width="150" height="150" flat>
                <v-icon size="60" color="#004D40">
                  {{ list.icon }}
                </v-icon>

                <v-card-text class="blue-grey--text font-weight-bold text-lg-h6">
                  {{ list.title }}
                </v-card-text>

                <v-btn absolute color="#004D40" class="white--text" fab left top>
                  <h2>{{ list.count }}</h2>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <div class="graficos" style="display: inline-block">
        <BarChart />
        <v-card id="teste" width="300">
          <v-card-title class="mx-auto text-center"> <v-icon color="#004D40" size="30">mdi-book</v-icon><b>Último Livro alugado:</b> </v-card-title>
          <v-card-text class="text-center">
            <h3 style="color: #212121">{{ this.ultimoLivroAluguel }}</h3>
          </v-card-text>
        </v-card>

        <DoughnutChart />
      </div>
    </v-container>
  </div>
</template>

<script>
import BarChart from "../components/charts/BarChart.vue";
import DoughnutChart from "../components/charts/DoughnutChart.vue";
import Cliente from "../services/clientes";
import Editora from "../services/editoras";
import Livro from "../services/livros";
import Aluguel from "../services/alugueis";

export default {
  name: "home",
  components: {
    BarChart,
    DoughnutChart,
  },
  data: () => {
    return {
      clientes: [],
      editoras: [],
      livros: [],
      alugueis: [],
      ultimoAluguel: [],
      ultimoLivroAluguel: [],
      lists: [
        {
          icon: "mdi-account",
          title: "Clientes",
          count: 0,
        },
        {
          icon: "mdi-bookshelf",
          title: "Editoras",
          count: 0,
        },
        {
          icon: "mdi-book-open-page-variant",
          title: "Livros",
          count: 0,
        },
        {
          icon: "mdi-book-account",
          title: "Alugueis",
          count: 0,
        },
      ],
    };
  },
  mounted() {
    Cliente.listar().then((res) => {
      this.clientes = res.data;
      this.lists[0].count = this.clientes.length;
    });
    Editora.listar().then((res) => {
      this.editoras = res.data;
      this.lists[1].count = this.editoras.length;
    });
    Livro.listar().then((res) => {
      this.livros = res.data;
      this.lists[2].count = this.livros.length;
    });
    Aluguel.listar().then((res) => {
      this.alugueis = res.data;
      this.lists[3].count = this.alugueis.length;
      this.ultimoAluguel = this.alugueis[this.alugueis.length - 1];
      this.ultimoLivroAluguel = this.ultimoAluguel.livro.nomeLivro;
    });
  },
};
</script>
<style scoped>
.v-container {
  margin-bottom: 0;
}
.border {
  border: 2px solid #004d40 !important;
}
.v-btn--fab.v-size--default.v-btn--absolute.v-btn--top {
  top: 45px !important;
}
.v-btn--absolute.v-btn--left,
.v-btn--fixed.v-btn--left {
  left: -26px !important;
}
.graficos {
  position: relative;
}
#teste {
  position: absolute;
  top: 35px;
  display: inline-block;
  border: 1px solid #004d40;
}
</style>
