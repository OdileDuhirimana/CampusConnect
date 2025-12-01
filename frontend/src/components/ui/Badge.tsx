import type { ReactNode } from 'react'

type Variant = 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral'

const variantClasses: Record<Variant, string> = {
  brand: 'bg-blue-50 bg-brand-50 text-blue-700 text-brand-700 border-blue-100 border-brand-100',
  accent: 'bg-orange-50 bg-accent-50 text-orange-700 text-accent-700 border-orange-100 border-accent-100',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-red-50 text-red-700 border-red-100',
  neutral: 'bg-gray-50 text-gray-700 text-ink-600 border-gray-200 border-border',
}

export default function Badge({
  children,
  variant = 'neutral',
  className = '',
  onClick,
}: {
  children: ReactNode
  variant?: Variant
  className?: string
  onClick?: () => void
}) {
  const base = `inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition hover:-translate-y-[1px] ${variantClasses[variant]} ${className}`
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400`}>
        {children}
      </button>
    )
  }
  return (
    <span className={base}>
      {children}
    </span>
  )
}
