import type { ReactNode } from 'react'

type Props = {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export default function Modal({ open, title, onClose, children, footer }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        type="button"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Dialog'}
        className="relative z-10 w-full max-w-lg rounded-xl bg-white p-5 shadow-xl"
      >
        {title && <h2 className="text-base font-semibold text-gray-900">{title}</h2>}
        <div className="mt-3 text-sm text-gray-700">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
