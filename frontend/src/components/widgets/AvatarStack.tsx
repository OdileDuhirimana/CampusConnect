import Avatar from '../Avatar'

export default function AvatarStack({ names }: { names: string[] }) {
  return (
    <div className="flex -space-x-2">
      {names.slice(0, 4).map((n, i) => (
        <div key={n + i} className="border-2 border-white rounded-full">
          <Avatar name={n} size={24} />
        </div>
      ))}
      {names.length > 4 && (
        <div className="h-6 w-6 rounded-full bg-gray-100 text-xs text-ink-600 flex items-center justify-center border-2 border-white">
          +{names.length - 4}
        </div>
      )}
    </div>
  )
}
