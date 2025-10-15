import { Card, Button, Badge, Input } from '../components/ui'
import { useState } from 'react'

const suggestions = [
  { name: 'Maya Rivera', mutuals: 4, major: 'Computer Science' },
  { name: 'Owen Park', mutuals: 2, major: 'Business' },
  { name: 'Elena Cho', mutuals: 6, major: 'Biology' },
]

const requests = [
  { name: 'Kai Patel', mutuals: 3 },
  { name: 'Zoe Harper', mutuals: 1 },
]

export default function Friends() {
  const [query, setQuery] = useState('')
  const filtered = suggestions.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card className="p-6 bg-gradient-to-br from-brand-50 via-white to-accent-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">Connections</h1>
            <p className="text-sm text-ink-600">Meet classmates and expand your network.</p>
          </div>
          <Button>Find Friends</Button>
        </div>
      </Card>

      <Input placeholder="Search students..." value={query} onChange={(e) => setQuery(e.target.value)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-900">Friend Requests</h2>
          <div className="mt-3 space-y-3">
            {requests.map((r) => (
              <div key={r.name} className="flex items-center justify-between text-sm text-ink-600">
                <div>
                  <div className="font-medium text-ink-900">{r.name}</div>
                  <div className="text-xs">{r.mutuals} mutuals</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Accept</Button>
                  <Button size="sm" variant="outline">Ignore</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-900">Suggestions</h2>
          <div className="mt-3 space-y-3">
            {filtered.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm text-ink-600">
                <div>
                  <div className="font-medium text-ink-900">{s.name}</div>
                  <div className="text-xs">{s.major} · {s.mutuals} mutuals</div>
                </div>
                <Badge variant="brand">Connect</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
