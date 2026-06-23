import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: () => import('../views/OverviewPage.vue'),
      meta: { title: 'Overview' },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionsPage.vue'),
      meta: { title: 'Transactions' },
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('../views/AddTransactionPage.vue'),
      meta: { title: 'Add Transaction' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
