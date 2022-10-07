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

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
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
  left: 80px;
  width: 450px;
}

@media (max-width: 1200px) {
  #chart {
    width: 350px;
    left: 40px;
  }
}
@media (max-width: 1100px) {
  #chart {
    width: 420px;
    left: 200px;
  }
}
@media (max-width: 1000px) {
  #chart {
    width: 450px;
    left: 200px;
  }
}
@media (max-width: 900px) {
  #chart {
    width:400px;
    left: 150px;
  }
}
</style>
