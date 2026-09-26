import type { ReactNode } from 'react'
import { site, whatsappUrl } from '../data/site'
import { ArrowSwap } from '../components/Arrow'
import Button from '../components/Button'
import Pending from '../components/Pending'
import { MaskLines, Reveal, Rule } from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

interface RowProps {
  label: string
  children: ReactNode
  href?: string
  external?: boolean
  index: number
}

function Row({ label, children, href, external, index }: RowProps) {
  const inner = (
    <>
      <span className="label text-muted">{label}</span>
      <span className="t-h2 min-w-0 truncate transition-colors duration-500 group-hover:text-red">{children}</span>
      {href ? <ArrowSwap dir="up-right" className="text-lg text-red" /> : <span />}
    </>
  )
  const cls = 'group grid grid-cols-[6.5rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[9rem_1fr_auto]'

  return (
    <div>
      <Rule className="bg-ink" delay={index * 0.07} />
      {href ? (
        <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {inner}
        </a>
      ) : (
        <div className={cls}>{inner}</div>
      )}
    </div>
  )
}

export default function Contact() {
  const { email, portfolioUrl, whatsappDisplay } = site.contact

  return (
    <section id="contacto" data-section="contacto" className="theme-dark">
      <div className="section shell border-t border-line">
      <SectionLabel index="07">Contacto</SectionLabel>

      <h2 className="t-d1 mt-10">
        <MaskLines
          lineClassName={(i) => (i === 1 ? 'md:pl-[16.666%]' : '')}
          lines={[
            'Hagamos',
            'algo',
            <>
              <span className="serif-i">claro</span>
              <span className="text-red">.</span>
            </>,
          ]}
        />
      </h2>

      <div className="grid-editorial mt-[clamp(3.5rem,7vw,7rem)] gap-y-14">
        <Reveal className="col-span-4 flex flex-col items-start gap-8 md:col-span-5">
          <p className="label flex items-center gap-3">
            <span className="size-[6px] animate-pulse-dot rounded-full bg-red" />
            Disponible — {site.year}
          </p>
          <p className="t-lead max-w-[32ch]">
            Disponible para proyectos de diseño, colaboraciones creativas y oportunidades profesionales.
          </p>
          <Button href={whatsappUrl} external size="lg" arrow="right">
            Hablemos
          </Button>
        </Reveal>

        <div className="col-span-4 md:col-span-6 md:col-start-7">
          <Row index={0} label="WhatsApp" href={whatsappUrl} external>
            {whatsappDisplay}
          </Row>
          <Row index={1} label="Correo" href={email ? `mailto:${email}` : undefined}>
            {email || <Pending>site.ts → email</Pending>}
          </Row>
          {portfolioUrl && (
            <Row index={2} label="Portafolio" href={portfolioUrl} external>
              {portfolioUrl.replace(/^https?:\/\//, '')}
            </Row>
          )}
          <Rule className="bg-ink" />
        </div>
      </div>
      </div>
    </section>
  )
}
