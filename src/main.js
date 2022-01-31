import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import '@mdi/font/css/materialdesignicons.css'
import router from "./router"
Vue.use(Buefy);
Vue.config.productionTip = false
const formateadorFecha = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: "medium" });
Vue.filter("timestampAFecha", timestamp => {
  if (!timestamp) {
    return "";
  }
  return formateadorFecha.format(new Date(timestamp));
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
