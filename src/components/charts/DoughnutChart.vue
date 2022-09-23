<template>
  <div id="chart">
    <apexchart v-if="!loading" type="pie" width="480" :options="chartOptions" :series="series"></apexchart>
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
          width: 380,
          type: "pie",
        },
        dataLabels: {
          enabled: false,
        },
        title: {
          text: "Dados de Aluguéis de Livros",
          style: {
            fontSize: "16px",
            color: "#000",
          },
        },
        fill: {
          colors: ["#008FFB", "#d33", "#F9C80E"],
        },
        labels: ["No Prazo", "Com atraso", "Não Devolvidos"],
        noData: {
          text: "Carregando...",
        },
        animations: {
          enabled: true,
        },
        legend: {
          //   position: "right",
          //   fontSize: "14px",
          //   fontFamily: "Helvetica, Arial",
          //   fontWeight: 500,
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
        // this.chartSet = this.livros;
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
        // this.series = [
        //   {
        //     name: this.chartSet[0].nomeLivro,
        //     data: [this.chartSet[0].quantAlugado],
        //   },
        //   {
        //     name: this.chartSet[1].nomeLivro,
        //     data: [this.chartSet[1].quantAlugado],
        //   },
        //   {
        //     name: this.chartSet[2].nomeLivro,
        //     data: [this.chartSet[2].quantAlugado],
        //   },
        // ];
      });
      // console.log(this.series);
    },
  },
};
</script>

<style scoped>
#chart {
   display: inline-block;
   /* margin-left: 30px;   */
   margin-right: 0;
    /* margin-top: 0px;  */
}
</style>
