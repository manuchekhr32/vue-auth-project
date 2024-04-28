<template>
  <div>
    <h2 class="w-full text-center text-2xl font-bold">REGISTER</h2>
    <form @submit.prevent="submit">
      <label>
        <span>Full Name</span>
        <input
          :readonly="loading"
          type="text"
          maxlength="80"
          required
          v-model="form.fullName"
        />
      </label>
      <label class="mt-3 block">
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
      <label class="mt-3 block">
        <span>Website</span>
        <input :readonly="loading" type="url" v-model="form.website" />
      </label>
      <label class="mt-3 block">
        <span>About</span>
        <textarea :readonly="loading" v-model="form.about" />
      </label>
      <button :disabled="loading" class="mt-5 mb-2" type="submit">
        {{ loading ? 'Loading...' : 'Submit' }}
      </button>
      <router-link
        :to="{ name: 'AuthLogin' }"
        class="text-center text-blue-500 w-full inline-block"
        >Already have an account?</router-link
      >
    </form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi.ts'
import { useAuthStore } from '@/store/auth.ts'
import { IAuthTokens, IRegisterPayload } from '@/types/auth.ts'
import { catchError } from '@/utils/catch-error.ts'

const $api = useApi()
const $router = useRouter()
const authStore = useAuthStore()

const form = reactive<IRegisterPayload>({
  username: '',
  password: '',
  fullName: '',
  website: null,
  about: null,
})

const loading = ref(false)
async function submit() {
  try {
    loading.value = true
    const res = await $api.$post<IAuthTokens, IRegisterPayload>(
      '/api/auth/register',
      form,
    )
    authStore.setTokens(res.data, true)
    await authStore.fetchProfile()
    alert('Registered successfully')
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
