import { Card, Button, Badge } from '../components/ui'

const groups = [
  { id: 'cs101', name: 'CS101 Study Group', desc: 'Weekly study meetups before exams.', tag: 'Class' },
  { id: 'dorm-b', name: 'Dorm B Floor Chat', desc: 'Announcements and hangouts.', tag: 'Dorm' },
  { id: 'startup', name: 'Startup Builders', desc: 'Pitch nights and hack sessions.', tag: 'Club' },
]

export default function Groups() {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card className="p-6 bg-gradient-to-br from-brand-50 via-white to-mint-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">Groups & Communities</h1>
            <p className="text-sm text-ink-600">Join dorms, classes, and interest groups.</p>
          </div>
          <Button>Create Group</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g) => (
          <Card key={g.id} className="p-5 hover:shadow-soft transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink-900">{g.name}</h3>
              <Badge variant="brand">{g.tag}</Badge>
            </div>
            <p className="mt-2 text-sm text-ink-600">{g.desc}</p>
            <Button className="mt-4" variant="outline">Join</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
