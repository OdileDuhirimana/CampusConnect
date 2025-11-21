import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchMe } from '../store/authSlice'

export default function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const { token, user } = useAppSelector((s) => s.auth)

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe())
    }
  }, [token, user, dispatch])

  return <>{children}</>
}
