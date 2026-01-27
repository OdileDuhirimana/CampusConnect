import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'
export const API_ORIGIN = API_BASE.replace(/\/?api\/?$/, '')

export const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  if (isRefreshing && refreshPromise) return refreshPromise
  isRefreshing = true
  const refresh = localStorage.getItem('refresh')
  if (!refresh) throw new Error('No refresh token')
  refreshPromise = api
    .post('/auth/refresh/', { refresh })
    .then((res) => {
      const newAccess = res.data?.access
      if (!newAccess) throw new Error('No access in refresh response')
      localStorage.setItem('token', newAccess)
      return newAccess
    })
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })
  return refreshPromise
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original?._retry) {
      try {
        const newToken = await refreshAccessToken()
        original._retry = true
        original.headers = original.headers || {}
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')
      }
    }
    return Promise.reject(error)
  }
)

export function mediaUrl(path?: string | null) {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  if (path.startsWith('/')) return `${API_ORIGIN}${path}`
  return `${API_ORIGIN}/${path}`
}
