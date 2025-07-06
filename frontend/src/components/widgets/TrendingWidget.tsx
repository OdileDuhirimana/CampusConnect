import { Card, Badge } from '../ui'

export default function TrendingWidget() {
  return (
    <Card className="p-5 bg-gradient-to-br from-brand-50 to-white">
      <h3 className="text-sm font-semibold text-ink-900">Trending on Campus</h3>
      <div className="mt-3 space-y-2 text-sm text-ink-600">
        <div className="flex items-center justify-between">
          <span>#FinalsWeek</span>
          <Badge variant="neutral">2.3k</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>#CareerFair</span>
          <Badge variant="neutral">1.1k</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>#DormLife</span>
          <Badge variant="neutral">840</Badge>
        </div>
      </div>
    </Card>
  )
}
