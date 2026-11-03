# UX móvil accesible (≤ 767 px, pantallas táctiles)

Plan y decisiones. El diagnóstico sale de capturas reales a 390 × 844 px de las seis páginas.

## Problemas que había (antes de este plan)

| # | Dónde | Problema |
|---|---|---|
| M1 | Cabecera | Los 5 apartados, NishixAI y EN/ES ocupaban ~235 px: un tercio de la pantalla antes de ver contenido. |
| M2 | Hero | El avatar (780 × 1014 px) llenaba la pantalla y quedaba detrás del titular. |
| M3 | Contact | El correo (`IVANNISHIX@GMAIL.COM`) se cortaba por la derecha. |
| M4 | Todas | «Esc Return» (fijo abajo a la derecha) tapaba el final del contenido y no tiene sentido sin teclado. |
| M5 | Páginas con avatar | El recorte de escritorio era demasiado grande y se metía detrás del texto. |
| M6 | Projects / Journey / Stack | La selección dependía de pasar el cursor. |

## Principios

1. **Mobile first y WCAG 2.2 AA.** Contenido primero: el avatar es decoración (`aria-hidden`) y nunca compite con el texto.
2. **Zonas táctiles de al menos 44 × 44 px** (los enlaces del menú, 48 px). Sin acciones que exijan hover.
3. **Una sola columna, sin scroll horizontal** a 320–767 px (ya lo comprueba una prueba a 360 px).
4. **Movimiento reducido:** con `prefers-reduced-motion` el avatar queda quieto en su pose final y no hay entrada.
5. **Foco visible y orden lógico** del teclado, también en móvil con teclado externo; Esc cierra el menú.

## Qué se hizo

- **M1 · Menú desplegable.** La barra pasa a una fila: marca, NishixAI y botón «Menu» (`aria-expanded`, `aria-controls="site-menu"`). Los apartados viven en un panel con enlaces de 48 px; se cierra al elegir uno o con Esc (devuelve el foco al botón). La marca pierde el `@usuario` y EN/ES se oculta (ES aún no existe). Desde 768 px la cabecera es la de escritorio.
- **M2 y M5 · Avatar de fondo y más pequeño.** `AvatarCutin` pone su caja en variables CSS (`--cx-*`) y `avatar.css` la reduce por página bajo 1024 px (≈ 330–340 px de ancho, pegado al borde) con opacidad 0,3. En About, donde el retrato no está detrás de texto, se ve entero.
- **M3 · Contact fluido.** El tamaño de cada medio de contacto es `clamp(20px, 6.4vw, tamaño)` y las palabras largas se parten (`overflow-wrap: anywhere`).
- **M4 · «Esc Return».** Se mantiene (es el atajo de teclado), pero la página lleva 72 px de margen inferior en móvil para que nunca tape contenido.

## Pendiente de decidir o comprobar

- **M6 · Selección sin hover.** Projects y el menú del Hero responden a `focus` y `click`; falta probarlo con un dedo real (iOS y Android) y que un toque seleccione sin abrir nada por sorpresa.
- **Iconos pixel de Contact:** decorativos (`aria-hidden`); el nombre del medio ya está escrito.
- **Contraste sobre el avatar:** con opacidad 0,3 el texto cumple 4,5:1 en lo medido; revisar con axe en cada página (la prueba existente ya lo hace en escritorio).
- **Rotación horizontal (móvil apaisado)** y zoom al 200 %: revisar que el menú y las tarjetas no se solapen.
- **Tamaño de texto:** en Stack las etiquetas de evidencia miden 12 px; subirlas a 13–14 px en móvil.

## Segunda tanda (revisión de un evaluador UI/UX a 375 px)

Corregido: las franjas de transición `.sweep` quedaban tapando contenido al hacer scroll (ahora se ocultan al terminar); cabecera de una fila de 57 px; menú en overlay con ✕/«Close»; «Esc Return» como flecha de 48 px; etiquetas y pista de teclado del Hero fuera en móvil; LinkedIn y CV como «Coming soon» sin enlace; recuadro de captura vacío oculto en móvil; correo de Contact en una línea; estadísticas de Journey en 2 columnas; retrato de About más bajo; evidencia de Codex.

Pendiente (rediseño mayor, a decidir):
- Projects en móvil: acordeón (el detalle bajo la fila tocada) o desplazamiento al detalle; hoy el detalle queda ~900 px más abajo.
- Journey: línea de tiempo vertical y los «LOCKED» agrupados bajo «Próximo»; «Learned» en dos párrafos.
- Stack: mini-leyenda de RANK en lista; explicar «ORBS 0/7».
- Contact: botones de ancho completo con nombre y dato en dos líneas; correo/WhatsApp como botones principales.
- Franja menta del Hero en móvil (56 px de ancho de lectura) y revisión a 320 px y apaisado.
