import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../api'

export interface Post {
  id: number
  user: string
  content: string
  media?: string | null
  created_at: string
  likes_count: number
  comments?: { id: number; user: string; content: string; created_at: string }[]
}

interface PostsState {
  items: Post[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: PostsState = {
  items: [],
  status: 'idle',
}

export const fetchPosts = createAsyncThunk('posts/fetch', async () => {
  const { data } = await api.get<Post[]>('/posts/')
  return data
})

export const createPost = createAsyncThunk(
  'posts/create',
  async (payload: { content: string; file?: File | null }) => {
    const form = new FormData()
    form.append('content', payload.content)
    if (payload.file) form.append('media', payload.file)
    const { data } = await api.post<Post>('/posts/', form)
    return data
  }
)

export const commentPost = createAsyncThunk(
  'posts/comment',
  async (payload: { postId: number; content: string }) => {
    const { data } = await api.post(`/posts/${payload.postId}/comment/`, { content: payload.content })
    return { postId: payload.postId, comment: data as { id: number; user: string; content: string; created_at: string } }
  }
)

export const likePost = createAsyncThunk('posts/like', async (postId: number) => {
  await api.post(`/posts/${postId}/like/`)
  return { postId }
})

export const unlikePost = createAsyncThunk('posts/unlike', async (postId: number) => {
  await api.post(`/posts/${postId}/unlike/`)
  return { postId }
})

const slice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (s) => {
        s.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.items = a.payload
      })
      .addCase(fetchPosts.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      .addCase(createPost.fulfilled, (s, a) => {
        s.items.unshift(a.payload)
      })
      .addCase(commentPost.fulfilled, (s, a) => {
        const p = s.items.find((x) => x.id === a.payload.postId) as any
        if (p) {
          p.comments = p.comments || []
          p.comments.push(a.payload.comment)
        }
      })
      .addCase(likePost.fulfilled, (s, a) => {
        const p = s.items.find((x) => x.id === a.payload.postId)
        if (p) p.likes_count += 1
      })
      .addCase(unlikePost.fulfilled, (s, a) => {
        const p = s.items.find((x) => x.id === a.payload.postId)
        if (p && p.likes_count > 0) p.likes_count -= 1
      })
  },
})

export default slice.reducer
