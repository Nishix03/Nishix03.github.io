# Portafolio de Iván Rodas — frontend

Interfaz del portafolio según el boceto de Claude Design y `../plan-diseno-frontend-portafolio.md`.
Solo frontend: no hay backend ni base de datos.

## Tecnologías (las de mi stack)

| Qué                                              | Para qué                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| Astro 7 (estático)                               | Páginas, rutas, `<ClientRouter />` para la transición entre apartados |
| React 19 (una sola isla)                         | El chat de NishixAI, que mantiene su estado al cambiar de página      |
| TypeScript                                       | Contenido tipado, scripts y `astro check`                             |
| Tailwind CSS 4 (`@tailwindcss/vite`)             | `@theme` con los tokens (colores, fuentes, curvas) y reset            |
| Figtree + Pixelify Sans (`@fontsource-variable`) | Tipografías                                                           |
| lucide-react                                     | Iconos del chat                                                       |
| Prettier + prettier-plugin-astro                 | Formato                                                               |
| Playwright + axe                                 | Pruebas de accesibilidad, teclado y movimiento reducido               |

GSAP no está instalado a propósito: todo el movimiento del boceto es CSS puro (`transform`, `opacity`,
`clip-path`), que corre en el compositor y es lo que lo hace fluido. Se añade cuando haya animación
con scroll o secuencias que CSS no pueda expresar (plan §11.3).

## Comandos

```bash
npm install
npm run dev       # desarrollo en http://localhost:4321
npm run build     # sitio estático en dist/
npm run preview   # sirve dist/
npm run check     # astro check (tipos)
npm run format    # Prettier
npx playwright install chromium   # solo la primera vez
npm test          # pruebas (necesita npm run build antes)
```

## Estructura

```
frontend/
├─ public/              favicon, avatar/ (renders 3D del personaje por apartado) y sprites/ (assets de Codex)
├─ src/
│  ├─ styles/           tokens.css (variables), base.css, motion.css (keyframes), option.css (selección P3R),
│  │                    pose.css (figuras por apartado), pixel.css
│  ├─ content/en/       Todo el texto y los datos (proyectos, stack, journey, contacto, chat). Para /es: src/content/es/
│  ├─ sprites/          manifest.ts: lista de sprites que Codex debe entregar (ver SPRITES.md)
│  ├─ components/       Header, PageShell, Sprite, PoseFigure, TarotBack, NishixChat (React)
│  ├─ layouts/          BaseLayout (head, transición, atajo Esc)
│  ├─ pages/            index (hero), projects, stack, journey, contact
│  └─ scripts/          select-group (selección P3R), loops (pausa fuera de pantalla), keys (↑↓ y Esc)
└─ tests/               Playwright + axe
```

## Cómo se mantiene la fluidez del boceto

- Los tiempos, curvas y keyframes se copiaron tal cual del boceto (`motion.css`, `pose.css`).
- Solo se animan `transform`, `opacity` y `clip-path`; nada que reordene el layout.
- La selección P3R (tajo + placa + desplazamiento) es CSS y se dispara por atributos (`data-sel`,
  `aria-current`, `aria-pressed`); el JS solo cambia el atributo.
- Las animaciones infinitas se pausan fuera de pantalla y con la pestaña oculta (`loops.ts`).
- `prefers-reduced-motion`: todo en su estado final, sin recorrido y sin barridos.
- Sin JS el contenido sigue visible (solo cambia la selección interactiva).

## Sprites por acción

Cada personaje es un `<Clip>` con varios clips (reposo, flechas, giro…) del paquete de Codex.

- `npm run sprites:clips` copia las tiras de `art/sprites/ready-to-integrate/` a `public/sprites/clips/` y genera `src/sprites/clips.json`.
- `src/scripts/actors.ts` decide qué clip toca: Boyfriend canta con ←↓↑→ (hero), Blue-Eyes sale de la carta al elegir proyecto, Springtrap patrulla, gira y se traba (Stack) y Frisk saluda al llegar (Contact).
- Todo se encadena con `animationend`, así que fuera de pantalla o con la pestaña oculta la secuencia se pausa sola.

## Qué falta (no es código)

- Nada de sprites: el paquete por acción de Codex ya está conectado (ver abajo). Para revisar los clips sueltos: `art/sprites/ready-to-integrate/preview.html`.
- Renders 3D del personaje: ya están puestos en cada apartado (`public/avatar/`, componente `AvatarCutin`).
- URL real de LinkedIn en `src/content/en/contact.ts`.
- Versión en español (`/es`).
