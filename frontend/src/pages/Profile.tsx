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
        <h1 className="text-xl font-semibold">Profile</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Username</div>
            <div className="font-medium">{user.username}</div>
          </div>
          <div>
            <div className="text-gray-500">Email</div>
            <div className="font-medium">{user.email}</div>
          </div>
          <div>
            <div className="text-gray-500">User ID</div>
            <div className="font-mono">{user.id}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
