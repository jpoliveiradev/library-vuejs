import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import ClienteView from "../views/ClienteView.vue";
import EditoraView from "../views/EditoraView.vue";
import LivroView from "../views/LivroView.vue";
import AluguelView from "../views/AluguelView.vue";
import TesteView from "../views/TesteView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/clientes",
    name: "clientes",
    component: ClienteView,
  },
  {
    path: "/editoras",
    name: "editoras",
    component: EditoraView,
  },
  {
    path: "/livros",
    name: "livros",
    component: LivroView,
  },
  {
    path: "/alugueis",
    name: "alugueis",
    component: AluguelView,
  },
  {
    path: "/teste",
    name: "teste",
    component: TesteView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
