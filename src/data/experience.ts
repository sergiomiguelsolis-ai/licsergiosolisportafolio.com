export interface ExperienceItem {
  start: number
  /** null = actualidad */
  end: number | null
  company: string
  /** Línea secundaria bajo el nombre (opcional) */
  note?: string
  role: string
}

export const experience: ExperienceItem[] = [
  { start: 2018, end: 2019, company: 'KAUNAZ Strategic Branding', note: 'Prácticas profesionales', role: 'Diseño Gráfico / Branding' },
  { start: 2019, end: 2020, company: 'JAUZ Casa Creativa', note: 'Prácticas profesionales', role: 'Diseño Gráfico / Creativo' },
  { start: 2020, end: 2021, company: 'LINE Branding', role: 'Diseñador Gráfico / Socio' },
  { start: 2021, end: 2022, company: 'ROI Imagen Integral', note: 'Marketing Deportivo', role: 'Diseñador Gráfico' },
  { start: 2023, end: null, company: 'Diseñador Independiente', note: 'Ensenada, B.C.', role: 'Branding / Digital / Contenido / Web' },
]
