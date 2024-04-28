import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/store/auth.ts'

import routes from './routes.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.meta?.auth) {
    const authStore = useAuthStore()
    const tokens = authStore.initTokens()
    if (!tokens?.accessToken) {
      next({
        name: 'AuthLogin',
      })
      return
    }
    try {
      if (authStore.getAuthUser) {
        next()
        return
      }
      await authStore.fetchProfile()
    } catch {
      next({
        name: 'AuthLogin',
      })
      next()
    }
  }
  next()
})

export default router
