import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi.ts'
import { IAuthTokens, IAuthUser } from '@/types/auth.ts'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    tokens: {
      access: null as string | null,
      refresh: null as string | null,
    },
    user: null as null | IAuthUser,
  }),
  getters: {
    getTokens: (state) => state.tokens,
    getAuthUser: (state) => state.user,
  },
  actions: {
    setTokens(payload: IAuthTokens, save?: boolean) {
      this.tokens.access = payload.accessToken
      this.tokens.refresh = payload.refreshToken
      if (save) {
        localStorage.setItem('access-token', payload.accessToken as string)
        localStorage.setItem('refresh-token', payload.refreshToken as string)
      }
    },
    initTokens() {
      const accessToken = localStorage.getItem('access-token')
      const refreshToken = localStorage.getItem('refresh-token')
      this.setTokens({
        accessToken,
        refreshToken,
      })
      return {
        accessToken,
        refreshToken,
      }
    },
    async fetchProfile() {
      const user = await useApi().$get<IAuthUser>('/api/auth/profile')
      this.user = user.data
    },
    async refreshToken() {
      try {
        const res = await useApi().$post<Pick<IAuthTokens, 'accessToken'>>(
          '/api/auth/refresh-token',
          {
            token: this.tokens!.refresh,
          },
        )
        this.tokens.access = res.data.accessToken
        localStorage.setItem('access-token', res.data.accessToken as string)
        return res.data.accessToken
      } catch {
        this.tokens.access = null
        this.tokens.refresh = null
        localStorage.removeItem('access-token')
        localStorage.removeItem('refresh-token')
        useRouter().push({
          name: 'AuthLogin',
        })
        return null
      }
    },
  },
})
