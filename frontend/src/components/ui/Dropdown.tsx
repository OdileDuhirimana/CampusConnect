import type { ReactNode } from 'react'

export default function Dropdown({
  open,
  anchor,
  children,
}: {
  open: boolean
  anchor: ReactNode
  children: ReactNode
}) {
  return (
    <div className="relative inline-flex">
      {anchor}
      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-white shadow-card animate-scale-in">
          {children}
        </div>
      )}
    </div>
  )
}
