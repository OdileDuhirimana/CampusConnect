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
import { Button, Card, Textarea, Input, EmptyState, Badge } from '../components/ui'
import CampusHighlights from '../components/widgets/CampusHighlights'
import ClubsWidget from '../components/widgets/ClubsWidget'
import StudyGroupsWidget from '../components/widgets/StudyGroupsWidget'
import TrendingWidget from '../components/widgets/TrendingWidget'

export default function Feed() {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((s: RootState) => s.posts)
  const { token } = useAppSelector((s: RootState) => s.auth)
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [commentMap, setCommentMap] = useState<Record<number, string>>({})
  const [filter, setFilter] = useState<'all' | 'media' | 'text'>('all')
  const [tagFilter, setTagFilter] = useState<'all' | 'dorm' | 'club' | 'class' | 'event'>('all')
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

  const getTags = (text: string) => {
    const t = text.toLowerCase()
    const tags: Array<'dorm' | 'club' | 'class' | 'event'> = []
    if (t.includes('dorm') || t.includes('room') || t.includes('residence')) tags.push('dorm')
    if (t.includes('club') || t.includes('society')) tags.push('club')
    if (t.includes('class') || t.includes('lecture') || t.includes('exam')) tags.push('class')
    if (t.includes('event') || t.includes('meetup') || t.includes('workshop')) tags.push('event')
    return tags.length ? tags : ['dorm', 'club']
  }

  const filteredItems = items.filter((p) => {
    if (filter === 'media') return !!p.media
    if (filter === 'text') return !p.media
    return true
  })

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-6 bg-gradient-to-br from-brand-50 via-white to-accent-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-ink-900">Campus Feed</h1>
              <p className="mt-1 text-sm text-ink-600">See what’s happening around campus today.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Explore Clubs</Button>
              <Button>New Post</Button>
            </div>
          </div>
        </Card>

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

        <div className="flex flex-wrap gap-2">
          <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'media' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('media')}>Media</Button>
          <Button variant={filter === 'text' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('text')}>Text</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={tagFilter === 'all' ? 'brand' : 'neutral'} className="cursor-pointer" onClick={() => setTagFilter('all')}>All</Badge>
          <Badge variant={tagFilter === 'dorm' ? 'brand' : 'neutral'} className="cursor-pointer" onClick={() => setTagFilter('dorm')}>Dorm</Badge>
          <Badge variant={tagFilter === 'club' ? 'brand' : 'neutral'} className="cursor-pointer" onClick={() => setTagFilter('club')}>Club</Badge>
          <Badge variant={tagFilter === 'class' ? 'brand' : 'neutral'} className="cursor-pointer" onClick={() => setTagFilter('class')}>Class</Badge>
          <Badge variant={tagFilter === 'event' ? 'brand' : 'neutral'} className="cursor-pointer" onClick={() => setTagFilter('event')}>Event</Badge>
        </div>

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
        {filteredItems.map((p: Post) => {
          const tags = getTags(p.content || '')
          if (tagFilter !== 'all' && !tags.includes(tagFilter)) return null
          return (
          <Card key={p.id} className="p-5 hover:shadow-soft transition">
            <div className="text-sm text-ink-600 flex items-center gap-2">
              <Avatar name={p.user} />
              <div><span className="font-medium text-ink-900">{p.user}</span> • {new Date(p.created_at).toLocaleString()}</div>
            </div>
            <div className="mt-2 whitespace-pre-wrap">{p.content}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.includes('dorm') && <Badge variant="brand">Dorm</Badge>}
              {tags.includes('club') && <Badge variant="accent">Club</Badge>}
              {tags.includes('class') && <Badge variant="neutral">Class</Badge>}
              {tags.includes('event') && <Badge variant="brand">Event</Badge>}
            </div>
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
          )
        })}
        </div>
      </div>

      <div className="space-y-4">
        <CampusHighlights />
        <ClubsWidget />
        <StudyGroupsWidget />
        <TrendingWidget />
        <Card className="p-5 bg-gradient-to-br from-accent-50 to-white">
          <h3 className="text-sm font-semibold text-ink-900">Upcoming Events</h3>
          <p className="mt-2 text-sm text-ink-600">Check out the latest campus events and RSVP.</p>
          <Button className="mt-4" variant="outline">Explore Events</Button>
        </Card>
      </div>
    </div>
  )
}
