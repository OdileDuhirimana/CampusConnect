import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { api } from '../api'

export interface Room {
  id: number
  name: string
  is_group: boolean
  created_at: string
  members: { id: number; username: string }[]
}

export interface Message {
  id: number
  room: number
  sender: { id: number; username: string }
  content: string
  created_at: string
}

interface ChatState {
  rooms: Room[]
  messagesByRoom: Record<number, Message[]>
  activeRoomId?: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: ChatState = {
  rooms: [],
  messagesByRoom: {},
  status: 'idle',
}

export const fetchRooms = createAsyncThunk('chat/fetchRooms', async () => {
  const { data } = await api.get<Room[]>('/rooms/')
  return data
})

export const createRoom = createAsyncThunk('chat/createRoom', async (payload: { name: string; is_group?: boolean }) => {
  const { data } = await api.post<Room>('/rooms/', payload)
  return data
})

export const joinRoom = createAsyncThunk('chat/joinRoom', async (roomId: number) => {
  const { data } = await api.post<Room>(`/rooms/${roomId}/join/`)
  return data
})

export const leaveRoom = createAsyncThunk('chat/leaveRoom', async (roomId: number) => {
  const { data } = await api.post<Room>(`/rooms/${roomId}/leave/`)
  return data
})

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (roomId: number) => {
  const { data } = await api.get<Message[]>(`/messages/?room=${roomId}`)
  return { roomId, messages: data }
})

export const sendMessage = createAsyncThunk('chat/sendMessage', async (payload: { room: number; content: string }) => {
  const { data } = await api.post<Message>('/messages/', payload)
  return data
})

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveRoom(state, action) {
      state.activeRoomId = action.payload as number
    },
    addIncomingMessage(state, action: PayloadAction<Message>) {
      const m = action.payload
      const r = m.room
      state.messagesByRoom[r] = state.messagesByRoom[r] || []
      state.messagesByRoom[r].push(m)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (s) => { s.status = 'loading' })
      .addCase(fetchRooms.fulfilled, (s, a) => { s.status = 'succeeded'; s.rooms = a.payload })
      .addCase(fetchRooms.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
      .addCase(createRoom.fulfilled, (s, a) => { s.rooms.unshift(a.payload) })
      .addCase(joinRoom.fulfilled, (s, a) => {
        const idx = s.rooms.findIndex(r => r.id === a.payload.id)
        if (idx >= 0) s.rooms[idx] = a.payload
      })
      .addCase(leaveRoom.fulfilled, (s, a) => {
        const idx = s.rooms.findIndex(r => r.id === a.payload.id)
        if (idx >= 0) s.rooms[idx] = a.payload
      })
      .addCase(fetchMessages.fulfilled, (s, a) => {
        s.messagesByRoom[a.payload.roomId] = a.payload.messages
      })
      .addCase(sendMessage.fulfilled, (s, a) => {
        const r = a.payload.room
        s.messagesByRoom[r] = s.messagesByRoom[r] || []
        s.messagesByRoom[r].push(a.payload)
      })
  }
})

export const { setActiveRoom } = slice.actions
export default slice.reducer
