import Vue from 'vue'
import App from './App.vue'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "./../public/assets/toast.scss";
import { POSITION } from "vue-toastification";
const options = {
    // You can set your default options here
    position:POSITION.BOTTOM_RIGHT
};
Vue.use(Toast,options)
import router from "./router"
// import axios from "axios"
// add font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(far,fas) // add all solid icons
Vue.component('font-awesome-icon', FontAwesomeIcon)
// parse scss, including bulma
import "./../public/assets/main.scss"
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
