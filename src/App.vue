<template>
  <v-app>
    <NavBar v-if="notIsLoginPage" />
    <v-main>
      <router-view />
    </v-main>

    <Footer v-if="notIsLoginPage" />
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

</style>
