# Portafolio — Sergio Solís

Portafolio profesional de Sergio Solís, Lic. en Diseño Gráfico (Ensenada, B.C.).
React · Vite · TypeScript · Tailwind 4 · Framer Motion · GSAP. Sitio en español.

- Sistema visual y decisiones de diseño: `DESIGN.md`
- Cómo editar contenido: `README.md` — todo vive en `src/data/`

## Reglas del proyecto

- **Nunca inventar contenido**: clientes, métricas, premios, testimonios, años,
  roles ni imágenes. Si falta un dato, se pregunta o se deja vacío (los campos
  vacíos se ocultan porque `showPlaceholders` está en `false`).
- Título profesional: **Diseñador Gráfico** (Graphic Designer en metadatos).
  En el hero se muestra “Lic. Diseño Gráfico.”
- Paleta: blanco / negro / rojo `#C8102E`. El rojo es acento, nunca superficie.
- Proyectos (en este orden): ACMEDIOS, TerraCork México, Constructora JM&R,
  Belleciia, Construcciones Colín. Beach House Studio queda fuera. No mencionar FRESKO.
- En JM&R la marca de la constructora NO es de Sergio; sí mejoró el logo y el
  sitio de la marca personal del Ing. Julio Marrón.
- Sin botones ni enlaces de CV (decisión del usuario).
- Todos los “Hablemos” abren WhatsApp (`site.ts → whatsappUrl`).
- Refinar, no rediseñar: los cambios se hacen sobre el diseño existente.

## Imágenes

Los originales van en `proyects/` (ignorada por git y por Vercel). Al sitio solo
entran copias optimizadas en `public/projects/<slug>/` (WebP ~2400 px lado largo;
videos mp4 1080p sin audio, `-movflags +faststart`).

## Publicación

GitHub → Vercel (despliegue automático en cada push a `main`).
`vercel.json` y `public/_redirects` hacen que las rutas `/proyectos/...` funcionen al recargar.
