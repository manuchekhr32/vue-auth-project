import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios'

import { useAuthStore } from '@/store/auth.ts'

export const useApi = (apiUrl?: string) => {
  const baseURL = apiUrl || import.meta.env.VITE_APP_SERVER_URL
  const authStore = useAuthStore()

  const $service = (config?: CreateAxiosDefaults): AxiosInstance => {
    const headers = {
      ...config?.headers,
      // Default headers
    }
    const tokens = authStore.getTokens
    if (tokens?.access) {
      Object.assign(headers, {
        Authorization: `Bearer ${tokens.access}`,
      })
    }
    const _axios = axios.create({
      ...config,
      baseURL,
      headers,
    })
    // Use interceptors here
    _axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (tokens?.refresh && error.response.status === 401) {
          const accessToken = await authStore.refreshToken()
          return _axios.request({
            ...error.config,
            headers: {
              ...error.config.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          })
        }
      },
    )
    return _axios
  }

  function $get<R = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> {
    return new Promise((resolve, reject) => {
      $service()
        .get<R>(url, config)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  function $delete<R = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> {
    return new Promise((resolve, reject) => {
      $service()
        .delete<R>(url, config)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  function $post<R = unknown, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> {
    return new Promise((resolve, reject) => {
      $service()
        .post<R>(url, data, config)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  function $put<R = unknown, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> {
    return new Promise((resolve, reject) => {
      $service()
        .put<R>(url, data, config)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  function $patch<R = unknown, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> {
    return new Promise((resolve, reject) => {
      $service()
        .patch<R>(url, data, config)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  return { $get, $delete, $post, $patch, $put }
}
