import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Music from './pages/Music'
import Shows from './pages/Shows'
import Lab from './pages/Lab'
import About from './pages/About'
import Logs from './pages/Logs'
import NotFound from './pages/NotFound'
import ComingSoon from './pages/ComingSoon'
import { SHOW_SPLASH } from './comingSoon'

export default function App() {
  // Pre-launch gate: show the splash to the public, full site behind ?preview=1.
  if (SHOW_SPLASH) return <ComingSoon />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/music" element={<Music />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/about" element={<About />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
