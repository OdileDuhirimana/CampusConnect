import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { commentPost, createPost, fetchPosts, likePost, unlikePost } from '../store/postsSlice'
import type { Post } from '../store/postsSlice'
import type { RootState } from '../store'
import { mediaUrl } from '../api'
import { useToast } from '../components/ToastProvider'
import Skeleton from '../components/Skeleton'
import { addNotification } from '../store/notificationsSlice'
import Avatar from '../components/Avatar'
import { Button, Card, Textarea, Input, EmptyState } from '../components/ui'

export default function Feed() {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((s: RootState) => s.posts)
  const { token } = useAppSelector((s: RootState) => s.auth)
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [commentMap, setCommentMap] = useState<Record<number, string>>({})
  const toast = useToast()

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const onCreate = async () => {
    if (!token) {
      toast.add({ type: 'info', message: 'Login to post' })
      return
    }
    if (!content.trim()) return
    await dispatch(createPost({ content, file }))
    toast.add({ type: 'success', message: 'Post created' })
    dispatch(addNotification({ title: 'New post', message: 'Your post is live' }))
    setContent('')
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }

  const onLike = async (id: number) => {
    if (!token) { toast.add({ type: 'info', message: 'Login to like' }); return }
    await dispatch(likePost(id))
    toast.add({ type: 'success', message: 'Liked post' })
    dispatch(addNotification({ title: 'You liked a post' }))
  }

  const onUnlike = async (id: number) => {
    if (!token) { toast.add({ type: 'info', message: 'Login to unlike' }); return }
    await dispatch(unlikePost(id))
    toast.add({ type: 'info', message: 'Unliked post' })
  }

  const onComment = async (id: number) => {
    if (!token) { toast.add({ type: 'info', message: 'Login to comment' }); return }
    const text = (commentMap[id] || '').trim()
    if (!text) return
    await dispatch(commentPost({ postId: id, content: text }))
    toast.add({ type: 'success', message: 'Comment added' })
    dispatch(addNotification({ title: 'New comment', message: 'Your comment was added' }))
    setCommentMap((m) => ({ ...m, [id]: '' }))
  }

  const onSelectFile = (f?: File | null) => {
    if (preview) URL.revokeObjectURL(preview)
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    } else {
      setFile(null)
      setPreview(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-5 bg-gradient-to-br from-brand-50 to-white">
          <h2 className="font-semibold text-ink-900 mb-2">Share something with campus</h2>
          <Textarea rows={3} placeholder="What's happening on campus?" value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
            <Input type="file" accept="image/*" onChange={(e) => onSelectFile(e.target.files?.[0] || null)} />
            <Button aria-label="Create post" onClick={onCreate} type="button">Post</Button>
          </div>
          {preview && (
            <div className="mt-3 flex items-center gap-3">
              <img src={preview} alt="Preview" className="h-20 w-20 rounded-xl object-cover border" />
              <button
                className="text-sm text-danger hover:text-red-700"
                type="button"
                onClick={() => onSelectFile(null)}
              >
                Remove image
              </button>
            </div>
          )}
        </Card>

        <div className="space-y-3">
        {status === 'loading' && (
          <div className="space-y-3">
            <Card className="p-5 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-48 w-full" />
            </Card>
            <Card className="p-5 space-y-3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          </div>
        )}
        {status === 'failed' && (
          <EmptyState
            title="Failed to load posts"
            description={error || 'Please try again.'}
          />
        )}
        {status === 'succeeded' && items.length === 0 && (
          <EmptyState title="No posts yet" description="Be the first to post!" />
        )}
        {items.map((p: Post) => (
          <Card key={p.id} className="p-5 hover:shadow-soft transition">
            <div className="text-sm text-ink-600 flex items-center gap-2">
              <Avatar name={p.user} />
              <div><span className="font-medium text-ink-900">{p.user}</span> • {new Date(p.created_at).toLocaleString()}</div>
            </div>
            <div className="mt-2 whitespace-pre-wrap">{p.content}</div>
            {p.media && (
              <img src={mediaUrl(p.media)} alt="post" className="mt-3 max-h-80 object-contain rounded-xl border border-border" />
            )}
            <div className="flex items-center gap-3 text-sm text-ink-600 mt-3">
              <span>{p.likes_count} likes</span>
              <button aria-label="Like" className="text-brand-600" onClick={() => onLike(p.id)} type="button">Like</button>
              <button aria-label="Unlike" className="text-ink-600" onClick={() => onUnlike(p.id)} type="button">Unlike</button>
            </div>
            <div className="mt-3 space-y-2">
              {p.comments?.map((c) => (
                <div key={c.id} className="text-sm"><b>{c.user}</b>: {c.content}</div>
              ))}
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  placeholder="Write a comment"
                  value={commentMap[p.id] || ''}
                  onChange={(e) => setCommentMap((m) => ({ ...m, [p.id]: e.target.value }))}
                />
                <Button aria-label="Send comment" className="px-3" size="sm" onClick={() => onComment(p.id)} type="button">Send</Button>
              </div>
            </div>
          </Card>
        ))}
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink-900">Campus Highlights</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-600">
            <li>🎓 Midterm week tips and resources</li>
            <li>🏀 Intramurals sign‑ups closing Friday</li>
            <li>📚 Library hours extended till 2 AM</li>
          </ul>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-accent-50 to-white">
          <h3 className="text-sm font-semibold text-ink-900">Upcoming Events</h3>
          <p className="mt-2 text-sm text-ink-600">Check out the latest campus events and RSVP.</p>
          <Button className="mt-4" variant="outline">Explore Events</Button>
        </Card>
      </div>
    </div>
  )
}
