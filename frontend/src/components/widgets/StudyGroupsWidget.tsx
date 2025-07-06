import { Card, Badge } from '../ui'

export default function StudyGroupsWidget() {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-ink-900">Study Groups</h3>
      <div className="mt-3 space-y-3 text-sm text-ink-600">
        <div className="flex items-center justify-between">
          <span>CS101 Midterm Prep</span>
          <Badge variant="brand">Join</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Bio Lab Review</span>
          <Badge variant="accent">Tonight</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Calculus Study</span>
          <Badge variant="neutral">Open</Badge>
        </div>
      </div>
    </Card>
  )
}
