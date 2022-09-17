<template>
  <v-app>
    <NavBar />
    <v-main>
      <router-view />
    </v-main>
 
     <Footer></Footer>
    
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
};
</script>

<style>
.v-main {
  background-color: #06283D;
}
.app {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 500;
  background: #fafafa;
  margin: 20px 100px 10px 100px;
  padding: 30px;
  border-radius: 5px;
}
</style>
