# Sergio Solís — Sistema visual

El portafolio es el primer proyecto. Este documento registra las decisiones
antes del código: qué se hizo y por qué.

---

## 0. Concepto: el acento

El nombre **SOLÍS** tiene una tilde. Esa tilde, dibujada como un paralelogramo
rojo, es la firma del sistema: aparece en el nombre del hero, en la navegación,
en el footer y en el favicon. De ahí sale la regla del rojo en todo el sitio:
**el rojo es un acento — nunca una superficie.**

El mismo gesto se repite en pequeño:

- el punto final rojo de los titulares (`Proyectos selectos.`, `Diseñador.`, `claro.`)
- el índice rojo de sección `(02) —— Proyectos`
- el cursor: un punto rojo de 8 px

Posicionamiento: **Diseñador Gráfico** (Graphic Designer en metadatos) — de la
necesidad de comunicación a su ejecución visual en Branding · Digital · Contenido
· Web · Impresión. El título es fijo en el hero; nunca rota ni se sustituye.

Hilo narrativo en el copy: **claridad**.
Hero → *“Del concepto a la ejecución visual, en cualquier formato.”*
Filosofía → *“Hace las cosas más claras.”*
Contacto → *“Hagamos algo claro.”*

## 1. Color

| Token        | Hex       | Uso                                                       |
|--------------|-----------|-----------------------------------------------------------|
| `paper`      | `#F7F7F5` | Fondo. Blanco cálido, editorial, no clínico.              |
| `ink`        | `#111111` | Texto, reglas fuertes, fondo del póster de filosofía.     |
| `white`      | `#FFFFFF` | Texto sobre rojo.                                         |
| `red`        | `#C8102E` | Acento: numeración, índices, hover, CTA, tilde.           |
| `muted`      | `#707070` | Texto secundario (contraste 4.7:1 sobre paper).           |
| `line`       | `#DCDCDC` | Reglas finas, divisores, pistas de la línea de tiempo.    |

Proporción aproximada: 90 % paper/ink · 8 % gris · ≤ 2 % rojo.
La única sección donde el rojo gana volumen es **06 — Philosophy**, y aun ahí
es tipografía sobre negro, no un fondo rojo.

Afinidad institucional: blanco + negro + rojo, disciplina de retícula y
lenguaje de señalización. Sin logotipos, tipografías ni elementos de ninguna
institución real.

## 2. Tipografía

- **Inter** (variable, eje óptico `opsz`) — voz principal. A tamaños grandes
  el eje óptico cambia automáticamente a los cortes *Display*, más cerrados.
- **Instrument Serif Italic** — una sola palabra por titular, como momento
  editorial: *selectos*, *estándar*, *Independiente*, *más claras*, *claro*.
  En el hero, ***concepto*** va en esa misma cursiva engrosada (`.serif-i-bold`,
  con contorno del mismo color, porque Instrument Serif no tiene peso bold) y en rojo.

Regla de caja: **MAYÚSCULAS** sólo para la identidad (nombre), el póster
y las etiquetas. Frases en caja de oración.

| Clase        | Tamaño (fluido)             | Interlínea | Tracking | Peso |
|--------------|-----------------------------|-----------:|---------:|-----:|
| `t-hero`     | 18.2vw (máx. 36svh)         | 0.80       | −0.065em | 600  |
| `t-d1`       | 2.75 → 11 rem               | 0.86       | −0.055em | 600  |
| `t-poster`   | 2.25 → 10.5 rem             | 0.88       | −0.055em | 600  |
| `t-d2`       | 2.25 → 6.5 rem              | 0.92       | −0.045em | 600  |
| `t-num`      | 3 → 9 rem                   | 0.80       | −0.06em  | 300  |
| `t-h1`       | 1.75 → 3.5 rem              | 1.05       | −0.035em | 500  |
| `t-h2`       | 1.375 → 2.25 rem            | 1.10       | −0.025em | 500  |
| `t-lead-xl`  | 1.375 → 2.5 rem             | 1.20       | −0.025em | 400  |
| `t-lead`     | 1.125 → 1.5 rem             | 1.38       | −0.015em | 400  |
| body         | 16 px                       | 1.55       | 0        | 400  |
| `label`      | 11 px, MAYÚSCULAS           | 1.30       | +0.12em  | 500  |

Los números usan `tabular-nums` para que no bailen al animarse.

## 3. Retícula

- 12 columnas en desktop, 4 en móvil (`.grid-editorial`).
- Margen lateral `clamp(1rem, 3vw, 3.5rem)`; medianil `clamp(0.75rem, 1.5vw, 1.5rem)`.
- Ancho máximo 1800 px.
- Composición asimétrica: los bloques de texto viven en las columnas 1–4 o
  9/10–12; las imágenes toman 8–12 columnas.

## 4. Espaciado

Base de 8 px. Ritmo vertical de sección `clamp(6.5rem, 12vw, 12rem)`.
Mucho espacio negativo alrededor de los titulares; densidad sólo en
etiquetas y metadatos.

## 5. Imágenes

Un solo componente (`Media.tsx`) para todas las imágenes:

- Con `src`: imagen real, `object-cover`, carga diferida.
- Sin `src`: **placeholder diseñado** — marcas de corte, guías de columna en
  rojo al 10 %, marca de registro de imprenta, nombre del slot, proporción y
  tamaño de exportación recomendado (lado largo 2400 px) y el campo de
  `projects.ts` donde se reemplaza. Nunca imágenes falsas.
- Entrada: cortina `clip-path` de abajo hacia arriba.
- Movimiento: deriva vertical muy sutil al hacer scroll y respuesta ligera
  al mouse (± 1.6 %). Escala 1.035 al hover.

Cada proyecto tiene un `tone` propio para su placeholder y una composición
distinta en la home (feature · split · pair), así ningún proyecto se ve igual
a su vecino.

## 6. Movimiento

| Curva       | Valor                          | Uso                              |
|-------------|--------------------------------|----------------------------------|
| expo-out    | `cubic-bezier(.16, 1, .3, 1)`  | Revelados, hovers                |
| in-out      | `cubic-bezier(.76, 0, .24, 1)` | Cortinas y wipes                 |

- Titulares: líneas que suben detrás de una máscara (1.2 s, stagger 90 ms).
- Reglas: se dibujan de izquierda a derecha.
- Tarjetas de proyecto (hover): la regla roja del índice se alarga, el título se
  desplaza 0.04em y se subraya en rojo, la imagen escala 1.035 y reacciona al
  mouse, la flecha de “Ver caso de estudio” se intercambia.
- Filtro de proyectos: línea de índice editorial (Todo / Marca / …), estado
  activo con punto rojo; las tarjetas entran/salen con fade + desplazamiento.
- Transición de página: cortina negra con filo rojo; al entrar muestra el
  nombre del destino (`Proyecto 01 — Terracork México`).
- GSAP: el póster de filosofía se “entinta” palabra por palabra con el
  scroll (scrub, sin secuestrar el scroll); la línea de tiempo cuenta
  2018 → 2026 y dibuja sus barras.
- Cursor: punto rojo exacto (sin retraso), anillo sobre enlaces, disco con
  etiqueta sobre proyectos. Desactivado en pantallas táctiles.
- `prefers-reduced-motion` desactiva transformaciones y animaciones GSAP.

- Halo rojo en títulos (`.spot` + `useSpotlight`): SOLO en títulos de jerarquía
  alta en bold (nombre del hero, titulares de sección, títulos de capacidades,
  póster). Los títulos de proyecto NO lo llevan (ya tienen su hover de subrayado). Un degradado radial rojo #C8102E sigue al cursor y tiñe
  las letras bajo él. Solo con mouse; en táctil el título queda en su color.
- Partículas rojas (solo en dos lugares, `Particles.tsx`): ~12 % son “acento”
  (más grandes, más intensas y un poco más rápidas) para romper la uniformidad; flotan y se apartan
  del cursor; canvas ligero que solo se anima mientras la sección está visible
  y queda estático con “reducir movimiento”.
  · Hero: más marcadas (1.1–3.4 px, opacidad 0.40–0.85), detrás del contenido.
  · Póster de filosofía: sutiles (0.6–2.2 px, opacidad 0.18–0.63) sobre negro.

- Fin de caso de estudio (`ScrollToHome.tsx`): al llegar abajo, seguir
  deslizando (rueda, dedo o teclado) sube la cortina de transición en
  proporción al gesto; al cubrir la pantalla lleva al inicio. Si el visitante
  se detiene, la cortina regresa sola. Incluye el botón “Volver al inicio”
  para quien no siga deslizando. No interviene el scroll normal: solo actúa
  cuando ya no hay más página.

Prohibido en el resto del sitio: partículas, blur, glassmorphism, neón, 3D,
scroll hijacking.

## 7. Componentes

```
src/
  components/  Arrow · Button · Cursor · Media · Nav · Page · Pending ·
               ProjectCard · Reveal (Reveal, MaskLines, Rule) ·
               MetaList · Particles · SectionLabel · Wordmark
  sections/    Hero · SelectedWork · Capabilities · About · Experience ·
               Philosophy · Contact · Footer
  pages/       Home · ProjectPage · NotFound
  data/        site.ts · projects.ts · experience.ts · capabilities.ts
  hooks/       useActiveSection · useGoTo · useMediaQuery · useSpotlight
  lib/         motion.ts · gsap.ts
  styles/      index.css  (tokens + escala tipográfica)
```
