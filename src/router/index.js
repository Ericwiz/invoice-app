import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },

    {
      path: '/invoice/:invoiceId',
      name: 'Invoice',
      props: route => ({invoiceId: route.params.invoiceId}),
      component: () => import('../views/InvoiceView.vue')

    }
  ]
})

export default router
