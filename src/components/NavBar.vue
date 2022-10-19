<template>
  <nav id="navBar">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = true" class="d-flex d-md-none mr-6"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-toolbar-title class="title"> <h1>WDA LIVRARIA</h1> </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items v-model="tab" align-with-title class="d-none d-md-flex">
        <div class="menu d-flex">
          <div class="mt-3 mr-2">
            <v-btn class="transparent" active-class="activated-btn" to="/" depressed rounded>
              <v-icon> mdi-home </v-icon>
              <span>Inicio</span>
            </v-btn>
          </div>
          <div class="mt-3 mr-2">
            <v-btn class="transparent" active-class="activated-btn" to="/clientes" depressed rounded>
              <v-icon> mdi-account-edit </v-icon>
              <span>Clientes</span>
            </v-btn>
          </div>
          <div class="mt-3 mr-2">
            <v-btn class="transparent" active-class="activated-btn" to="/editoras" depressed rounded>
              <v-icon> mdi-bookshelf </v-icon>
              <span>Editoras</span>
            </v-btn>
          </div>
          <div class="mt-3 mr-2">
            <v-btn class="transparent" active-class="activated-btn" to="/livros" depressed rounded>
              <v-icon> mdi-book-plus </v-icon>
              <span>Livros</span>
            </v-btn>
          </div>
          <div class="mt-3 mr-2">
            <v-btn class="transparent" active-class="activated-btn" to="/alugueis" depressed rounded>
              <v-icon> mdi-book-account </v-icon>
              <span>Alugueis</span>
            </v-btn>
          </div>
        </div>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items v-model="tab" align-with-title class="d-none d-md-flex">
        <div class="mt-3 mr-2">
          <v-tooltip bottom color="error" class="d-none d-md-flex">
            <template v-slot:activator="{ on, attrs }">
              <v-btn id="sair" v-bind="attrs" v-on="on" class="ml-2" elevation="1" fab small color="error" @click="logout()">
                <v-icon> mdi-logout </v-icon>
              </v-btn>
            </template>
            <span>Sair</span>
          </v-tooltip>
        </div>
      </v-toolbar-items>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list nav dense>
        <v-list-item-group active-class="teal  white--text text--accent-4">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.link" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <span>{{ item.text }}</span>
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-icon>
              <v-icon color="error">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title><span style="color: red">Sair</span></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      tab: null,
      items: [
        {
          icon: "mdi-home",
          text: "Inicio",
          link: "/",
        },
        {
          icon: "mdi-account",
          text: "Clientes",
          link: "/clientes",
        },

        {
          icon: "mdi-bookshelf",
          text: "Editoras",
          link: "/editoras",
        },
        {
          icon: "mdi-book",
          text: "Livros",
          link: "/livros",
        },
        {
          icon: "mdi-book-account",
          text: "Alugueis",
          link: "/alugueis",
        },
      ],
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("authAdmin");
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Philosopher:wght@400;700&display=swap");

.title {
  margin-left: 30px;
}
.title h1 {
  font-family: "Philosopher", sans-serif;
  font-weight: 700;
  /* font-size: 1.8rem; */
}
.menu .v-btn {
  margin-left: 5px;
  margin-top: 5px;
  width: 110px;
  padding: 0 50px 0 50px;
}
.menu .v-btn span {
  font-size: 14px;
}

.activated-btn {
  background-color: #062a6d !important;
  color: #fafafa;
  transition: all ease 0.3s;
}

/* @media (max-width: 900px) {
  .title {
    margin-left: 0px;
  }
  .menu .v-btn {
    margin-left: 5px;
    max-width: 100px;
    padding: 0;
    font-size: 5px;
  }
} */
/* @media (max-width: 960px) {
  nav .n{
    position: fixed;
  }
} */
@media (max-width: 500px) {
  .title {
    margin-left: 0px;
  }
  #sair {
    margin: 10px;
    height: 30px;
    width: 30px;
  }
}
</style>
