# Encargo de sprites para Codex

El frontend ya espera cada sprite con un tamaño y una cantidad de cuadros fijos
(`src/sprites/manifest.ts`). Diseño y personalidad de cada personaje: `../plan-diseno-frontend-portafolio.md` §14
(reparto, adornos, tabla de tono y reglas de originalidad en §14.6).

## Formato de entrega

- **Una tira horizontal por sprite**, cuadros uno al lado del otro, fondo transparente, WebP sin pérdida.
- Tamaño de **un cuadro** = columna "Cuadro". Ancho total de la tira = ancho × cuadros.
- Pixel art con borde de 1 pixel oscuro (`#0b1a12`), sin suavizado (`image-rendering: pixelated` no hace falta si se exporta ya al tamaño final).
- Paleta base del sitio: verde oscuro `#07110c`, menta `#a8f0c8`, neón `#39ff88`, cian `#49e0f0`, ámbar `#ffb340`.
- Guarda en `public/sprites/<archivo>` y pon `ready: true` en el manifiesto.

## Lista

| Archivo                         | Qué es                                                                                                                        | Cuadro | Cuadros | fps |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------ | ------- | --- |
| `eco.webp`                      | Eco, con micrófono; cuadro 2 con la boca abierta                                                                              | 70×80  | 2       | 3,3 |
| `butterfly.webp`                | Mariposa del hero, alas abiertas / cerradas                                                                                   | 45×35  | 2       | 6   |
| `argenta.webp`                  | Argenta, mascota que acompaña la carta; alas arriba / abajo                                                                   | 80×60  | 2       | 3,3 |
| `tuerca.webp`                   | Tuerca, patrulla el Stack; cuadro 2 con ojos "glitch"                                                                         | 48×64  | 2       | 1   |
| `lumi.webp`                     | Lumi con farol; cuadro 2 parpadeando                                                                                          | 60×75  | 2       | 1   |
| `compass.webp`                  | Brújula del diario                                                                                                            | 36×36  | 1       | —   |
| `menace.webp`                   | Flechas ゴゴゴ junto a LATEST                                                                                                 | 40×24  | 1       | —   |
| `arrow-left/down/up/right.webp` | Flechas de ritmo, cada una ya orientada                                                                                       | 27×27  | 1       | —   |
| `icon-nishixai.webp`            | Icono del chat NishixAI                                                                                                       | 36×28  | 1       | —   |
| `icon-<id>.webp`                | Un icono por tecnología: `html css javascript git playwright java sql typescript astro react tailwind gsap claude-code codex` | 36×28  | 1       | —   |

## Reglas

- Los movimientos de cuerpo entero (flotar, vuelo, patrulla, latido) **los hace el CSS**; la tira solo trae el cambio de cuadro.
- Originales: se inspiran en el tono de la tabla de §14.6, sin copiar siluetas, colores ni rasgos de personajes de otros autores.
- Los iconos de tecnología son marcas de terceros: usa el color de marca y las dos letras, no el logotipo oficial.
