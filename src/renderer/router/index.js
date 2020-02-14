import Vue from 'vue'
import Router from 'vue-router'
import Novel from '@/components/Novel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Novel',
      component: Novel
    }
  ]
})
