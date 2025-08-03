import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Feed from './pages/Feed.tsx'
import Chat from './pages/Chat.tsx'
import Events from './pages/Events.tsx'
import Profile from './pages/Profile.tsx'
import Settings from './pages/Settings.tsx'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import NotFound from './pages/NotFound.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Clubs from './pages/Clubs.tsx'

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={(
          <Layout>
            <Feed />
          </Layout>
        )}
      />
      <Route path="/dashboard" element={<Layout><RequireAuth><Dashboard /></RequireAuth></Layout>} />
      <Route path="/clubs" element={<Layout><Clubs /></Layout>} />
      <Route path="/events" element={<Layout><Events /></Layout>} />
      <Route path="/chat" element={<Layout><RequireAuth><Chat /></RequireAuth></Layout>} />
      <Route path="/profile" element={<Layout><RequireAuth><Profile /></RequireAuth></Layout>} />
      <Route path="/settings" element={<Layout><RequireAuth><Settings /></RequireAuth></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}
