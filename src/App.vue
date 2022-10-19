<template>
  <v-app>
    <NavBar v-if="notIsLoginPage && notIsNavBarPage" />
    <v-main>
      <router-view />
    </v-main>

    <Footer v-if="notIsLoginPage && notIsNavBarPage" />
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default {
  name: "App",
  components: {
    NavBar,
    Footer,
  },
  data: () => ({
    //
  }),
  computed: {
    notIsLoginPage() {
      return this.$route.name != "login";
    },
    notIsNavBarPage() {
      return this.$route.name != "navbar";
    },
  },
};
</script>

<style>
.v-main {
  background-color: #06283d;
}
.app {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 500;
  background: #fafafa;
  margin: 20px 100px 10px 100px;
  padding: 30px;
  border-radius: 5px;
}

@media (max-width: 900px) {
  .app {
    margin: 20px 50px 10px 50px;
  }
}
@media (max-width: 600px) {
  .app {
    margin: 20px 10px 10px 10px;
  }
}
</style>
