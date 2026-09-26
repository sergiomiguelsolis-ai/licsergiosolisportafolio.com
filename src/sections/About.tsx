import { site, whatsappUrl } from '../data/site'
import Button from '../components/Button'
import Media from '../components/Media'
import { MaskLines, Reveal, Rule } from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

const Dot = () => <span className="text-red">.</span>

const facts = [
  { label: 'Con base en', value: 'Ensenada, Baja California, MX' },
  { label: 'Experiencia', value: `Profesional desde ${site.since}` },
  { label: 'Áreas', value: site.disciplines.join(' / ') },
  { label: 'Formación', value: `${site.education.degree} — ${site.education.school}, ${site.education.campus}` },
]

export default function About() {
  return (
    <section id="sobre-mi" data-section="sobre-mi" className="section shell">
      <SectionLabel index="04">Sobre mí</SectionLabel>

      <h2 className="t-d1 mt-10">
        <MaskLines
          lineClassName={(i) => ['', 'md:pl-[8.333%]', 'md:pl-[16.666%]'][i]}
          lines={[
            <>
              Diseñador
              <Dot />
            </>,
            <>
              Resolutivo
              <Dot />
            </>,
            <>
              <span className="serif-i">Independiente</span>
              <Dot />
            </>,
          ]}
        />
      </h2>

      <div className="grid-editorial mt-[clamp(3rem,7vw,7rem)] gap-y-12">
        {/* Editorial portrait — deliberately here, not in the hero */}
        <figure className="col-span-4 md:col-span-5">
          <Media
            src={site.portrait}
            alt="Retrato editorial de Sergio Solís"
            aspect="4/5"
            tone="#E7E7E3"
            slot="Foto About — Retrato editorial"
            hint="site.ts → portrait"
            hover
            parallax
          />
          <figcaption className="label mt-3 flex justify-between gap-4 text-muted">
            <span>
              <span className="text-red">●</span> {site.name}
            </span>
            <span>
              {site.location.city}, B.C.
            </span>
          </figcaption>
        </figure>

        <div className="col-span-4 flex flex-col justify-between gap-14 md:col-span-6 md:col-start-7">
          {/* One voice: same size, weight and color for the whole bio */}
          <Reveal className="flex max-w-[40ch] flex-col gap-5 text-[clamp(1.25rem,1.75vw,1.75rem)] leading-[1.35] tracking-[-0.02em]">
            <p>
              Soy diseñador gráfico con experiencia profesional desde {site.since}, especializado en identidad
              visual, comunicación gráfica, contenido digital y diseño web.
            </p>
            <p>
              He trabajado con diferentes tipos de negocios, organizaciones y proyectos independientes,
              desarrollando soluciones visuales para medios digitales e impresos.
            </p>
            <p>Me interesa encontrar la forma más clara de comunicar una idea, sin importar el formato.</p>
          </Reveal>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            {facts.map((f, i) => (
              <div key={f.label}>
                <Rule className="bg-ink" delay={i * 0.08} />
                <Reveal delay={0.1 + i * 0.06} y={12}>
                  <dt className="label mt-4 text-red">{f.label}</dt>
                  <dd className="mt-2 text-[15px] leading-snug">{f.value}</dd>
                </Reveal>
              </div>
            ))}
          </dl>

          <Reveal className="flex flex-wrap items-center gap-3">
            <Button href={whatsappUrl} external arrow="right">
              Hablemos
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
