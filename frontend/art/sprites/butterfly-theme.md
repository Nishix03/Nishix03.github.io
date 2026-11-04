# Mariposa del portafolio

`butterfly-theme-source.png` se editó con ImageGen integrado, usando `butterfly-theme-reference.png` como objetivo de edición. La referencia reúne los 12 cuadros anteriores (8 de vuelo y 4 de reposo).

Prompt: conservar las 12 poses, la cuadrícula 4 × 3, el estilo pixelado y el fondo transparente; sustituir el azul por sombras esmeralda, verdes, luces menta y unos pocos acentos coral en las puntas de las alas. No añadir texto ni bordes.

```sh
node scripts/build-butterfly.mjs
```

El script conserva cuadros de 45 × 35 y los metadatos de reproducción existentes. Actualiza los clips de `public/sprites/clips/`, las hojas y cuadros del paquete `ready-to-integrate`, y su fuente para que la sincronización posterior conserve la nueva paleta. `butterfly-theme-preview.gif` muestra el vuelo ampliado.
