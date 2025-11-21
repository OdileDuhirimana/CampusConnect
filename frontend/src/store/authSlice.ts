import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../api'

interface User { id: number; username: string; email: string }
interface AuthState {
  user: User | null
  token: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  status: 'idle',
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { username: string; password: string }) => {
    const { data } = await api.post('/auth/login/', payload)
    if (data?.access) localStorage.setItem('token', data.access)
    if (data?.refresh) localStorage.setItem('refresh', data.refresh)
    return data.access as string
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { username: string; email: string; password: string }) => {
    const { data } = await api.post('/auth/register/', payload)
    return data as User
  }
)

export const fetchMe = createAsyncThunk('auth/me', async () => {
  const { data } = await api.get('/auth/me/')
  return data as User
})

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('refresh')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.status = 'loading'
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.token = a.payload
      })
      .addCase(login.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      .addCase(register.fulfilled, (s, a) => {
        s.user = a.payload
      })
      .addCase(fetchMe.pending, (s) => {
        s.status = 'loading'
      })
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload
        s.status = 'succeeded'
      })
      .addCase(fetchMe.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
  },
})

export const { logout } = slice.actions
export default slice.reducer
