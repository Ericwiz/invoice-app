import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: {
        title: 'Invoices',
        requireAuth:true
      }
    },

    {
      path: '/invoice/:invoiceId',
      name: 'Invoice',
      props: route => ({invoiceId: route.params.invoiceId}),
      component: () => import('../views/InvoiceView.vue'),
      meta: {
        title: 'Invoice Details',
        requireAuth:true
      }

    }, 
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUp.vue'),
      meta: {
        title: 'Sign up',
      }
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/SignIn.vue'),
      meta: {
        title: 'Sign in',
      }
    }
  ]
})

const auth = getAuth()

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach( async(to) => {
  document.title = `${to.meta.title}`
  const requireAuth = to.matched.some(record => record.meta.requireAuth)
  if(requireAuth && !(await getCurrentUser())) {
    return {path: '/signin'}
  }

})

export default router
