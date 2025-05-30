import { useAppSelector } from '../hooks'
import { Card } from '../components/ui'

export default function Profile() {
  const { user } = useAppSelector((s) => s.auth)
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">Please log in to view your profile.</Card>
      </div>
    )
  }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-6">
        <h1 className="text-xl font-semibold text-ink-900">Profile</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-ink-500">Username</div>
            <div className="font-medium text-ink-900">{user.username}</div>
          </div>
          <div>
            <div className="text-ink-500">Email</div>
            <div className="font-medium text-ink-900">{user.email}</div>
          </div>
          <div>
            <div className="text-ink-500">User ID</div>
            <div className="font-mono text-ink-900">{user.id}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
