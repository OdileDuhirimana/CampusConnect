import { useAppSelector } from '../hooks'
import { Card } from '../components/ui'

export default function Settings() {
  const { user, token } = useAppSelector((s) => s.auth)
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-6">
        <h1 className="text-xl font-semibold">Settings</h1>
        {!user ? (
          <p className="mt-2 text-sm text-gray-600">Please log in to manage your settings.</p>
        ) : (
          <div className="mt-4 space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-gray-500">Username</div>
                <div className="font-medium">{user.username}</div>
              </div>
              <div>
                <div className="text-gray-500">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
            </div>
            <div className="text-gray-500">Auth Token</div>
            <div className="font-mono break-all bg-gray-50 border rounded p-2 text-xs">{token || 'No token'}</div>
            <p className="text-gray-600">More settings can be added here (password change, notifications preferences, privacy controls).</p>
          </div>
        )}
      </Card>
    </div>
  )
}
