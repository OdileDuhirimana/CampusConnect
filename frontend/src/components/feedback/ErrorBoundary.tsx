import type { ReactNode } from 'react'
import { Component } from 'react'
import { Card } from '../ui'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-md text-center">
            <h1 className="text-lg font-semibold text-gray-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-gray-600">Try refreshing the page. If the issue persists, contact support.</p>
            <button
              className="mt-4 inline-flex items-center justify-center rounded bg-brand-600 px-4 py-2 text-sm text-white"
              onClick={() => window.location.reload()}
              type="button"
            >
              Reload
            </button>
          </Card>
        </div>
      )
    }
    return this.props.children
  }
}
