import Vue from 'vue'
import Router from 'vue-router'
import Dslm from './views/Dslm.vue'
import Home from './views/Home.vue'
import Designer from './views/Designer.vue'
Vue.use(Router);
export default new Router({
  linkExactActiveClass: 'is-active',
  routes: [
      {
        path:"/",
        name:"Home",
        component:Home
      },
      {
        path:"/quizmaster",
        name:"Quizmaster",
        component:Dslm,
        props:{view:false}
      },
      {
        path:"/view",
        name:"Players",
        component:Dslm,
        props:{view:true}
      },
      {
        path:"/designer",
        name:"Designer",
        component:Designer
      }
  ]
})
