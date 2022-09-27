<template>
  <nav id="navBar">
    <v-toolbar elevation="2">
      <v-toolbar-title class="title">
        <span>WDA </span>
        <span>LIVRARIA</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="menu">
        <v-btn class="transparent" active-class="activated-btn" to="/" depressed rounded>
          <v-icon> mdi-home </v-icon>
          <span>Inicio</span>
        </v-btn>

        <v-btn class="transparent" active-class="activated-btn" to="/clientes" depressed rounded>
          <v-icon> mdi-account-edit </v-icon>
          <span>Clientes</span>
        </v-btn>

        <v-btn class="transparent" active-class="activated-btn" to="/editoras" depressed rounded>
          <v-icon> mdi-bookshelf </v-icon>
          <span>Editoras</span>
        </v-btn>

        <v-btn class="transparent" active-class="activated-btn" to="/livros" depressed rounded>
          <v-icon> mdi-book-plus </v-icon>
          <span>Livros</span>
        </v-btn>

        <v-btn class="transparent" active-class="activated-btn" to="/alugueis" depressed rounded>
          <v-icon> mdi-book-account </v-icon>
          <span>Alugueis</span>
        </v-btn>
      </div>
      <v-spacer></v-spacer>
      <v-tooltip bottom color="error">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" class="mx-2" elevation="1" fab small color="error" @click="logout()">
            <v-icon> mdi-logout </v-icon>
          </v-btn>
        </template>
        <span>Sair</span>
      </v-tooltip>
    </v-toolbar>
  </nav>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem("authAdmin");
      this.$router.push({name: 'login'})
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Philosopher:wght@400;700&display=swap");

.title {
  margin-left: 100px;
}
.title span {
  font-family: "Philosopher", sans-serif;
  font-weight: 700;
  font-size: 1.9rem;
}
.v-btn {
  font-size: 16px;
}
.activated-btn {
  background-color: #062a6d !important;
  color: #fafafa;
  transition: all ease 0.3s;
}
</style>
