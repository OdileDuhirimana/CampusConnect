import { Card, Badge, Button } from '../components/ui'

const clubs = [
  { name: 'Photography Club', desc: 'Weekly photo walks and challenges.', tag: 'Arts' },
  { name: 'Robotics Society', desc: 'Build, code, and compete.', tag: 'STEM' },
  { name: 'Campus Radio', desc: 'Host shows and podcast sessions.', tag: 'Media' },
  { name: 'Dance Crew', desc: 'Workshops, performances, and events.', tag: 'Arts' },
]

export default function Clubs() {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card className="p-6 bg-gradient-to-br from-brand-50 via-white to-accent-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">Campus Clubs</h1>
            <p className="mt-1 text-sm text-ink-600">Discover communities that match your interests.</p>
          </div>
          <Button>Start a Club</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clubs.map((club) => (
          <Card key={club.name} className="p-5 hover:shadow-soft transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink-900">{club.name}</h3>
              <Badge variant="accent">{club.tag}</Badge>
            </div>
            <p className="mt-2 text-sm text-ink-600">{club.desc}</p>
            <Button className="mt-4" variant="outline">Join</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
