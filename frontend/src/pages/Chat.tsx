import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { createRoom, fetchMessages, fetchRooms, joinRoom, leaveRoom, sendMessage, setActiveRoom } from '../store/chatSlice'
import type { RootState } from '../store'
import { useToast } from '../components/ToastProvider'
import Skeleton from '../components/Skeleton'
import { addNotification } from '../store/notificationsSlice'
import { API_ORIGIN } from '../api'
import Avatar from '../components/Avatar'
import { Button, Card, Input, EmptyState, Badge, Modal } from '../components/ui'

export default function Chat() {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { rooms, messagesByRoom, activeRoomId, status, error } = useAppSelector((s: RootState) => s.chat)
  const { user, token } = useAppSelector((s: RootState) => s.auth)

  const [roomName, setRoomName] = useState('')
  const [mode, setMode] = useState<'dm' | 'group'>('dm')
  const [msg, setMsg] = useState('')
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [roomQuery, setRoomQuery] = useState('')
  const [newMessageOpen, setNewMessageOpen] = useState(false)
  const [lastSeen, setLastSeen] = useState<Record<number, number>>({})

  const suggestedPeers = ['Jordan Lee', 'Avery Chen', 'Sam Patel', 'Riley Brooks', 'Taylor Kim']

  const recentContacts = useMemo(() => {
    const names = new Set<string>()
    Object.values(messagesByRoom).forEach((msgs) => {
      msgs.slice(-5).forEach((m) => names.add(m.sender.username))
    })
    return Array.from(names).slice(0, 5)
  }, [messagesByRoom])

  const modalSuggestions = useMemo(() => {
    const all = Array.from(new Set([...suggestedPeers, ...recentContacts]))
    return all.filter((n) => n.toLowerCase().includes(roomName.toLowerCase()))
  }, [suggestedPeers, recentContacts, roomName])

  useEffect(() => {
    if (activeRoomId) {
      setLastSeen((s) => ({ ...s, [activeRoomId]: Date.now() }))
    }
  }, [activeRoomId])

  const getUnreadCount = (roomId: number) => {
    const last = lastSeen[roomId] || 0
    const msgs = messagesByRoom[roomId] || []
    return msgs.filter((m) => new Date(m.created_at).getTime() > last).length
  }

  useEffect(() => {
    if (!token) return
    dispatch(fetchRooms())
  }, [dispatch, token])

  useEffect(() => {
    if (!token) return
    if (activeRoomId) dispatch(fetchMessages(activeRoomId))
  }, [activeRoomId, dispatch, token])

  // Optional WebSocket live updates if backend supports Channels at /ws/chat/{id}/
  useEffect(() => {
    try {
      ws?.close()
    } catch {}
    if (!activeRoomId || !token) return
    const wsUrl = API_ORIGIN.replace('http', 'ws') + `/ws/chat/${activeRoomId}/`
    let socket: WebSocket | null = null
    try {
      socket = new WebSocket(wsUrl)
      setWs(socket)
      socket.onmessage = () => {
        // On any message, refetch to stay consistent with server ordering
        dispatch(fetchMessages(activeRoomId))
      }
    } catch {}
    return () => {
      try { socket?.close() } catch {}
      setWs(null)
    }
  }, [activeRoomId, dispatch, token])

  const activeMessages = useMemo(() => (activeRoomId ? (messagesByRoom[activeRoomId] || []) : []), [messagesByRoom, activeRoomId])

  const onCreateRoom = async () => {
    if (!token) { toast.add({ type: 'info', message: 'Login to create rooms' }); return }
    if (!roomName.trim()) return
    const room = await dispatch(createRoom({ name: roomName, is_group: mode === 'group' })).unwrap()
    dispatch(setActiveRoom(room.id))
    setRoomName('')
    toast.add({ type: 'success', message: `Room "${room.name}" created` })
  }

  const onJoin = async (id: number) => {
    if (!token) { toast.add({ type: 'info', message: 'Login to join rooms' }); return }
    await dispatch(joinRoom(id))
    dispatch(setActiveRoom(id))
    toast.add({ type: 'success', message: 'Joined room' })
  }

  const onLeave = async (id: number) => {
    if (!token) { toast.add({ type: 'info', message: 'Login to leave rooms' }); return }
    await dispatch(leaveRoom(id))
    if (activeRoomId === id) dispatch(setActiveRoom(undefined as any))
    toast.add({ type: 'info', message: 'Left room' })
  }

  const onSend = async () => {
    if (!token) { toast.add({ type: 'info', message: 'Login to send messages' }); return }
    if (!activeRoomId) { toast.add({ type: 'info', message: 'Select a room' }); return }
    const text = msg.trim()
    if (!text) return
    // Prefer WS if connected; fallback to REST
    try {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ text }))
      } else {
        await dispatch(sendMessage({ room: activeRoomId, content: text }))
      }
      setMsg('')
      dispatch(addNotification({ title: 'Message sent', message: text.slice(0, 50) }))
    } catch {
      toast.add({ type: 'error', message: 'Failed to send message' })
    }
  }

  const selfId = user?.id

  const filteredRooms = rooms.filter((r) => r.name.toLowerCase().includes(roomQuery.toLowerCase()))
  const getLastMessage = (roomId: number) => {
    const msgs = messagesByRoom[roomId] || []
    return msgs.length ? msgs[msgs.length - 1] : null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-ink-900">Messages</h2>
          {user && <span className="text-xs text-ink-500">{user.username}</span>}
        </div>
        <Input
          className="mb-3"
          placeholder="Search chats"
          value={roomQuery}
          onChange={(e) => setRoomQuery(e.target.value)}
        />
        <div className="flex gap-2 mb-3">
          <Button size="sm" variant={mode === 'dm' ? 'primary' : 'outline'} onClick={() => setMode('dm')}>Direct</Button>
          <Button size="sm" variant={mode === 'group' ? 'primary' : 'outline'} onClick={() => setMode('group')}>Group</Button>
        </div>
        <div className="flex gap-2 mb-3">
          <Input className="flex-1" placeholder={mode === 'dm' ? 'Start a direct chat' : 'Create a group'} value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <Button onClick={onCreateRoom} size="sm" type="button" aria-label="Create room">Start</Button>
        </div>
        <Button variant="outline" className="w-full mb-4" onClick={() => setNewMessageOpen(true)}>New Message</Button>
        <div className="mb-4">
          <div className="text-xs text-ink-500 mb-2">Quick connect</div>
          <div className="flex flex-wrap gap-2">
            {suggestedPeers.map((name) => (
              <Button
                key={name}
                variant="outline"
                size="sm"
                onClick={() => {
                  setRoomName(name)
                  onCreateRoom()
                }}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>
        {recentContacts.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-ink-500 mb-2">Recent contacts</div>
            <div className="flex flex-wrap gap-2">
              {recentContacts.map((name) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRoomName(name)
                    onCreateRoom()
                  }}
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="divide-y border rounded min-h-[200px]">
          {status === 'loading' && (
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          )}
          {!token && (
            <div className="p-3">
              <EmptyState title="Log in to start chatting" description="Create rooms and message classmates once you're signed in." />
            </div>
          )}
          {status === 'failed' && (
            <div className="p-3">
              <EmptyState title="Failed to load rooms" description={error || 'Please try again.'} />
            </div>
          )}
          {status !== 'loading' && filteredRooms.length === 0 && (
            <div className="p-3 text-sm text-ink-500">No chats yet. Start a new conversation.</div>
          )}
          {filteredRooms.map((r) => {
            const isActive = r.id === activeRoomId
            const isMember = !!r.members.find(m => m.id === user?.id)
            const unread = getUnreadCount(r.id)
            const last = getLastMessage(r.id)
            return (
              <div key={r.id} className={`p-3 text-sm flex items-center justify-between ${isActive ? 'bg-brand-50' : ''}`}>
                <button className="text-left flex-1" onClick={() => dispatch(setActiveRoom(r.id))} type="button" aria-label={`Open room ${r.name}`}>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-ink-500 text-xs truncate">
                    {last ? `${last.sender.username}: ${last.content}` : `Members: ${r.members.length}`}
                  </div>
                </button>
                {unread > 0 && <Badge variant="accent">{unread}</Badge>}
                {isMember ? (
                  <button className="text-xs text-danger" onClick={() => onLeave(r.id)} type="button" aria-label="Leave room">Leave</button>
                ) : (
                  <button className="text-xs text-brand-600" onClick={() => onJoin(r.id)} type="button" aria-label="Join room">Join</button>
                )}
              </div>
            )
          })}
        </div>
      </Card>
      <Card className="md:col-span-2 flex flex-col h-[70vh]">
        <div className="border-b px-4 py-2 flex items-center justify-between">
          <div className="font-semibold text-ink-900">{rooms.find(r => r.id === activeRoomId)?.name || 'Select a room'}</div>
          <Badge variant="neutral">Live</Badge>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-2 bg-gradient-to-b from-brand-50/40 to-white">
          {activeMessages.map((m) => (
            <div key={m.id} className={`flex items-end gap-2 text-sm ${m.sender.id === selfId ? 'justify-end' : 'justify-start'}`}>
              {m.sender.id !== selfId && <Avatar name={m.sender.username} size={24} />}
              <div className={`${m.sender.id === selfId ? 'bg-brand-600 text-white' : 'bg-white border border-border text-ink-900'} rounded-2xl px-3 py-2 shadow-soft max-w-[70%]`}>
                <div className="text-xs opacity-80">{m.sender.username} · {new Date(m.created_at).toLocaleTimeString()}</div>
                <div>{m.content}</div>
              </div>
              {m.sender.id === selfId && <Avatar name={m.sender.username} size={24} />}
            </div>
          ))}
          {activeRoomId && activeMessages.length === 0 && (
            <EmptyState title="No messages yet" description="Send the first message to start the conversation." className="bg-transparent border-none" />
          )}
        </div>
        <div className="border-t p-3 flex flex-col gap-2">
          <Input className="flex-1" placeholder={activeRoomId ? 'Type a message' : 'Select a room to start chatting'} value={msg} onChange={(e) => setMsg(e.target.value)} />
          <div className="flex items-center justify-between">
            <div className="text-xs text-ink-500">{msg.trim() ? 'You are typing…' : ' '}</div>
            <Button onClick={onSend} type="button" aria-label="Send message">Send</Button>
          </div>
        </div>
      </Card>

      <Modal
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
        title="Start a new conversation"
        footer={(
          <>
            <Button variant="outline" onClick={() => setNewMessageOpen(false)}>Cancel</Button>
            <Button onClick={() => { onCreateRoom(); setNewMessageOpen(false) }}>Start</Button>
          </>
        )}
      >
        <div className="space-y-3">
          <Input placeholder="Search classmates" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <div className="flex flex-col gap-2">
            {modalSuggestions.map((name) => (
              <button
                key={name}
                type="button"
                className="flex items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm text-ink-700 hover:bg-brand-50"
                onClick={() => setRoomName(name)}
              >
                <Avatar name={name} size={28} />
                <div className="flex-1 text-left">{name}</div>
                <Badge variant="neutral">Student</Badge>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
