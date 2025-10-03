import { Card, Button } from '../ui'
import { useState } from 'react'

export default function PollsCard() {
  const [vote, setVote] = useState<string | null>(null)
  return (
    <Card className="p-5">
      <div className="text-sm font-semibold text-ink-900">Daily Poll</div>
      <div className="mt-2 text-sm text-ink-600">Best campus coffee spot?</div>
      <div className="mt-3 space-y-2">
        {['Library Cafe', 'Student Union', 'Dorm Espresso', 'Main Quad Cart'].map((o) => (
          <Button
            key={o}
            variant={vote === o ? 'primary' : 'outline'}
            className="w-full justify-start"
            onClick={() => setVote(o)}
          >
            {o}
          </Button>
        ))}
      </div>
    </Card>
  )
}
