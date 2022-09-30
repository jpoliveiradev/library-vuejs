<template>
  <div class="grafico" style="border: 1px solid #004d40">
    <apexchart height="400" width="400" type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import Livro from "../../services/livros";

export default {
  name: "BarChart",
  data: () => {
    return {
      loading: true,
      clientes: [],
      editoras: [],
      livros: [],
      alugueis: [],
      chartSet: [],
      chartOptions: {
        chart: {
          name: "BarChart",
          zoom: false,
          height: "auto",
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          position: "top",
          fontSize: "14px",
          fontFamily: "Helvetica, Arial",
          fontWeight: 500,

          markers: {
            fillColors: ["#008FFB", "#004D40", "#F9C80E"],
          },

          itemMargin: {
            horizontal: 10,
            vertical: 20,
          },
        },
        stroke: {
          show: true,
          width: 20,
          colors: ["transparent"],
        },
        title: {
          text: "Livros Mais Alugados",
          style: {
            fontSize: "16px",
            color: "#000",
          },
        },
        fill: {
          colors: ["#008FFB", "#004D40", "#F9C80E"],
        },
        xaxis: {
          type: "category",
          categories: ["Quantidade Total Alugado"],

          axisBorder: {
            show: true,
            color: "#004D40",
            height: 1,
            width: "100%",
            offsetX: 0,
            offsetY: 0,
          },
        },
      },

      series: [
        {
          name: "",
          data: [0, 0, 0],
        },
      ],
    };
  },
  mounted() {
    this.updateChart();
  },
  methods: {
    updateChart() {
      Livro.listarMaisAlugados().then((res) => {
        this.livros = res.data;
        this.chartSet = this.livros;
        this.xaxis = {
          categories: ["Quantidade Total"],
        };
        this.series = [
          {
            name: this.chartSet[0].nomeLivro,
            data: [this.chartSet[0].quantAlugado],
          },
          {
            name: this.chartSet[1].nomeLivro,
            data: [this.chartSet[1].quantAlugado],
          },
          {
            name: this.chartSet[2].nomeLivro,
            data: [this.chartSet[2].quantAlugado],
          },
        ];
      });
    },
  },
};
</script>
<style scoped>
.grafico {
  display: inline-block;
  width: 40%;
  position: relative;
  bottom: 20px;
  margin: 60px 110px 0 70px;
  padding: 20px;
  padding-bottom: 0px;
  border-radius: 10px;
}
</style>
