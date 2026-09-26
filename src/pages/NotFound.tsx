import { useEffect } from 'react'
import Button from '../components/Button'
import Page from '../components/Page'
import { MaskLines } from '../components/Reveal'
import { INTRO_DELAY } from '../lib/motion'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Página no encontrada — Sergio Solís'
  }, [])

  return (
    <Page label="404 — Página no encontrada">
      <section className="shell flex min-h-[100svh] flex-col justify-end pb-16 pt-32">
        <p className="label flex items-center gap-3">
          <span className="text-red">404</span>
          <span className="h-px w-6 bg-red" />
          <span>Página no encontrada</span>
        </p>
        <h1 className="t-d1 mt-8">
          <MaskLines
            onMount
            delay={INTRO_DELAY}
            lines={[
              'Aquí no hay',
              <>
                nada <span className="serif-i">todavía</span>
                <span className="text-red">.</span>
              </>,
            ]}
          />
        </h1>
        <div className="mt-12">
          <Button to="/" arrow="left">
            Volver al inicio
          </Button>
        </div>
      </section>
    </Page>
  )
}
