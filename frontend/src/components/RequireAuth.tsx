import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../hooks'
import type { ReactElement } from 'react'
import { Card } from './ui'

export default function RequireAuth({ children }: { children: ReactElement }) {
  const { token, user } = useAppSelector((s) => s.auth)
  const location = useLocation()
  if (token && !user) {
    return (
      <div className="max-w-md mx-auto p-4">
        <Card className="p-6 text-center">Loading your account…</Card>
      </div>
    )
  }
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}
