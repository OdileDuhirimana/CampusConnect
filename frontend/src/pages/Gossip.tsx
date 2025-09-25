import { useMemo, useState } from 'react'
import { Badge, Button, Card, EmptyState, Input, Modal, Textarea } from '../components/ui'

type Whisper = {
  id: string
  body: string
  time: number
  likes: number
  replies: number
  reported?: boolean
}

const seed: Whisper[] = [
  { id: 'w1', body: 'Someone just got engaged at the library 💍👀', time: Date.now() - 1000 * 60 * 22, likes: 124, replies: 18 },
  { id: 'w2', body: 'Dorm B threw a surprise concert last night 🎸', time: Date.now() - 1000 * 60 * 90, likes: 86, replies: 9 },
  { id: 'w3', body: 'Heard the cafeteria is bringing back the taco bar 🌮', time: Date.now() - 1000 * 60 * 180, likes: 54, replies: 6 },
]

export default function Gossip() {
  const [whispers, setWhispers] = useState<Whisper[]>(seed)
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')

  const filtered = whispers.filter((w) => w.body.toLowerCase().includes(query.toLowerCase()))
  const trending = useMemo(() => [...whispers].sort((a, b) => b.likes - a.likes).slice(0, 3), [whispers])
  const queue = whispers.filter((w) => w.reported)

  const onPost = () => {
    if (!text.trim()) return
    const next: Whisper = {
      id: `w${Date.now()}`,
      body: text.trim(),
      time: Date.now(),
      likes: 0,
      replies: 0,
    }
    setWhispers((prev) => [next, ...prev])
    setText('')
    setOpen(false)
  }

  const onReport = (id: string) => {
    setWhispers((prev) => prev.map((w) => (w.id === id ? { ...w, reported: true } : w)))
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-6 bg-gradient-to-br from-ink-900 via-ink-700 to-accent-500 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-white/70">Campus Whisper</div>
              <h1 className="text-2xl font-semibold">Spill the tea, stay anonymous.</h1>
              <p className="mt-1 text-sm text-white/80">Share rumors, campus buzz, and fun moments responsibly.</p>
            </div>
            <Button onClick={() => setOpen(true)} className="bg-white text-ink-900">Submit a Whisper</Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-ink-900">Community rules</div>
              <p className="text-xs text-ink-600">No hate, no harassment, no doxxing. Reports are reviewed.</p>
            </div>
            <Badge variant="warning">Moderated</Badge>
          </div>
        </Card>

        <Input placeholder="Search whispers..." value={query} onChange={(e) => setQuery(e.target.value)} />

        <div className="space-y-3">
          {filtered.length === 0 && (
            <EmptyState title="No whispers found" description="Try a different search." />
          )}
          {filtered.map((w, idx) => (
            <Card key={w.id} className="p-5">
              <div className="flex items-center justify-between text-xs text-ink-500">
                <span>Student #{(idx + 245).toString().padStart(3, '0')}</span>
                <span>{new Date(w.time).toLocaleTimeString()}</span>
              </div>
              <div className="mt-2 text-ink-900">{w.body}</div>
              <div className="mt-3 flex items-center gap-3 text-sm text-ink-600">
                <button className="text-accent-500" type="button">❤️ {w.likes}</button>
                <button className="text-ink-600" type="button">💬 {w.replies}</button>
                <button className="text-danger" type="button" onClick={() => onReport(w.id)}>Report</button>
                {w.reported && <Badge variant="danger">Reported</Badge>}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink-900">Trending Whispers</h3>
          <div className="mt-3 space-y-2 text-sm text-ink-600">
            {trending.map((w) => (
              <div key={w.id} className="flex items-center justify-between">
                <span className="truncate">{w.body}</span>
                <Badge variant="accent">{w.likes}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink-900">Moderation Queue</h3>
          <div className="mt-3 space-y-2 text-sm text-ink-600">
            {queue.length === 0 && <div>No reports yet.</div>}
            {queue.map((w) => (
              <div key={w.id} className="flex items-center justify-between">
                <span className="truncate">{w.body}</span>
                <Badge variant="danger">Flagged</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Submit a Whisper"
        footer={(
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onPost}>Post</Button>
          </>
        )}
      >
        <div className="space-y-3">
          <Textarea rows={4} placeholder="Share responsibly..." value={text} onChange={(e) => setText(e.target.value)} />
          <div className="text-xs text-ink-500">Be kind. Posts are anonymous but moderated.</div>
        </div>
      </Modal>
    </div>
  )
}
