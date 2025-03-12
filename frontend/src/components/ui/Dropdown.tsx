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
        <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
          {children}
        </div>
      )}
    </div>
  )
}
