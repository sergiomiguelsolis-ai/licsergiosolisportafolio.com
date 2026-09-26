# Sergio Solís — Portfolio

React · Vite · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP

```bash
npm install
npm run dev      # http://localhost:5173 (o el puerto que indique Vite)
npm run build    # producción en /dist
```

Decisiones de diseño: ver [DESIGN.md](DESIGN.md).

---

## Cómo editar el contenido

Todo el contenido vive en `src/data/`. No hace falta tocar componentes.

### Proyectos — `src/data/projects.ts`

```ts
{
  slug: 'terracork-mexico',          // URL: /proyectos/terracork-mexico
  title: 'Terracork México',
  year: '2024',
  category: ['brand', 'web', 'digital'],   // filtro: brand | digital | content | web | print
  disciplines: ['Identidad de marca', 'Diseño web', 'Comunicación digital'],
  role: 'Diseño gráfico · Dirección de arte · Diseño web',
  description: 'Una o dos frases para la tarjeta de la home.',
  overview: 'Caso de estudio: contexto, reto y enfoque.',
  visualDirection: {
    text: 'Concepto visual: cómo y por qué se ve así.',
    palette: ['#1B1B1B', '#C8A27A'],      // se muestran como muestras de color
    typefaces: ['Nombre de la tipografía'],
  },
  details: [
    { label: 'Entregables', value: 'Logotipo, manual de marca, sitio web…' },
  ],
  heroImage: '/projects/terracork-mexico/hero.jpg',
  cover: '/projects/terracork-mexico/cover.jpg',  // opcional
  gallery: [
    { src: '/projects/terracork-mexico/01.jpg', layout: 'full', caption: 'Sistema de identidad' },
    { src: '/projects/terracork-mexico/02.jpg', layout: 'half' },
    { src: '/projects/terracork-mexico/03.jpg', layout: 'half' },
  ],
  featured: true,   // aparece en la home
  tone: '#E6E0D6',  // color del placeholder
  url: 'https://…', // opcional: sitio en vivo
}
```
(Los valores de arriba son un ejemplo de formato, no datos reales.)

Cada caso de estudio se arma solo con esos campos: Resumen → Rol → Disciplinas →
Dirección visual → Imágenes → Detalles → Más proyectos. Lo que esté vacío se
muestra como “por agregar”.

**Filtro de la home:** usa `category`. Un área sin proyectos aparece desactivada
hasta que algún proyecto la incluya.

**Imágenes:** colócalas en `public/projects/<slug>/`. Exporta a 2400 px en el
lado largo, JPG/WebP ~80 %. Cada placeholder indica la proporción y el tamaño
exacto recomendado.

Layouts de galería: `full` (16:9), `wide` (21:9), `half` (4:5, en pares),
`offset-left` / `offset-right` (3:2), `portrait` (4:5). Usa `aspect: '1/1'`
para forzar otra proporción.

Para agregar un proyecto, copia un objeto del arreglo. La home alterna tres
composiciones (feature → split → pair) automáticamente.

### Datos generales — `src/data/site.ts`

| Campo                   | Qué hace                                             |
|-------------------------|------------------------------------------------------|
| `contact.email`         | Email (vacío = placeholder)                          |
| `contact.portfolioUrl`  | Behance u otro enlace externo (vacío = no se muestra) |
| `portrait`              | Foto editorial para “Sobre mí”, p. ej. `/images/retrato.jpg` |
| `showPlaceholders`      | Poner en `false` antes de publicar para ocultar marcadores |

### Experiencia y capacidades

`src/data/experience.ts` y `src/data/capabilities.ts`. La línea de tiempo se
calcula sola a partir de los años.

---

## Publicar

Funciona como SPA estática. Ya incluye `vercel.json` (Vercel) y
`public/_redirects` (Netlify) para que las rutas `/proyectos/...` funcionen al
recargar.
