import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'

export type NotificationItem = {
  id: string
  title: string
  message?: string
  time: number
  read?: boolean
}

interface NotificationsState {
  items: NotificationItem[]
}

const initialState: NotificationsState = {
  items: [],
}

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: {
      prepare: (payload: { title: string; message?: string }) => ({
        payload: { id: nanoid(), time: Date.now(), ...payload },
      }),
      reducer(state, action: PayloadAction<NotificationItem>) {
        state.items.unshift(action.payload)
      },
    },
    markRead(state, action: PayloadAction<string>) {
      const n = state.items.find((x) => x.id === action.payload)
      if (n) n.read = true
    },
    clearAll(state) {
      state.items = []
    },
  },
})

export const { addNotification, markRead, clearAll } = slice.actions
export default slice.reducer
