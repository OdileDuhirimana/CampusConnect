export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center bg-white border border-border rounded-2xl p-6 shadow-card max-w-md">
        <h1 className="text-2xl font-semibold text-ink-900">404 — Page Not Found</h1>
        <p className="text-ink-600 mt-2">The page you’re looking for doesn’t exist.</p>
      </div>
    </div>
  )
}
