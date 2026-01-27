import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../api'

export interface EventItem {
  id: number
  title: string
  description: string
  start_time: string
  end_time: string
  location: string
  created_by: string
  created_at: string
  participants?: { id: number; user: string; rsvp_status: string; joined_at: string }[]
}

interface EventsState {
  items: EventItem[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: EventsState = {
  items: [],
  status: 'idle',
}

export const fetchEvents = createAsyncThunk('events/fetch', async () => {
  const { data } = await api.get<EventItem[]>('/events/')
  return data
})

export const createEvent = createAsyncThunk(
  'events/create',
  async (payload: { title: string; description?: string; start_time: string; end_time: string; location?: string }) => {
    const { data } = await api.post<EventItem>('/events/', payload)
    return data
  }
)

export const rsvpEvent = createAsyncThunk(
  'events/rsvp',
  async (payload: { id: number; status: 'yes' | 'no' | 'maybe' }) => {
    const { data } = await api.post(`/events/${payload.id}/rsvp/`, { status: payload.status })
    return { id: payload.id, participant: data as { id: number; user: string; rsvp_status: string; joined_at: string } }
  }
)

const slice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (s) => {
        s.status = 'loading'
      })
      .addCase(fetchEvents.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.items = a.payload
      })
      .addCase(fetchEvents.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      .addCase(createEvent.fulfilled, (s, a) => {
        s.items.unshift(a.payload)
      })
      .addCase(rsvpEvent.fulfilled, (s, a) => {
        const ev = s.items.find((x) => x.id === a.payload.id) as any
        if (ev) {
          ev.participants = ev.participants || []
          const idx = ev.participants.findIndex((p: any) => p.id === a.payload.participant.id)
          if (idx >= 0) ev.participants[idx] = a.payload.participant
          else ev.participants.push(a.payload.participant)
        }
      })
  },
})

export default slice.reducer
