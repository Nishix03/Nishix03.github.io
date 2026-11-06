# Portafolio de Iván Rodas

Portafolio personal de **Iván Rodas** (estudiante de ingeniería de sistemas, ciclo 4), publicado en
GitHub Pages: <https://nishix03.github.io>.

El sitio es una interfaz estática y bilingüe (inglés y español) con estética pixel art inspirada en
Persona 3 Reload: menús que se eligen con las flechas, un avatar que cambia de pose en cada apartado,
sprites animados y un chat (NishixAI) que responde preguntas sobre el perfil. No hay backend ni base
de datos.

## Contenido

- [Tecnologías](#tecnologías)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Cómo ejecutarlo en local](#cómo-ejecutarlo-en-local)
- [Páginas del sitio](#páginas-del-sitio)
- [Arquitectura del frontend](#arquitectura-del-frontend)
- [Idiomas y contenido](#idiomas-y-contenido)
- [Sprites y animación](#sprites-y-animación)
- [Pruebas](#pruebas)
- [Despliegue](#despliegue)
- [Convenciones de código](#convenciones-de-código)
- [Documentación adicional](#documentación-adicional)
- [Estado y pendientes](#estado-y-pendientes)

## Tecnologías

| Tecnología                                       | Uso en el proyecto                                                     |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| Astro 7 (sitio estático)                         | Páginas, rutas y `<ClientRouter />` para la transición entre páginas   |
| React 19 (una sola isla)                         | El chat de NishixAI, que conserva su estado al cambiar de página       |
| TypeScript                                       | Contenido tipado, scripts del cliente y comprobación con `astro check` |
| Tailwind CSS 4 (`@tailwindcss/vite`)             | Tokens de diseño (`@theme`) y reset; el resto es CSS propio            |
| Figtree + Pixelify Sans (`@fontsource-variable`) | Tipografías                                                            |
| lucide-react                                     | Iconos del chat                                                        |
| Prettier + prettier-plugin-astro                 | Formato del código                                                     |
| Playwright + axe-core                            | Pruebas de accesibilidad, teclado y movimiento reducido                |
| GitHub Actions                                   | Compilación y publicación automática en GitHub Pages                   |

GSAP **no** se usa a propósito: todo el movimiento es CSS puro (`transform`, `opacity`, `clip-path`),
que corre en el compositor del navegador y se mantiene fluido.

## Estructura del repositorio

```
.
├─ frontend/                 Proyecto Astro: es el sitio que se publica
│  ├─ public/                Favicon, avatar 3D por apartado (avatar/) y sprites ya procesados (sprites/)
│  ├─ art/sprites/           Fuentes del arte pixel (.piskel, PNG) y el paquete "ready-to-integrate"
│  ├─ scripts/               Utilidades de Node para generar/copiar sprites
│  ├─ src/
│  │  ├─ components/         Header, PageShell, Clip, Sprite, PoseFigure, AvatarCutin, NishixChat…
│  │  ├─ content/            Todo el texto y los datos, en en/ y es/, con tipos en types.ts
│  │  ├─ layouts/            BaseLayout (head, transiciones, atajos de teclado)
│  │  ├─ pages/              Una página por apartado; pages/es/ reutiliza las mismas en español
│  │  ├─ scripts/            JavaScript del cliente (selección, teclado, pausa de animaciones…)
│  │  ├─ sprites/            Manifiesto y lista de clips de los sprites
│  │  └─ styles/             tokens, base, motion, option, pose, avatar, pixel…
│  └─ tests/                 Pruebas de Playwright + axe
├─ docs/                     Primera versión del portafolio (HTML + CSS puros) y guía de CSS
├─ .github/workflows/        deploy.yml: publica `frontend/` en GitHub Pages
├─ plan-diseno-frontend-portafolio.md   Plan de diseño del frontend
├─ plan-mejora-prototipos-chiclayo.md   Plan del proyecto "Prototipos de negocios · Chiclayo"
└─ CLAUDE.md                 Instrucciones de trabajo para Claude Code
```

> La carpeta `docs/` contiene la **primera versión** del portafolio (HTML y CSS sin frameworks).
> El sitio publicado hoy sale de `frontend/`.

## Cómo ejecutarlo en local

Requisitos: **Node.js 22** y npm.

```bash
cd frontend
npm install
npm run dev        # servidor de desarrollo en http://localhost:4321
```

Otros comandos (todos desde `frontend/`):

| Comando                           | Qué hace                                                |
| --------------------------------- | ------------------------------------------------------- |
| `npm run build`                   | Genera el sitio estático en `dist/`                     |
| `npm run preview`                 | Sirve `dist/` para ver el resultado final               |
| `npm run check`                   | Revisa tipos con `astro check`                          |
| `npm run format`                  | Da formato con Prettier (`format:check` solo comprueba) |
| `npm test`                        | Ejecuta las pruebas (requiere `npm run build` antes)    |
| `npm run sprites:clips`           | Copia las tiras de sprites a `public/sprites/clips/`    |
| `npm run sprites:build`           | Genera los sprites a partir de las fuentes Piskel       |
| `npx playwright install chromium` | Solo la primera vez, para poder ejecutar las pruebas    |

## Páginas del sitio

| Ruta (EN)   | Ruta (ES)      | Qué muestra                                                                                 |
| ----------- | -------------- | ------------------------------------------------------------------------------------------- |
| `/`         | `/es/`         | Hero con el menú principal que se elige con ↑ ↓ y Enter                                     |
| `/about`    | `/es/about`    | Presentación personal                                                                       |
| `/projects` | `/es/projects` | Proyectos como cartas de tarot (Prototipos de Chiclayo, Gestor de tareas, Gestor de citas)  |
| `/stack`    | `/es/stack`    | Tecnologías con un nivel (RANK) y una autoevaluación con evidencia                          |
| `/journey`  | `/es/journey`  | Formación, hitos y diario de aprendizaje                                                    |
| `/contact`  | `/es/contact`  | Medios de contacto (correo, WhatsApp, GitHub, LinkedIn, Platzi, CV)                         |

Atajos: **↑ ↓** mueven la selección, **Enter** abre, **Esc** vuelve al inicio.

## Arquitectura del frontend

- **Páginas Astro** (`src/pages/`): cada apartado es un `.astro`. Las de `pages/es/` son envoltorios
  de 6 líneas que reutilizan la página en inglés con el idioma español.
- **Componentes** (`src/components/`): piezas reutilizables. `PageShell` da el marco común,
  `Header` la navegación (menú desplegable en móvil), `AvatarCutin` y `PoseFigure` la figura del
  avatar, `Clip` y `Sprite` los personajes animados y `NishixChat` (React) el chat.
- **Capa de contenido** (`src/content/`): los textos no están en las páginas sino en archivos `.ts`
  tipados. `getContent(locale)` devuelve el catálogo del idioma y TypeScript avisa si al español le
  falta algo que tiene el inglés.
- **Scripts del cliente** (`src/scripts/`): `select-group` (selección con atributos `data-sel`,
  `aria-current`, `aria-pressed`), `keys` (flechas y Esc), `loops` (pausa las animaciones fuera de
  pantalla), `ready` (muestra la página cuando avatar y fuentes están listos), `actors` y `clips`
  (qué clip de sprite toca en cada momento) e `init` (arranque).
- **Estilos** (`src/styles/`): `tokens.css` define las variables (colores, fuentes, curvas);
  `motion.css` los keyframes; `option.css` el efecto de selección; `pose.css` y `avatar.css` las
  figuras; `sprite-keyframes.css` la animación por cuadros de los sprites.

### Principios de rendimiento y accesibilidad

- Solo se animan `transform`, `opacity` y `clip-path`; nada que reordene el layout.
- La selección es CSS disparado por atributos; el JavaScript solo cambia el atributo.
- Las animaciones infinitas se pausan fuera de pantalla y con la pestaña oculta.
- `prefers-reduced-motion`: todo aparece en su estado final, sin recorridos ni barridos.
- Sin JavaScript el contenido sigue visible.
- Mobile first y WCAG 2.2 AA: zonas táctiles de al menos 44 × 44 px, sin scroll horizontal desde
  320 px y avatar decorativo (`aria-hidden`).
- Astro anticipa la página cuando se mantiene el puntero o el foco sobre un enlace. El retrato se descarga al entrar en su sección.

## Idiomas y contenido

El idioma sale de la URL: `/es/...` es español y el resto inglés (`localeFromUrl`). El selector EN/ES
(`LangSwitch`) lleva a la misma página en el otro idioma (`switchLocale`).

Para cambiar un texto o añadir un proyecto no hay que tocar las páginas: se edita el archivo
correspondiente en `src/content/en/` y su equivalente en `src/content/es/`.

## Sprites y animación

Cada personaje es un `<Clip>` con varios clips (reposo, flechas, giro…):

- **Boyfriend** canta con ← ↓ ↑ → en el Hero.
- **Blue-Eyes White Dragon** sale de la carta al elegir un proyecto.
- **Springtrap** patrulla, gira y se traba en Stack.
- **Frisk** saluda al llegar a Contact.
- **Mariposa de Persona 3** vuela por el Hero.

El flujo es: arte en `art/sprites/` (Piskel) → `npm run sprites:clips` copia las tiras a
`public/sprites/clips/` y genera `src/sprites/clips.json` → `actors.ts` decide qué clip toca y todo se
encadena con el evento `animationend`. Más detalle en
[`frontend/SPRITES.md`](frontend/SPRITES.md).

## Pruebas

Las pruebas (`frontend/tests/site.spec.ts`) usan Playwright y comprueban, para las páginas en inglés
y español:

- Que cargan todas las hojas de sprites con el tamaño de cuadro correcto.
- Que los ciclos pixel se pausan fuera de pantalla.
- Cero violaciones de accesibilidad con **axe**.
- Que no hay desbordamiento horizontal a 360 px y 1440 px.
- Que con movimiento reducido todo queda visible.
- Navegación con teclado (flechas, Enter, Esc), cambio de idioma y `aria-current` en la cabecera.
- Que el chat de NishixAI abre, responde y se mantiene al cambiar de página.
- Que el Stack nunca supera el tope de su RANK.

```bash
cd frontend
npm run build
npm test
```

## Despliegue

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) se ejecuta en cada push a
`main` (o a mano desde la pestaña *Actions*):

1. **build**: instala dependencias y compila `frontend/` con `withastro/action` (Node 22).
2. **deploy**: publica el resultado en GitHub Pages.

## Convenciones de código

- CSS con metodología **BEM** (`bloque__elemento--modificador`).
- Enfoque **mobile first**: estilos base para móvil y `@media (min-width: ...)` para pantallas grandes.
- Variables CSS (`--nombre`) para colores, tipografías y espaciados.
- Commits en español, pequeños y uno por cada cambio lógico.

## Documentación adicional

- [Guía técnica y auditoría de rendimiento](docs/GUIA_TECNICA.md).

- [`frontend/README.md`](frontend/README.md): notas técnicas del frontend.
- [`frontend/SPRITES.md`](frontend/SPRITES.md): entrega y uso de los sprites.
- [`frontend/UX-MOVIL.md`](frontend/UX-MOVIL.md): decisiones de UX móvil y accesibilidad.
- [`plan-diseno-frontend-portafolio.md`](plan-diseno-frontend-portafolio.md): plan de diseño.
- [`docs/GUIA_CSS_DISEÑO.md`](docs/GUIA_CSS_DISEÑO.md): guía de CSS de la primera versión.

## Estado y pendientes

- Los renders 3D del personaje ya están integrados: cada apartado tiene su avatar animado en `frontend/public/avatar/` (entrada y reposo).
- Añadir la URL real de LinkedIn en `frontend/src/content/*/contact.ts`.
