import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { createEvent, fetchEvents, rsvpEvent, type EventItem } from '../store/eventsSlice'
import type { RootState } from '../store'
import { useToast } from '../components/ToastProvider'
import Skeleton from '../components/Skeleton'
import { addNotification } from '../store/notificationsSlice'
import { Button, Card, Input, Textarea, EmptyState } from '../components/ui'

export default function Events() {
  const dispatch = useAppDispatch()
  const { items, status } = useAppSelector((s: RootState) => s.events)
  const { token } = useAppSelector((s: RootState) => s.auth)
  const toast = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  const onCreate = async () => {
    if (!token) { toast.add({ type: 'info', message: 'Login to create events' }); return }
    if (!title || !start || !end) { toast.add({ type: 'error', message: 'Title, start and end are required' }); return }
    await dispatch(createEvent({ title, description, start_time: start, end_time: end, location }))
    toast.add({ type: 'success', message: 'Event created' })
    dispatch(addNotification({ title: 'Event created', message: title }))
    setTitle(''); setDescription(''); setStart(''); setEnd(''); setLocation('')
  }

  const onRSVP = async (id: number, status: 'yes'|'no'|'maybe') => {
    if (!token) { toast.add({ type: 'info', message: 'Login to RSVP' }); return }
    await dispatch(rsvpEvent({ id, status }))
    toast.add({ type: 'success', message: `RSVP: ${status}` })
    dispatch(addNotification({ title: 'RSVP updated', message: status }))
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Card className="p-4 space-y-3">
        <h2 className="font-semibold text-gray-900">Create Event</h2>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Start" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
          <Input label="End" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <div className="text-right">
          <Button onClick={onCreate}>Create</Button>
        </div>
      </Card>

      <div className="space-y-3">
        {status === 'loading' && (
          <div className="space-y-3">
            <Card className="p-4 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/4" />
            </Card>
            <Card className="p-4 space-y-3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </Card>
          </div>
        )}
        {status === 'succeeded' && items.length === 0 && (
          <EmptyState title="No events yet" description="Create the first event to get started." />
        )}
        {items.map((ev: EventItem) => (
          <Card key={ev.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{ev.title}</h3>
                <div className="text-sm text-gray-600">{new Date(ev.start_time).toLocaleString()} → {new Date(ev.end_time).toLocaleString()}</div>
                <div className="text-sm text-gray-600">{ev.location}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-green-700" onClick={() => onRSVP(ev.id, 'yes')} type="button">Going</Button>
                <Button size="sm" variant="ghost" className="text-yellow-700" onClick={() => onRSVP(ev.id, 'maybe')} type="button">Maybe</Button>
                <Button size="sm" variant="ghost" className="text-red-700" onClick={() => onRSVP(ev.id, 'no')} type="button">No</Button>
              </div>
            </div>
            {ev.description && <p className="mt-2 whitespace-pre-wrap">{ev.description}</p>}
            <div className="text-sm text-gray-600 mt-2">Participants: {ev.participants?.length ?? 0}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
