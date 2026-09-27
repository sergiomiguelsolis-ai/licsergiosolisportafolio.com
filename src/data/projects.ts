/**
 * PROYECTOS — edita este archivo para actualizar el portafolio.
 * Todo lo que aparece en las tarjetas y en cada caso de estudio sale de aquí.
 * Un campo vacío ('' o []) se muestra como placeholder "por agregar".
 *
 * Imágenes: colócalas en /public/projects/<slug>/ y refiérelas así:
 *   heroImage: '/projects/terracork-mexico/hero.jpg'
 *
 * category → áreas para el filtro de la home:
 *   'brand' | 'digital' | 'content' | 'web' | 'print'
 *
 * Layouts de galería:
 *   'full'         12 columnas, 16:9
 *   'wide'         12 columnas, 21:9
 *   'half'         6 columnas, 4:5 (usar en pares)
 *   'offset-left'  8 columnas alineadas a la izquierda, 3:2
 *   'offset-right' 8 columnas alineadas a la derecha, 3:2
 *   'portrait'     5 columnas alineadas a la derecha, 4:5
 * `aspect` reemplaza la proporción por defecto, p. ej. '1/1'.
 */

export type Area = 'brand' | 'digital' | 'content' | 'web' | 'print'

export const areas: { id: Area; label: string }[] = [
  { id: 'brand', label: 'Marca' },
  { id: 'digital', label: 'Digital' },
  { id: 'content', label: 'Contenido' },
  { id: 'web', label: 'Web' },
  { id: 'print', label: 'Impresión' },
]

export type GalleryLayout = 'full' | 'wide' | 'half' | 'offset-left' | 'offset-right' | 'portrait'

export interface GalleryItem {
  src: string
  caption?: string
  layout: GalleryLayout
  aspect?: string
}

/** Home card composition: 'feature' (16:9 wide), 'split' (3:2 right), 'pair' (4:5 + detail) */
export type CardLayout = 'feature' | 'split' | 'pair'

export interface Project {
  slug: string
  title: string
  /** Optional card composition; by default every card uses the wide 'feature' layout */
  card?: CardLayout
  /** Saltos de línea manuales opcionales para el título grande del caso de estudio */
  titleLines?: string[]
  year: string
  /** Áreas para el filtro de la home */
  category: Area[]
  /** Disciplinas tal como se muestran, p. ej. 'Identidad de marca' */
  disciplines: string[]
  /** Tu rol, p. ej. 'Diseño gráfico · Dirección de arte · Diseño web' */
  role: string
  /** Una o dos frases — tarjeta de la home */
  description: string
  /** Texto del caso de estudio: contexto, reto, enfoque */
  overview: string
  visualDirection: {
    /** Concepto visual: cómo y por qué se ve así */
    text: string
    /** Colores de la marca en HEX, p. ej. ['#1B1B1B', '#C8A27A'] */
    palette: string[]
    /** Tipografías utilizadas, p. ej. ['Neue Haas Grotesk', 'Canela'] */
    typefaces: string[]
  }
  /** Ficha técnica: entregables, formatos, alcance… */
  details: { label: string; value: string }[]
  heroImage: string
  /** Imagen distinta opcional para la tarjeta de la home (si no, usa heroImage) */
  cover?: string
  /**
   * Video opcional (mp4, sin audio) que reemplaza la portada de la tarjeta y la
   * imagen principal del caso de estudio. Se reproduce solo, en silencio y en loop;
   * heroImage se usa como imagen de espera (póster).
   */
  coverVideo?: string
  gallery: GalleryItem[]
  featured: boolean
  /** Tono del placeholder — personalidad propia hasta que lleguen las imágenes reales */
  tone: string
  /** Sitio en vivo, si aplica */
  url?: string
}

export const projects: Project[] = [
  {
    slug: 'acmedios',
    title: 'ACMEDIOS',
    year: '2025',
    category: ['brand', 'content', 'digital', 'print', 'web'],
    disciplines: ['Identidad visual', 'Aplicaciones de marca', 'Contenido para redes sociales', 'Fotografía', 'Diseño web'],
    role: 'Diseñador gráfico de cabecera',
    description:
      'Identidad visual y comunicación para ACMedios, Academia de Comunicación y Medios Audiovisuales en Ensenada.',
    overview:
      'ACMedios es una academia de comunicación y medios audiovisuales en Ensenada. Como único diseñador del proyecto, desarrollé su identidad visual —la construcción del símbolo, las tipografías y las versiones del logotipo— y la llevé a uniformes, credenciales docentes, gorras, su sitio web y la comunicación en redes sociales de sus cursos y talleres, incluida la fotografía de sus instalaciones.',
    visualDirection: {
      text: 'Un símbolo construido a partir de la M, con un triángulo de reproducción integrado. Azul marino como base institucional y turquesa como acento, aplicados de forma consistente en impresos, uniformes y redes.',
      palette: ['#161635', '#44E2D6', '#FFFFFF'], // tomados de los archivos del logotipo
      typefaces: ['Robout'], // según la lámina "Tipografías oficiales de la marca"
    },
    details: [
      { label: 'Institución', value: 'Academia de comunicación y medios audiovisuales — Ensenada, B.C.' },
      { label: 'Equipo', value: 'Único diseñador del proyecto' },
      {
        label: 'Piezas',
        value: 'Construcción del logotipo, tipografías y versiones de logo, playeras, gorra, credencial docente, sitio web, fotografía y publicaciones para redes sociales',
      },
    ],
    heroImage: '/projects/acmedios/credencial-docente.webp',
    gallery: [
      { src: '/projects/acmedios/construccion-logotipo.webp', layout: 'half', caption: 'Construcción del símbolo' },
      { src: '/projects/acmedios/tipografia-versiones.webp', layout: 'half', caption: 'Tipografía y versiones de logo' },
      { src: '/projects/acmedios/playeras.webp', layout: 'offset-left', caption: 'Uniformes' },
      { src: '/projects/acmedios/gorra.webp', layout: 'offset-right', caption: 'Gorra' },
      { src: '/projects/acmedios/sitio-web.webp', layout: 'full', aspect: '3/2', caption: 'Sitio web' },
      { src: '/projects/acmedios/redes-sociales.webp', layout: 'portrait', caption: 'Redes sociales' },
      { src: '/projects/acmedios/redes-sociales-collage.webp', layout: 'full', caption: 'Contenido para redes sociales' },
      { src: '/projects/acmedios/curso-tiktok.webp', layout: 'half', caption: 'Curso — TikTok' },
      { src: '/projects/acmedios/curso-verano.webp', layout: 'half', caption: 'Curso de verano' },
      { src: '/projects/acmedios/curso-redes-sociales.webp', layout: 'portrait', aspect: '1/1', caption: 'Curso — Manejo de redes sociales' },
      { src: '/projects/acmedios/instalaciones-01.webp', layout: 'half', caption: 'Instalaciones' },
      { src: '/projects/acmedios/instalaciones-02.webp', layout: 'half', caption: 'Instalaciones' },
    ],
    featured: true,
    tone: '#E1E3EA',
  },
  {
    slug: 'kidora',
    title: 'KIDORA',
    year: '2026',
    category: ['brand', 'print', 'content', 'digital'],
    disciplines: [
      'Identidad de marca',
      'Mascota e iconografía',
      'Material impreso',
      'Publicidad para redes sociales',
      'Fotografía',
    ],
    role: 'Diseñador gráfico de cabecera',
    description:
      'Identidad de marca, publicidad y material impreso para KIDORA, renta de inflables y soft play para fiestas infantiles en Ensenada.',
    overview:
      'KIDORA ofrece renta de inflables, soft play y Bubble House para fiestas infantiles en Ensenada. Desarrollé su identidad completa —logotipo, mascota y sistema de íconos— y la llevé a tarjetas de presentación con arte final para imprenta, uniformes, reglamentos de uso para cada juego, publicidad para redes sociales y la fotografía de sus productos.',
    visualDirection: {
      text: 'Una identidad lúdica y clara: un gorila amigable como mascota, un globo amarillo integrado en la O del logotipo y una paleta de azul intenso con amarillo, acompañada de formas redondeadas, estrellas y serpentinas que se repiten en todas las piezas.',
      palette: ['#263ED0', '#FEDC19', '#F5B815', '#FFFFFF'], // tomados del archivo del logotipo
      typefaces: [], // TODO: confirmar con el manual de marca (Sergio lo subirá)
    },
    details: [
      { label: 'Equipo', value: 'Único diseñador del proyecto' },
      {
        label: 'Piezas',
        value: 'Logotipo, mascota, sistema de íconos, tarjetas de presentación, playera, reglamentos de uso, publicaciones y flyers para redes sociales, fotografía de producto',
      },
      { label: 'Impresión', value: 'Tarjetas de 90 × 55 mm, imposición de 21 por pliego tabloide (11 × 17 in)' },
    ],
    heroImage: '/projects/kidora/portada.webp', // logo sobre azul de marca
    gallery: [
      { src: '/projects/kidora/logotipo.webp', layout: 'full', caption: 'Logotipo' },
      { src: '/projects/kidora/mascota.webp', layout: 'half', aspect: '1/1', caption: 'Mascota' },
      { src: '/projects/kidora/flyer-bubble-house.webp', layout: 'half', aspect: '1/1', caption: 'Flyer — Bubble House' },
      { src: '/projects/kidora/iconos.webp', layout: 'wide', aspect: '4/1', caption: 'Sistema de íconos' },
      { src: '/projects/kidora/tarjeta-frente.webp', layout: 'half', aspect: '1250/764', caption: 'Tarjeta — frente' },
      { src: '/projects/kidora/tarjeta-reverso.webp', layout: 'half', aspect: '1250/764', caption: 'Tarjeta — reverso' },
      { src: '/projects/kidora/arte-final-tarjetas.webp', layout: 'portrait', aspect: '1553/2400', caption: 'Arte final para imprenta' },
      { src: '/projects/kidora/playera.webp', layout: 'offset-left', aspect: '1502/974', caption: 'Uniforme' },
      { src: '/projects/kidora/reglamento-bubble-house.webp', layout: 'half', aspect: '1023/1537', caption: 'Reglamento — Bubble House' },
      { src: '/projects/kidora/reglamento-soft-play.webp', layout: 'half', aspect: '1023/1537', caption: 'Reglamento — Soft Play' },
      { src: '/projects/kidora/post-la-fiesta-pasa.webp', layout: 'half', aspect: '1/1', caption: 'Redes sociales' },
      { src: '/projects/kidora/post-una-fiesta.webp', layout: 'half', aspect: '1/1', caption: 'Redes sociales' },
      { src: '/projects/kidora/post-castillo-inflable.webp', layout: 'half', aspect: '4/5', caption: 'Publicidad — Castillo inflable' },
      { src: '/projects/kidora/foto-letras-luminosas.webp', layout: 'half', aspect: '4/5', caption: 'Fotografía de producto' },
    ],
    featured: true,
    tone: '#DCE2F5',
  },
  {
    slug: 'terracork-mexico',
    title: 'Terracork México',
    year: '2025',
    category: ['brand', 'web', 'digital', 'content'],
    disciplines: ['Identidad de marca', 'Diseño web', 'Comunicación digital', 'Animación de logotipo'],
    role: 'Diseñador gráfico de cabecera',
    description:
      'Identidad, sitio web y comunicación digital para TerraCork MX, representantes de soluciones sustentables para la industria en México.',
    overview:
      'TerraCork MX representa en México soluciones sustentables para los sectores logístico, industrial y minero. Como único diseñador del proyecto, desarrollé su identidad de marca, la animación de su logotipo, el diseño de su sitio web y su comunicación en redes sociales, con un lenguaje visual que une lo natural con lo industrial.',
    visualDirection: { text: '', palette: [], typefaces: [] },
    details: [
      { label: 'Equipo', value: 'Único diseñador del proyecto' },
      { label: 'Piezas', value: 'Animación de logotipo, diseño del sitio web y portada para redes sociales' },
    ],
    heroImage: '/projects/terracork-mexico/logo-animado-poster.webp',
    coverVideo: '/projects/terracork-mexico/logo-animado.mp4',
    gallery: [
      { src: '/projects/terracork-mexico/portada-redes.webp', layout: 'wide', aspect: '4/1', caption: 'Portada para redes' },
      { src: '/projects/terracork-mexico/diseno-web.webp', layout: 'offset-left', aspect: '2/3', caption: 'Diseño web' },
    ],
    featured: true,
    tone: '#E6E0D6',
  },
  {
    slug: 'constructora-jmr',
    title: 'Constructora JM&R',
    year: '2025',
    category: ['brand', 'web', 'digital', 'content'],
    disciplines: ['Diseño web', 'Comunicación digital', 'Contenido para redes sociales', 'Marca personal'],
    role: 'Diseñador gráfico de cabecera',
    description:
      'Sitio web y comunicación digital para una constructora en Ensenada y la marca personal de su fundador, como único diseñador del proyecto.',
    overview:
      'Como diseñador gráfico de cabecera de Constructora JM&R, desarrollé su sitio web y su comunicación digital: portadas y publicaciones para redes sociales, y piezas para promover sus proyectos, como el desarrollo Casa Corazón frente al mar en Ensenada. También trabajé la marca personal de su fundador, el Ing. Julio Marrón Avilés: mejoré su logotipo y diseñé su sitio web. Al ser el único diseñador del proyecto, estuve a cargo de mantener un mismo lenguaje visual en todos los formatos.',
    visualDirection: { text: '', palette: [], typefaces: [] },
    details: [
      { label: 'Equipo', value: 'Único diseñador del proyecto' },
      {
        label: 'Piezas',
        value: 'Sitio web de la constructora, portada para redes, publicaciones, campaña Casa Corazón y marca personal del Ing. Julio Marrón (mejora de logotipo y sitio web)',
      },
    ],
    heroImage: '/projects/constructora-jmr/sitio-web.webp',
    gallery: [
      { src: '/projects/constructora-jmr/portada-redes.webp', layout: 'wide', aspect: '27/10', caption: 'Portada para redes' },
      { src: '/projects/constructora-jmr/sitio-web-julio-marron.webp', layout: 'full', aspect: '3/2', caption: 'Sitio web — Ing. Julio Marrón' },
      { src: '/projects/constructora-jmr/casa-corazon-01.webp', layout: 'half', caption: 'Campaña Casa Corazón' },
      { src: '/projects/constructora-jmr/casa-corazon-02.webp', layout: 'half', caption: 'Campaña Casa Corazón' },
      { src: '/projects/constructora-jmr/redes-sociales.webp', layout: 'portrait', caption: 'Redes sociales' },
    ],
    featured: true,
    tone: '#DCDDDA',
  },
  {
    slug: 'belleciia',
    title: 'Belleciia',
    year: '2020',
    category: ['brand', 'print'],
    disciplines: ['Branding', 'Identidad visual', 'Aplicaciones impresas'],
    role: 'Diseñador gráfico — LINE Branding',
    description: 'Identidad de marca para Belleciia, nails & beauty bar en Ensenada.',
    overview:
      'Belleciia es un nails & beauty bar en Ensenada. Como parte del equipo de LINE Branding, diseñé su identidad de marca y la llevé a todas sus piezas impresas: el manual de marca, las tarjetas de presentación, la etiqueta de precio y el menú de bebidas.',
    visualDirection: {
      text: '', // TODO
      palette: [], // TODO: HEX del manual de marca
      typefaces: ['Liber Grotesque'], // visible en el manual de marca — confirmar
    },
    details: [
      { label: 'Estudio', value: 'LINE Branding' },
      { label: 'Piezas', value: 'Manual de marca, tarjetas de presentación, etiqueta de precio y menú de bebidas' },
    ],
    heroImage: '/projects/belleciia/portada-poster.webp',
    coverVideo: '/projects/belleciia/portada.mp4',
    gallery: [
      { src: '/projects/belleciia/tarjetas.webp', layout: 'full', caption: 'Tarjetas de presentación' },
      { src: '/projects/belleciia/manual-de-marca.webp', layout: 'offset-left', caption: 'Manual de marca' },
      { src: '/projects/belleciia/menu-bebidas.webp', layout: 'full', caption: 'Menú de bebidas' },
      { src: '/projects/belleciia/etiqueta.webp', layout: 'offset-right', aspect: '16/9', caption: 'Etiqueta de precio' },
    ],
    featured: true,
    tone: '#EDE3E5',
  },
  {
    slug: 'construcciones-colin',
    title: 'Construcciones Colín',
    year: '2025',
    category: ['brand', 'web', 'digital', 'content'],
    disciplines: ['Rediseño de logotipo', 'Diseño web', 'Contenido para redes sociales'],
    role: 'Diseñador gráfico de cabecera',
    description:
      'Rediseño de logotipo, sitio web y contenido para redes sociales de Construcciones Colín, empresa de ingeniería y arquitectura en Ensenada.',
    overview:
      'Construcciones Colín es una empresa de ingeniería y arquitectura en Ensenada, con trayectoria desde 2011. Como único diseñador del proyecto, rediseñé su logotipo y desarrollé su sitio web y su contenido para redes sociales, aplicando su identidad roja de forma consistente en cada formato.',
    visualDirection: { text: '', palette: [], typefaces: [] },
    details: [
      { label: 'Equipo', value: 'Único diseñador del proyecto' },
      { label: 'Piezas', value: 'Rediseño de logotipo, sitio web (servicios y contacto) y publicaciones para redes sociales' },
    ],
    heroImage: '/projects/construcciones-colin/sitio-web.webp',
    gallery: [
      { src: '/projects/construcciones-colin/logotipo.webp', layout: 'offset-left', aspect: '5/4', caption: 'Logotipo' },
      { src: '/projects/construcciones-colin/redes-sociales-01.webp', layout: 'half', caption: 'Redes sociales' },
      { src: '/projects/construcciones-colin/redes-sociales-02.webp', layout: 'half', caption: 'Redes sociales' },
    ],
    featured: true,
    tone: '#E6DEDC',
  },
]

export const pad = (n: number) => String(n).padStart(2, '0')

export const getProjectIndex = (slug?: string) => projects.findIndex((p) => p.slug === slug)

export const titleLinesOf = (p: Project) => {
  if (p.titleLines?.length) return p.titleLines
  const words = p.title.split(' ')
  if (words.length <= 2) return words
  return [words.slice(0, -1).join(' '), words[words.length - 1]]
}

/** Placeholder layout for a case study whose gallery is still empty */
export const placeholderGallery: GalleryItem[] = [
  { src: '', layout: 'full' },
  { src: '', layout: 'half' },
  { src: '', layout: 'half' },
  { src: '', layout: 'offset-right' },
]
