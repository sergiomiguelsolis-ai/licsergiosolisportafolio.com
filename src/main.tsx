import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Standard weight-axis build: the optical-size (opsz) build renders every
// weight as regular in Safari/WebKit.
import '@fontsource-variable/inter/wght.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './styles/index.css'
import App from './App'
import { ScrollTrigger } from './lib/gsap'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// Re-measure scroll-triggered animations once webfonts settle the layout
document.fonts?.ready.then(() => ScrollTrigger.refresh())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
