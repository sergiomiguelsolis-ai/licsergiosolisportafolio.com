import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import { useSpotlight } from './hooks/useSpotlight'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProjectPage from './pages/ProjectPage'

export default function App() {
  const location = useLocation()
  useSpotlight()

  return (
    <MotionConfig reducedMotion="user">
      <Cursor />
      <Nav />
      <AnimatePresence
        mode="wait"
        initial={true}
        onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/proyectos/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </MotionConfig>
  )
}
