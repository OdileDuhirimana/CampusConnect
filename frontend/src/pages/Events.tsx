import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { createEvent, fetchEvents, rsvpEvent, type EventItem } from '../store/eventsSlice'
import type { RootState } from '../store'
import { useToast } from '../components/ToastProvider'
import Skeleton from '../components/Skeleton'
import { addNotification } from '../store/notificationsSlice'
import { Button, Card, Input, Textarea, EmptyState, Badge } from '../components/ui'

export default function Events() {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((s: RootState) => s.events)
  const { token } = useAppSelector((s: RootState) => s.auth)
  const { user } = useAppSelector((s: RootState) => s.auth)
  const toast = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [location, setLocation] = useState('')
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming')

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

  const filteredEvents = useMemo(() => {
    const now = new Date().getTime()
    if (filter === 'all') return items
    if (filter === 'past') return items.filter((e) => new Date(e.end_time).getTime() < now)
    return items.filter((e) => new Date(e.end_time).getTime() >= now)
  }, [items, filter])

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <Card className="p-6 bg-gradient-to-br from-brand-50 via-white to-accent-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">Campus Events</h1>
            <p className="mt-1 text-sm text-ink-600">Discover meetups, clubs, and student‑led activities.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">My RSVPs</Button>
            <Button>Create Event</Button>
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-3 bg-gradient-to-br from-brand-50 to-white">
        <h2 className="font-semibold text-ink-900">Create an event</h2>
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

      <div className="flex flex-wrap gap-2">
        <Button variant={filter === 'upcoming' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('upcoming')}>Upcoming</Button>
        <Button variant={filter === 'past' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('past')}>Past</Button>
        <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
      </div>

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
        {status === 'failed' && (
          <EmptyState title="Failed to load events" description={error || 'Please try again.'} />
        )}
        {status === 'succeeded' && items.length === 0 && (
          <EmptyState title="No events yet" description="Create the first event to get started." />
        )}
        {filteredEvents.map((ev: EventItem) => (
          <Card key={ev.id} className="p-5 hover:shadow-soft transition">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white px-3 py-2 text-center">
                    <div className="text-xs text-ink-500">{new Date(ev.start_time).toLocaleString(undefined, { month: 'short' })}</div>
                    <div className="text-lg font-semibold text-ink-900">{new Date(ev.start_time).getDate()}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{ev.title}</h3>
                    <div className="text-sm text-ink-600">{new Date(ev.start_time).toLocaleString()} → {new Date(ev.end_time).toLocaleString()}</div>
                    <div className="text-sm text-ink-600">{ev.location}</div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="brand">Event</Badge>
                  <Badge variant="accent">Club</Badge>
                  <Badge variant="neutral">Class</Badge>
                </div>
                {user && ev.participants?.some(p => p.user === user.username) && (
                  <div className="mt-2 inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                    Your RSVP: {ev.participants?.find(p => p.user === user.username)?.rsvp_status || 'maybe'}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-success text-success" onClick={() => onRSVP(ev.id, 'yes')} type="button">Going</Button>
                <Button size="sm" variant="outline" className="border-warning text-warning" onClick={() => onRSVP(ev.id, 'maybe')} type="button">Maybe</Button>
                <Button size="sm" variant="outline" className="border-danger text-danger" onClick={() => onRSVP(ev.id, 'no')} type="button">No</Button>
              </div>
            </div>
            {ev.description && <p className="mt-2 whitespace-pre-wrap">{ev.description}</p>}
            <div className="text-sm text-ink-600 mt-2">Participants: {ev.participants?.length ?? 0}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
