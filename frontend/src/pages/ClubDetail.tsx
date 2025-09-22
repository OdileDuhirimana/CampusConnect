import { useParams } from 'react-router-dom'
import { Button, Card, Badge } from '../components/ui'

const clubData: Record<string, { name: string; desc: string; tag: string }> = {
  photo: { name: 'Photography Club', desc: 'Weekly photo walks and challenges.', tag: 'Arts' },
  robotics: { name: 'Robotics Society', desc: 'Build, code, and compete.', tag: 'STEM' },
  radio: { name: 'Campus Radio', desc: 'Host shows and podcast sessions.', tag: 'Media' },
  dance: { name: 'Dance Crew', desc: 'Workshops, performances, and events.', tag: 'Arts' },
}

export default function ClubDetail() {
  const { clubId } = useParams()
  const club = clubData[clubId || '']

  if (!club) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <Card className="p-6">Club not found.</Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <Card className="p-6 bg-gradient-to-br from-brand-50 via-white to-accent-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">{club.name}</h1>
            <p className="mt-1 text-sm text-ink-600">{club.desc}</p>
            <div className="mt-3"><Badge variant="accent">{club.tag}</Badge></div>
          </div>
          <Button>Join Club</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-sm text-ink-600">Members</div>
          <div className="text-2xl font-semibold text-ink-900 mt-1">128</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-ink-600">Events this month</div>
          <div className="text-2xl font-semibold text-ink-900 mt-1">4</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-ink-600">Active admins</div>
          <div className="text-2xl font-semibold text-ink-900 mt-1">3</div>
        </Card>
      </div>
    </div>
  )
}
