import Avatar from '../Avatar'

const stories = [
  { name: 'Avery Chen', label: 'Dorm Party' },
  { name: 'Sam Patel', label: 'Study Group' },
  { name: 'Jordan Lee', label: 'Campus Run' },
  { name: 'Riley Brooks', label: 'Club Fair' },
]

export default function StoriesBar() {
  return (
    <div className="flex gap-3 overflow-auto py-2">
      {stories.map((s) => (
        <div key={s.name} className="flex flex-col items-center text-xs text-ink-600 min-w-[64px]">
          <div className="rounded-full p-[2px] bg-gradient-to-br from-brand-500 to-accent-500">
            <div className="rounded-full bg-white p-[2px]">
              <Avatar name={s.name} size={44} />
            </div>
          </div>
          <div className="mt-1 text-center">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
