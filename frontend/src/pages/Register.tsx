import type { FormEvent } from 'react'
import { useState } from 'react'
import { useAppDispatch } from '../hooks'
import { register } from '../store/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Card } from '../components/ui'
import AuthLayout from '../components/layout/AuthLayout'

export default function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await dispatch(register({ username, email, password })).unwrap()
      navigate('/login')
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
    }
  }

  return (
    <AuthLayout title="Create account" subtitle="Join CampusConnect in minutes.">
      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Input label="Username" placeholder="Pick a username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" placeholder="Create a password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full" type="submit">Register</Button>
          <p className="text-sm text-gray-600">
            Have an account? <Link to="/login" className="text-blue-600">Login</Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  )
}
