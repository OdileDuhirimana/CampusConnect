import { Card } from '../ui'

export default function CampusHighlights() {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-ink-900">Campus Highlights</h3>
      <ul className="mt-3 space-y-2 text-sm text-ink-600">
        <li>🎓 Midterm week tips and resources</li>
        <li>🏀 Intramurals sign‑ups closing Friday</li>
        <li>📚 Library hours extended till 2 AM</li>
      </ul>
    </Card>
  )
}
