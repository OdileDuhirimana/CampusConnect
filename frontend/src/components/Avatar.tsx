export default function Avatar({ name, size = 28 }: { name?: string; size?: number }) {
  const initials = (name || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const style = { width: size, height: size }
  return (
    <div
      className="inline-flex items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold shadow-soft"
      style={style}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}
