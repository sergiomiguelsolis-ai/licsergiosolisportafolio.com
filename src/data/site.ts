/**
 * Contenido global del sitio.
 * Los textos vacíos ('') se muestran como placeholders claramente marcados
 * mientras `showPlaceholders` sea true. Al llenarlos aparecen automáticamente.
 */
export const site = {
  name: 'Sergio Solís',
  /** Título profesional principal. En inglés (metadatos): Graphic Designer */
  role: 'Diseñador Gráfico',
  roleEn: 'Graphic Designer',
  /** Título que se muestra bajo el nombre en el hero */
  degree: 'Lic. Diseño Gráfico',
  /** Áreas de trabajo — la línea pequeña bajo el título del hero */
  disciplines: ['Branding', 'Digital', 'Contenido', 'Web', 'Impresión'],

  tagline: {
    before: 'Del ',
    emphasis: 'concepto',
    after: ' a la ejecución visual, en cualquier formato.',
  },

  location: {
    city: 'Ensenada',
    region: 'Baja California',
    country: 'México',
    short: 'Ensenada / MX',
    coords: '31.87° N — 116.60° O',
    timeZone: 'America/Tijuana',
  },

  since: 2018,
  year: 2026,

  education: {
    degree: 'Licenciatura en Diseño Gráfico',
    school: 'Universidad de Tijuana (CUT)',
    campus: 'Campus Ensenada',
  },

  contact: {
    whatsappDisplay: '646 198 9999',
    whatsappNumber: '526461989999', // formato internacional para wa.me
    email: 'sergiomiguel.solis@gmail.com',
    portfolioUrl: '', // opcional: Behance, etc. (vacío = no se muestra)
  },

  /** Foto editorial para "Sobre mí", p. ej. '/images/retrato.jpg' (en /public/images/) */
  portrait: '/images/retrato.webp',

  /** Muestra marcadores punteados en campos vacíos. Cambiar a false antes de publicar. */
  showPlaceholders: false,
}

/** Greeting pre-filled in WhatsApp — edit or set to '' to open an empty chat */
const whatsappGreeting = 'Hola Sergio, vi tu portafolio y me gustaría platicar contigo.'

export const whatsappUrl =
  `https://wa.me/${site.contact.whatsappNumber}` +
  (whatsappGreeting ? `?text=${encodeURIComponent(whatsappGreeting)}` : '')

export const navItems = [
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'contacto', label: 'Contacto' },
] as const
