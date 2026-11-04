# Avatar final del menú

Se revisaron los cinco avatares de About, Projects, Stack, Journey y Contact. Sus primeros cuadros se conservan en `reference-*.png` y `other-pages-reference.png`.

`hero-final-source.png` es la nueva base generada con ImageGen integrado. Prompt: igualar el acabado pixelado, el rostro, la paleta menta/verde/negro y el borde coral de los otros apartados; conservar la pose invertida, los dos brazos bajo la cabeza, ojos cerrados, camisa de caída natural y accesorios. Una base estable, sin hoja de poses que cambie la anatomía.

```sh
node scripts/build-avatar.mjs
```

El generador produce 48 cuadros de reposo en dos tiras de 24, con un ciclo de 6,4 s. Solo mueve ligeramente los accesorios y los pliegues interiores de la ropa. La cara, los ojos, las raíces del pelo y el contorno del torso permanecen fijos. Solo las puntas inferiores de los rizos pueden variar su silueta hasta dos píxeles. Una máscara excluye la piel y el borde del torso de los cambios en la tela. Se verificaron estos invariantes en los 48 cuadros.

Las tiras WebP sin pérdida tienen cuadros de 600 × 780, como los otros avatares. La base se muestrea en 300 × 390 y se amplía con nearest; los accesorios se animan en 600 × 780 para permitir pasos más finos. `hero-final-preview.gif` permite ver el ciclo y `hero-final-preview.png` la base a resolución lógica. Las otras hojas y bases son exploraciones descartadas; no se usan en la animación actual.

La adaptación global de escritorio desde 1600 px está en `src/styles/wide.css`, compartida por los idiomas y los cinco apartados. La portada tiene su composición propia en `index.astro`. La ampliación del avatar en móvil se conserva en `avatar.css`.

Referencia de ritmo: https://www.youtube.com/watch?v=GzyiYB8BoRs&t=2s. Se revisó la flotación de los elementos sueltos y se aplicaron oscilaciones lentas con desfases y extremos suaves. Los 48 PNG individuales están en keyframes-final/ (00.png–47.png); accessory-keyframes-details.png compara ocho fases del colgante, pendiente y ambas muñecas. La animación respeta la transparencia de la base, incluida la opacidad casi completa de los píxeles generados.


Actualización de brisa: los pliegues interiores siguen una onda suave de aproximadamente un píxel, y las puntas de los mechones la siguen con un desfase ligero de hasta dos píxeles a 600 × 780. Las raíces y el rostro quedan fuera de la máscara. Los accesorios conservan sus trayectorias independientes y el ciclo común de 6,4 s.


Ajuste de visibilidad: el recorrido de las puntas del pelo aumenta hasta unos cinco píxeles a 600 × 780, los pliegues interiores hasta dos y el pendiente/colgante hasta tres. La cara y el contorno del torso siguen estables. La vista previa actual también está en hero-breeze-visible-preview.gif; el ZIP y los 48 PNG se regeneraron con este ajuste.

Entrada de inmersión: se recuperó la tira de entrada original de la versión publicada (eference-published-entry.webp) y se separaron el agua, la espuma y las burbujas por su paleta. Ese efecto pasa por delante de la nueva base mientras el personaje entra con una aparición y descenso suaves. El último cuadro es exactamente la primera pose de reposo. La entrada conserva sus 24 cuadros y 800 ms; la vista previa hero-entry-immersion-preview.gif añade una pausa final para facilitar la revisión. Referencia: https://nishix03.github.io/.

Arete: el aro, la cadena y la estrella usan metal verde oscuro como los otros avatares. Referencia de color editada con ImageGen integrado: hero-earring-color-reference.png. Prompt: cambiar solo el metal plateado por esmeralda oscuro/negro, conservando geometría, piel y transparencia. El generador aplica esa paleta sobre los píxeles originales para conservar exactamente la silueta y el resto del modelo en todos los cuadros.
