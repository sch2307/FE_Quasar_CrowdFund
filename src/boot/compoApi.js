import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import { boot } from 'quasar/wrappers'

export default boot(({ Vue }) => {
  Vue.use(VueCompositionApi)
})

Vue.use(VueCompositionApi);
