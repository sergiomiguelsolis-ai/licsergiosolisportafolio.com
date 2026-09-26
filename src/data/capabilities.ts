export interface Capability {
  number: string
  title: string
  summary: string
  items: string[]
}

export const capabilities: Capability[] = [
  {
    number: '01',
    title: 'Marca',
    summary: 'Identidades diseñadas como sistemas completos.',
    items: ['Identidad visual', 'Sistemas de logotipo', 'Manuales de marca', 'Dirección de arte'],
  },
  {
    number: '02',
    title: 'Digital',
    summary: 'Sitios web e interfaces que comunican con claridad.',
    items: ['Diseño web', 'Landing pages', 'Dirección de UI', 'WordPress / Divi'],
  },
  {
    number: '03',
    title: 'Contenido',
    summary: 'Comunicación consistente en cada canal.',
    items: ['Redes sociales', 'Gráficos de campaña', 'Edición fotográfica', 'Edición de video', 'Motion graphics'],
  },
  {
    number: '04',
    title: 'Impresión',
    summary: 'Artes finales listos para producción real.',
    items: ['Editorial', 'Publicidad', 'Material promocional', 'Artes finales para producción'],
  },
]
