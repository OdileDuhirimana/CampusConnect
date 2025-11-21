import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter } from 'react-router-dom'
import ToastProvider from './components/ToastProvider'
import ErrorBoundary from './components/feedback/ErrorBoundary'
import AuthBootstrap from './components/AuthBootstrap'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <AuthBootstrap>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </AuthBootstrap>
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
