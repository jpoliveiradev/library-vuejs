<template>
  <v-footer padless>
    <v-card flat tile class="white--text text-center flex">
      <v-card-text class="black--text">
        {{ new Date().getFullYear() }} — <strong>JP Oliveira</strong>
        <v-btn icon class="black--text" href="https://github.com/jpoliveiradev" target="_blank">
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {};
</script>

<style scoped>
.v-card-text {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: 1.8em;
  font-weight: bolder;
}
</style>
