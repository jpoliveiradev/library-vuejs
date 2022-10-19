<template>
  <div class="app">
    <v-container>
      <v-row>
        <v-col class="d-none d-sm-flex" cols="12" sm="12" md="12" lg="12" xl="12">
          <v-row class="px-12 mt-2 card-md">
            <v-col cols="6" sm="6" md="3" lg="3" xl="3" v-for="(list, idx) in lists" :key="idx">
              <v-card id="cards" align="center" color="#F9FAFC" class="rounded-circle border" flat>
                <v-icon size="50" color="#004D40">
                  {{ list.icon }}
                </v-icon>

                <v-card-text id="titles" class="blue-grey--text font-weight-bold text-lg-h6">
                  {{ list.title }}
                </v-card-text>

                <v-btn id="quant" absolute color="#004D40" class="white--text" fab left top>
                  <h2>{{ list.count }}</h2>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex d-sm-none card-sm" cols="12">
          <v-row class="px-10 mt-2">
            <v-col cols="6" v-for="(list, idx) in lists" :key="idx">
              <v-card id="cards" align="center" color="#F9FAFC" class="rounded-circle border" flat>
                <v-icon size="40" color="#004D40">
                  {{ list.icon }}
                </v-icon>

                <v-card-text id="titles" class="blue-grey--text font-weight-bold text-lg-h6">
                  {{ list.title }}
                </v-card-text>

                <v-btn id="quant" absolute color="#004D40" class="white--text" fab left top>
                  <h2>{{ list.count }}</h2>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <v-row class="barChartRow">
        <v-col class="d-none d-sm-flex" id="barChart" cols="12" sm="5" md="5" lg="6" xl="6">
          <BarChart />
        </v-col>
        <v-col>
          <v-row class="d-none d-sm-flex justify-center">
            <v-col class="d-flex justify-center" id="ultAluguelCol" cols="12" sm="12" md="10" lg="8" xl="10">
              <v-card id="ultAluguel" class="my-10">
                <v-card-title class="mx-auto text-center"> <v-icon color="#004D40" size="30">mdi-book</v-icon><b>Último Livro alugado:</b> </v-card-title>
                <v-card-text class="text-center">
                  <h3 style="color: #212121">{{ this.ultimoLivroAluguel }}</h3>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col id="pieChart" cols="12" sm="12" md="12" lg="10" xl="10">
              <DoughnutChart />
            </v-col>
          </v-row>

          <v-col class="d-flex d-sm-none" id="barChart" cols="12" sm="5" md="5" lg="6" xl="6">
            <BarChart />
          </v-col>
          <v-row class="d-flex d-sm-none row-xs">
            <v-col class="d-flex justify-center" cols="12">
              <v-card id="ultAluguel" class="my-10">
                <v-card-title class="mx-auto text-center"> <v-icon color="#004D40" size="30">mdi-book</v-icon><b>Último Livro alugado:</b> </v-card-title>
                <v-card-text class="text-center">
                  <h3 style="color: #212121">{{ this.ultimoLivroAluguel }}</h3>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col id="pieChart" cols="12">
              <DoughnutChart />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
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
  left: -18px !important;
}
#quant {
  width: 50px;
  height: 50px;
}
.graficos {
  position: relative;
}
#cards {
  width: 150px;
  height: 150px;
  padding-top: 25px;
}
#ultAluguel {
  display: inline-block;
  border: 1px solid #004d40;
  width: 320px;
  margin-left: 0;
}
@media (min-width: 950px) and (max-width: 1050px) {
  #cards {
    max-width: 130px;
    max-height: 130px;
    padding-top: 14px;
  }
}
@media (min-width: 760px) and (max-width: 959px) {
  #ultAluguelCol {
    display: flex;
    justify-content: start;
  }
  .card-md {
    padding-left: 109px !important;
  }
}
@media (max-width: 980px) {
  .app {
    margin: 20px 10px 10px 10px;
  }
}
@media (max-width: 1100px) {
  #ultAluguel {
    max-width: 300px;
    margin-left: 10px;
  }
}
@media (max-width: 600px) {
  #quant {
    padding: 10px;
    width: 45px;
    height: 45px;
  }

  .v-btn--absolute.v-btn--left,
  .v-btn--fixed.v-btn--left {
    left: -18px !important;
  }
  #cards {
    max-width: 120px;
    max-height: 120px;
    padding-top: 14px;
  }
  .card-sm {
    padding-left: 60px !important;
  }
}
@media (max-width: 580px) {
  .card-sm {
    padding-left: 20px !important;
  }
}
@media (max-width: 500px) {
  #cards {
    margin-right: 180px;
    margin-left: 0px;
  }
  .card-sm {
    padding-left: 10px !important;
  }
}
@media (max-width: 430px) {
  #cards {
    margin-right: 140px;
  }
  .card-sm {
    padding-left: 0px !important;
  }
  #ultAluguel {
    width: 170px;
  }
}
@media (max-width: 750px) {
  .barChartRow {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #barChart {
    /* display: flex; */
    justify-content: center;
    margin-right: 10px;
  }
  #pieChart {
    display: flex;
    justify-content: center;
  }
}
@media (max-width: 480px) {
  #pieChart {
    display: flex;
    justify-content: center;
  }
  .app {
    margin: 20px 5px 10px 5px;
  }
}
</style>
