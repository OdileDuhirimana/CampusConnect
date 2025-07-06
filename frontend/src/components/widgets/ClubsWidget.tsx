import { Card, Badge } from '../ui'

export default function ClubsWidget() {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-ink-900">Top Clubs</h3>
      <div className="mt-3 space-y-3 text-sm text-ink-600">
        <div className="flex items-center justify-between">
          <span>Photography Club</span>
          <Badge variant="accent">Join</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Robotics Society</span>
          <Badge variant="brand">Popular</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>Dance Crew</span>
          <Badge variant="neutral">New</Badge>
        </div>
      </div>
    </Card>
  )
}
