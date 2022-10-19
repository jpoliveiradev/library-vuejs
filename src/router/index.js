import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import ClienteView from "../views/ClienteView.vue";
import EditoraView from "../views/EditoraView.vue";
import LivroView from "../views/LivroView.vue";
import AluguelView from "../views/AluguelView.vue";
import LoginView from "../views/LoginView.vue";
import teste from "../views/teste.vue";
import NavBar from "../components/NavBar.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
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
    path: "/navbar",
    name: "navbar",
    component: NavBar,
  },
  {
    path: "/teste",
    name: "teste",
    component: teste,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== "login" && !localStorage.getItem("authAdmin")) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
