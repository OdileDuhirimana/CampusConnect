import type { ReactNode } from 'react'

export default function EmptyState({
  title,
  description,
  action,
  className = '',
}: {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center ${className}`}>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
