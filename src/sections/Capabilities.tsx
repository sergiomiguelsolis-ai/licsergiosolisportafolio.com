import { capabilities } from '../data/capabilities'
import { MaskLines, Reveal, Rule } from '../components/Reveal'
import Particles from '../components/Particles'
import SectionLabel from '../components/SectionLabel'

export default function Capabilities() {
  return (
    <section id="capacidades" data-section="" className="theme-dark relative overflow-hidden">
      <Particles density={0.35} />
      <div className="section shell relative">
      <div className="grid-editorial gap-y-8">
        <SectionLabel index="03" className="col-span-4 md:col-span-12">
          Capacidades
        </SectionLabel>
        <h2 className="t-d1 col-span-4 md:col-span-11">
          <MaskLines
            lines={[
              'Cuatro disciplinas.',
              <>
                Un mismo <span className="serif-i">estándar</span>
                <span className="text-red">.</span>
              </>,
            ]}
          />
        </h2>
        <Reveal delay={0.15} className="col-span-4 mt-4 md:col-span-5 md:col-start-7 md:mt-8">
          <p className="label flex items-center gap-3">
            <span className="size-[5px] rounded-full bg-red" />
            Formatos distintos. Un mismo lenguaje visual.
          </p>
          <p className="t-lead mt-4 text-muted">
            El diseño gráfico no termina en un logo: marca, digital, contenido e impresión pueden pertenecer a un
            mismo <span className="serif-i text-[1.08em] text-ink">sistema visual</span>.
          </p>
        </Reveal>
      </div>

      <ul className="mt-[clamp(3rem,6vw,6rem)]">
        {capabilities.map((c, i) => (
          <li key={c.number} className="group">
            <Rule className="bg-ink" delay={i * 0.08} />
            <div className="grid-editorial items-start gap-y-5 py-8 md:py-12">
              <Reveal className="col-span-1 md:col-span-2">
                <span className="t-num block text-ink/15 transition-colors duration-700 group-hover:text-red">
                  {c.number}
                </span>
              </Reveal>
              <Reveal delay={0.05} className="col-span-3 md:col-span-4">
                <h3 className="t-d2 spot transition-transform duration-700 ease-expo md:group-hover:translate-x-3">
                  {c.title}
                </h3>
              </Reveal>
              <Reveal delay={0.1} className="col-span-4 md:col-span-2 md:pt-2">
                <p className="text-[15px] leading-snug text-muted">{c.summary}</p>
              </Reveal>
              <Reveal delay={0.15} className="col-span-4 md:col-span-4 md:col-start-9 md:pt-2">
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[15px] leading-snug">
                  {c.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-[0.7em] h-px w-2.5 shrink-0 bg-red" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </li>
        ))}
        <li aria-hidden>
          <Rule className="bg-ink" />
        </li>
      </ul>
      </div>
    </section>
  )
}
