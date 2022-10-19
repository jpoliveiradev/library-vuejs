<template>
  <div id="chart">
    <apexchart id="apexchart" v-if="!loading" type="pie" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import Aluguel from "../../services/alugueis";

export default {
  name: "DoughnutChart",
  data: () => {
    return {
      loading: true,
      alugueis: [],
      chartSet: [],
      series: [0, 0, 0],
      chartOptions: {
        chart: {
          type: "pie",
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
          },
        },
        fill: {
          colors: ["#008FFB", "#d33", "#F9C80E"],
        },
        title: {
          text: "Dados de Aluguéis de Livros",
          style: {
            fontSize: "16px",
            color: "#000",
          },
        },
        colors: ["#0077FF", "#DB2D2D", "#F9C80E"],
        labels: ["No Prazo", "Com atraso", "Não Devolvidos"],
        noData: {
          text: "Carregando...",
        },
        animations: {
          enabled: true,
        },
        legend: {
          fontSize: "14px",
          fontFamily: "Helvetica, Arial",
          fontWeight: 500,

          markers: {
            fillColors: ["#008FFB", "#d33", "#F9C80E"],
          },

          itemMargin: {
            vertical: 10,
          },
        },
      },
    };
  },
  mounted() {
    this.updateChart();
  },
  methods: {
    updateChart() {
      Aluguel.listar().then((res) => {
        this.alugueis = res.data;
        this.alugueis.forEach((a) => {
          if (a.dataDevolucao != null && a.dataDevolucao <= a.dataPrevisao) {
            this.series[0]++;
          }
        });
        this.alugueis.forEach((a) => {
          if (a.dataDevolucao > a.dataPrevisao) {
            this.series[1]++;
          }
        });
        this.alugueis.forEach((a) => {
          if (a.dataDevolucao == null) {
            this.series[2]++;
          }
        });
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped>
#chart {
  display: inline-block;
  position: relative;
  top: 10px;
  left: 50px;
  width: 450px;
}

@media (max-width: 1200px) {
  #chart {
    /* width: 4000px; */
    left: 60px;
  }
}

@media (max-width: 1150px) {
  #chart {
    width: 450px;
    left: 60px;
  }
}
/* @media (min-width: 1100px) {
  #chart {
    width: 450px;
    left: 80px;
  }
} */
@media (max-width: 1100px) {
  #chart {
    width: 380px;
    left: 60x;
  }
}
@media (max-width: 810px) {
  #chart {
    width: 350px;
    left: 55px;
  }
}
@media (max-width: 750px) {
  #chart {
    width: 420px;
  }
}

@media (max-width: 560px) {
  #chart {
    width: 350px;
  }
}
@media (max-width: 490px) {
  #chart {
    width: 330px;
    left: 30px;
    /* margin-left: 90px; */
  }
}
@media (max-width: 480px) {
  #chart {
    width: 330px;
    left: 6px;
    margin-left: 2px;
  }
  #apexchart {
    width: 330px;
    margin-left: 20px;
  }
}
</style>
