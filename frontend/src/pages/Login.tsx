import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchMe, login } from '../store/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '../components/ToastProvider'
import { addNotification } from '../store/notificationsSlice'
import { Button, Input, Card } from '../components/ui'
import AuthLayout from '../components/layout/AuthLayout'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { token, user, status, error } = useAppSelector((s) => s.auth)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()

  useEffect(() => {
    if (token && !user) dispatch(fetchMe())
  }, [token, user, dispatch])

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(login({ username, password })).unwrap()
      toast.add({ type: 'success', message: 'Signed in' })
      dispatch(addNotification({ title: 'Welcome back', message: username }))
    } catch (err: any) {
      toast.add({ type: 'error', message: 'Invalid credentials' })
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue.">
      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4" aria-label="Login form">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="Username"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
          <Button className="w-full" type="submit" isLoading={status === 'loading'}>
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className="text-sm text-gray-600">
            No account? <Link to="/register" className="text-blue-600">Register</Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  )
}
