import { useAppSelector } from '../hooks'
import { Button, Card, Badge } from '../components/ui'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAppSelector((s) => s.auth)
  const { items: posts } = useAppSelector((s) => s.posts)
  const { items: events } = useAppSelector((s) => s.events)

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-brand-50 via-white to-accent-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">Welcome back{user ? `, ${user.username}` : ''}</h1>
            <p className="mt-1 text-sm text-ink-600">Your campus activity at a glance.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="brand">Student Life</Badge>
              <Badge variant="accent">Campus Events</Badge>
              <Badge variant="neutral">Study Groups</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/chat"><Button variant="outline">Go to Messages</Button></Link>
            <Button>Post Update</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-sm text-ink-600">Total Posts</div>
          <div className="text-2xl font-semibold text-ink-900 mt-1">{posts.length}</div>
          <div className="mt-2 text-xs text-ink-500">+3 this week</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-ink-600">Upcoming Events</div>
          <div className="text-2xl font-semibold text-ink-900 mt-1">{events.length}</div>
          <div className="mt-2 text-xs text-ink-500">2 RSVPs pending</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-ink-600">Notifications</div>
          <div className="text-2xl font-semibold text-ink-900 mt-1">3</div>
          <div className="mt-2 text-xs text-ink-500">1 unread</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink-900">What’s happening this week</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-600">
            <li>📌 Career fair in the student union</li>
            <li>🎭 Drama club auditions — Friday</li>
            <li>🏀 Intramural finals — Saturday</li>
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-900">Recommended for you</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink-600">
            <div className="flex items-center justify-between">
              <span>Study Group: CS101</span>
              <Badge variant="brand">Join</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Photography Club</span>
              <Badge variant="accent">New</Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink-900">Campus Map Quick Links</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="neutral">Library</Badge>
          <Badge variant="neutral">Dining Hall</Badge>
          <Badge variant="neutral">Student Center</Badge>
          <Badge variant="neutral">Gym</Badge>
        </div>
      </Card>
    </div>
  )
}
