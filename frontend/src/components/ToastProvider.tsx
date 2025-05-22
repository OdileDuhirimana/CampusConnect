import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type Toast = { id: number; title?: string; message: string; type?: 'info' | 'success' | 'error' }

const ToastContext = createContext<{ add: (t: Omit<Toast, 'id'>) => void } | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const add = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    const toast: Toast = { id, ...t }
    setToasts((prev) => [...prev, toast])
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3500)
  }, [])

  const value = useMemo(() => ({ add }), [add])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`rounded-2xl shadow-card px-4 py-3 w-80 text-sm text-white ${
            t.type === 'success' ? 'bg-success' : t.type === 'error' ? 'bg-danger' : 'bg-ink-900'
          }`}>
            {t.title && <div className="font-semibold mb-0.5">{t.title}</div>}
            <div className="opacity-90">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
