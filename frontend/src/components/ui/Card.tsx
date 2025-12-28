import type { ReactNode } from 'react'

export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-surface shadow-card transition hover:shadow-soft ring-1 ring-transparent hover:ring-brand-100 ${className}`}>
      {children}
    </div>
  )
}
