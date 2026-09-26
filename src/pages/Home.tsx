import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Page from '../components/Page'
import { SECTIONS_MOUNTED } from '../hooks/useActiveSection'
import { ScrollTrigger } from '../lib/gsap'
import About from '../sections/About'
import Capabilities from '../sections/Capabilities'
import Contact from '../sections/Contact'
import Experience from '../sections/Experience'
import Footer from '../sections/Footer'
import Hero from '../sections/Hero'
import Philosophy from '../sections/Philosophy'
import SelectedWork from '../sections/SelectedWork'

export default function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    document.title = 'Sergio Solís — Diseñador Gráfico · Graphic Designer'
    window.dispatchEvent(new Event(SECTIONS_MOUNTED))

    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
        ScrollTrigger.refresh()
      })
    }
  }, [hash])

  return (
    <Page label="Sergio Solís — Portafolio">
      <Hero />
      <SelectedWork />
      <Capabilities />
      <About />
      <Experience />
      <Philosophy />
      <Contact />
      <Footer dark />
    </Page>
  )
}
