import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      themes: {
        light: {
          c000: '#FFFFFF',
          c100: '#E5E5E5',
          c200: '#8f16cc',
          c300: '#4e0075',
          c400: '#1D3245',
          c500: '#49C9A8',
          c600: '#02AF8E',
          c700: '#FF7E55',
          c800: '#35CFFF',
          c900: '#DE183F',
        },
      },
    },
  });