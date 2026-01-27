import { configureStore } from '@reduxjs/toolkit'
import authReducer from './store/authSlice.ts'
import postsReducer from './store/postsSlice.ts'
import eventsReducer from './store/eventsSlice.ts'
import chatReducer from './store/chatSlice.ts'
import notificationsReducer from './store/notificationsSlice.ts'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    events: eventsReducer,
    chat: chatReducer,
    notifications: notificationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
