import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { clearAll, markRead, type NotificationItem } from '../store/notificationsSlice'
import { Dropdown } from './ui'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { items } = useAppSelector((s) => s.notifications)
  const dispatch = useAppDispatch()
  const unread = items.filter((i) => !i.read).length

  const onToggle = () => setOpen((v) => !v)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const onMarkRead = (id: string) => dispatch(markRead(id))
  const onClear = () => dispatch(clearAll())

  return (
    <Dropdown
      open={open}
      anchor={(
        <button
          aria-label="Notifications"
          aria-haspopup="menu"
          aria-expanded={open}
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100"
          onClick={onToggle}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-700">
            <path d="M12 2a7 7 0 00-7 7v3.586l-.707.707A1 1 0 005 15h14a1 1 0 00.707-1.707L19 12.586V9a7 7 0 00-7-7z" />
            <path d="M8 16a4 4 0 008 0H8z" />
          </svg>
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center text-[10px] font-semibold text-white bg-red-600 rounded-full w-4 h-4">
              {unread}
            </span>
          )}
        </button>
      )}
    >
      <div className="w-80">
        <div className="px-3 py-2 border-b flex items-center justify-between">
          <div className="text-sm font-semibold">Notifications</div>
          <button className="text-xs text-gray-600" onClick={onClear} type="button">Clear all</button>
        </div>
        <div className="max-h-80 overflow-auto">
          {items.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No notifications</div>
          ) : (
            items.map((n: NotificationItem) => (
              <div key={n.id} className="px-3 py-2 text-sm hover:bg-gray-50 flex items-start gap-2">
                <div className={`mt-1 w-2 h-2 rounded-full ${n.read ? 'bg-gray-300' : 'bg-blue-600'}`} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{n.title}</div>
                  {n.message && <div className="text-gray-600 text-xs">{n.message}</div>}
                  <div className="text-gray-400 text-[10px]">{new Date(n.time).toLocaleString()}</div>
                </div>
                {!n.read && (
                  <button className="text-xs text-blue-600" onClick={() => onMarkRead(n.id)} type="button">Mark read</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Dropdown>
  )
}
