import { Card, Badge, Button, Input, Modal } from '../components/ui'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const clubs = [
  { id: 'photo', name: 'Photography Club', desc: 'Weekly photo walks and challenges.', tag: 'Arts' },
  { id: 'robotics', name: 'Robotics Society', desc: 'Build, code, and compete.', tag: 'STEM' },
  { id: 'radio', name: 'Campus Radio', desc: 'Host shows and podcast sessions.', tag: 'Media' },
  { id: 'dance', name: 'Dance Crew', desc: 'Workshops, performances, and events.', tag: 'Arts' },
]

export default function Clubs() {
  const [open, setOpen] = useState(false)
  const [clubName, setClubName] = useState('')
  const [clubTag, setClubTag] = useState('')
  const [clubDesc, setClubDesc] = useState('')

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card className="p-6 bg-gradient-to-br from-brand-50 via-white to-citrus-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">Campus Clubs</h1>
            <p className="mt-1 text-sm text-ink-600">Discover communities that match your interests.</p>
          </div>
          <Button onClick={() => setOpen(true)}>Start a Club</Button>
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
            <div className="mt-4 flex gap-2">
              <Link to={`/clubs/${club.id}`}><Button variant="outline">View Club</Button></Link>
              <Button>Join</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create a club"
        footer={(
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Create</Button>
          </>
        )}
      >
        <div className="space-y-3">
          <Input placeholder="Club name" value={clubName} onChange={(e) => setClubName(e.target.value)} />
          <Input placeholder="Category (Arts, STEM...)" value={clubTag} onChange={(e) => setClubTag(e.target.value)} />
          <Input placeholder="Short description" value={clubDesc} onChange={(e) => setClubDesc(e.target.value)} />
        </div>
      </Modal>
    </div>
  )
}
