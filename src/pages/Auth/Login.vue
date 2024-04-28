<template>
  <div>
    <h2 class="w-full text-center text-2xl font-bold">LOGIN</h2>
    <form @submit.prevent="submit">
      <label>
        <span>Username</span>
        <input
          :readonly="loading"
          type="text"
          maxlength="20"
          required
          v-model="form.username"
        />
      </label>
      <label class="mt-3 block">
        <span>Password</span>
        <input
          :readonly="loading"
          type="password"
          required
          v-model="form.password"
        />
      </label>
      <button :disabled="loading" class="mt-5 mb-2" type="submit">
        {{ loading ? 'Loading...' : 'Submit' }}
      </button>
      <router-link
        :to="{ name: 'AuthRegister' }"
        class="text-center text-blue-500 w-full inline-block"
        >Don't have an account?</router-link
      >
    </form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi.ts'
import { useAuthStore } from '@/store/auth.ts'
import { IAuthTokens, TLoginPayload } from '@/types/auth.ts'
import { catchError } from '@/utils/catch-error.ts'

const $api = useApi()
const $router = useRouter()
const authStore = useAuthStore()

const form = reactive<TLoginPayload>({
  username: '',
  password: '',
})

const loading = ref(false)
async function submit() {
  try {
    loading.value = true
    const res = await $api.$post<IAuthTokens, TLoginPayload>(
      '/api/auth/login',
      form,
    )
    authStore.setTokens(res.data, true)
    await authStore.fetchProfile()
    alert('Login successful')
    $router.push({
      name: 'Profile',
    })
  } catch (err) {
    catchError(err)
  } finally {
    loading.value = false
  }
}
</script>
