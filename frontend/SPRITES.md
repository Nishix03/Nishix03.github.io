# Entrega de sprites lista para implementar

Estado: integrado en las páginas el 2 nov 2026 (`Clip.astro` + `src/scripts/actors.ts`; copia con `npm run sprites:clips`). La fuente de verdad es `art/sprites/ready-to-integrate/manifest.json`.

Abre `art/sprites/ready-to-integrate/preview.html` directamente, sin servidor, para reproducir los ciclos, avanzar cuadro a cuadro y descargar las fuentes Piskel.

| Personaje / recurso    | Acciones preparadas                                                           | Cuadro                    |
| ---------------------- | ----------------------------------------------------------------------------- | ------------------------- |
| Boyfriend              | Reposo a 100 BPM; arriba, abajo, izquierda y derecha independientes           | 96×96                     |
| Blue-Eyes White Dragon | Reposo, aleteo y salida de una carta en 12 cuadros                            | 80×60; invocación 256×256 |
| Springtrap             | Caminar a derecha/izquierda, girar a ambos lados y glitch en cada orientación | 64×80                     |
| Mariposa de Persona 3  | Vuelo y aleteo de espera                                                      | 45×35                     |
| Frisk de Undertale     | Reposo y saludo de Contact                                                    | 60×75                     |
| Reverso de Yu-Gi-Oh    | Remolino naranja/marrón, sin arcano, numeral ni símbolo propio                | 118×172                   |

Incluye 19 secuencias, PNG y WebP sin pérdida, cuadros individuales, metadatos de acciones/anclaje, CSS preparado, fuentes Piskel, originales de imagegen y los prompts exactos. Los archivos de Lumi se retiraron de los recursos fuente, de las exportaciones públicas y de las copias compiladas; el exportador antiguo ya no puede volver a generarlos.

La guía concreta para el siguiente implementador está en `art/sprites/ready-to-integrate/IMPLEMENTATION.md`. Conserva los iconos y adornos anteriores como recursos de compatibilidad. Los consumidores ya siguen esa guía; `TarotBack.astro` se retiró y Frisk sustituye a Lumi.

Para volver a exportar únicamente el paquete: `node scripts/prepare-sprite-handoff.mjs`. Escribe solo dentro de `art/sprites/ready-to-integrate/`.
