import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CenterViewVue from '@/views/CenterView.vue'
import MOMPSViewVue from '@/views/MOMPSView.vue'
import DetailViewVue from '@/views/DetailView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/center',
      name: 'center',
      component: CenterViewVue
    },
    {
      path: '/momps',
      name: 'momps',
      component: MOMPSViewVue
    },
    {
      path: '/detail/:line?',
      name: 'detail',
      sensitive: true,
      component: DetailViewVue
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
