# Guía técnica y auditoría de rendimiento

El portafolio de Iván Rodas es un sitio estático bilingüe. Astro genera seis páginas en inglés y sus equivalentes bajo `/es/`. GitHub Pages sirve la salida de `frontend/dist/`. NishixAI es una isla de React con respuestas locales. El navegador hace la selección de proyectos, la navegación por teclado y el control de las animaciones.

## Mapa del proyecto

| Ruta en inglés | Ruta en español | Contenido |
| --- | --- | --- |
| `/` | `/es/` | Inicio, menú y avatar principal |
| `/about/` | `/es/about/` | Presentación, método de trabajo y perfil |
| `/projects/` | `/es/projects/` | Selector de proyectos, detalle y cartas |
| `/stack/` | `/es/stack/` | Tecnologías y evidencia de experiencia |
| `/journey/` | `/es/journey/` | Estudios, hitos y cronología |
| `/contact/` | `/es/contact/` | Canales de contacto |

- [Páginas](../frontend/src/pages) y [contenido](../frontend/src/content). Las rutas de `pages/es` reutilizan las páginas principales. `localeFromUrl` elige el contenido y `switchLocale` conserva la sección al cambiar de idioma.
- [BaseLayout](../frontend/src/layouts/BaseLayout.astro), [Header](../frontend/src/components/Header.astro) y [PageShell](../frontend/src/components/PageShell.astro). Comparten navegación, idioma y transiciones. El HTML del contenido se genera durante la compilación.
- [Estilos](../frontend/src/styles). `tokens.css` define el sistema visual. `motion.css` contiene los barridos. `avatar.css` mueve las tiras. `mobile.css` contiene la composición hasta 767 px y `wide.css` ajusta los anchos grandes.
- [Scripts del navegador](../frontend/src/scripts). `init.ts` inicializa controles de cada página. `keys.ts` y `select-group.ts` gestionan la interacción. `loops.ts` pausa bucles fuera de pantalla y cuando se oculta la pestaña.
- [Recursos](../frontend/public) y [arte editable](../frontend/art). `public/avatar` contiene las tiras desplegables y sus derivados. `public/sprites` conserva el reparto pixel art. La versión histórica del sitio vive junto a esta guía en `docs/`.
- [Pruebas](../frontend/tests/site.spec.ts) y [publicación](../.github/workflows/deploy.yml). Playwright y axe verifican la interfaz. Cada actualización de `main` compila con Node.js 22 y publica el artefacto de Astro.

## Desarrollo y mantenimiento

```sh
cd frontend
npm ci
npm run dev
npm run check
npm run build
npm test
```

Instala el navegador de prueba con `npx playwright install chromium` la primera vez. Para una revisión manual de la compilación, usa `npm run preview`. Edita el contenido de una sección en `src/content/en/` y `src/content/es/`. Comprueba ambas rutas y el selector de idioma tras cambiar títulos o enlaces.

Para actualizar el arte, conserva los originales en `art/` y las tiras de escritorio de 600 × 780 px por cuadro en `public/avatar/`. Regenera los derivados con `node scripts/build-responsive-assets.mjs` desde `frontend/` y revisa la entrada, el reposo y el modo de movimiento reducido. El script usa Sharp, que ya está en el proyecto. Si cambia el número de cuadros de una tira, ajusta también la configuración de [AvatarCutin](../frontend/src/components/AvatarCutin.astro).

Al abrir una sección, la interfaz, el barrido y el retrato comienzan juntos cuando está lista la tira de entrada. Antes de publicar, comprueba un cambio de sección, un cambio de idioma, una selección de proyecto y la primera apertura de NishixAI con teclado y con toque.

## Alcance y método de la auditoría

**Fecha** 6 de noviembre de 2026. **Base** `5fd72bd`, la revisión móvil que estaba publicada al iniciar la auditoría.

Se compararon las 12 rutas de ambas compilaciones estáticas en Chromium mediante Playwright y el protocolo de DevTools. Cada visita empezó con un contexto nuevo, sin caché, con las animaciones activas y sin interacción. Las dos compilaciones se sirvieron en el mismo equipo con gzip para HTML, CSS y JavaScript. Se intercaló una visita a la base y otra a la versión optimizada por cada ruta.

| Perfil | Ventana | RTT simulado | Descarga | CPU | Observación |
| --- | ---: | ---: | ---: | ---: | ---: |
| Móvil | 390 × 844 px | 100 ms | 12 Mbit/s | 3× más lenta | 4,5 s |
| Escritorio | 1440 × 900 px | 20 ms | 60 Mbit/s | 1× | 2,8 s |

**Transferencia** suma los cuerpos codificados del documento y de los recursos completados dentro de la ventana. Incluye las precargas que terminan en ese intervalo y excluye las cabeceras. **LCP** es el último candidato observado. **CLS** usa la mayor ventana de desplazamientos sin entrada reciente. Se observó también cuándo el navegador pudo mostrar el título principal. Una muestra por ruta y perfil sirve para detectar diferencias de laboratorio. Las cifras de tiempo pueden variar entre ejecuciones. [Metodología de LCP y diferencias entre laboratorio y campo](https://web.dev/articles/optimize-lcp).

Para repetir la comparación, compila la referencia y el árbol actual en carpetas separadas. Sirve cada `dist`, aplica el mismo perfil en la pestaña Network de DevTools y repite las doce rutas con caché desactivada. En Performance registra FCP, LCP, CLS y tareas largas. En Network comprueba las transferencias y filtra por `avatar/`, `_astro/` y `font`. Para comparar tiempos de forma más estable, repite cada visita y toma la mediana con el equipo inactivo.

## Resultados

Las mediciones corresponden a la auditoría del commit `b0881c7`, cuando el contenido se mostraba antes del retrato. La sincronización posterior cambia el momento de aparición y, por tanto, los tiempos de pintura.

Cada celda muestra base → optimización.

| Ruta | Móvil KiB | Móvil LCP (s) | Escritorio KiB | Escritorio LCP (s) |
| --- | ---: | ---: | ---: | ---: |
| `/` | 3826 → 1661 | 4,36 → 2,02 | 7123 → 3204 | 2,43 → 1,12 |
| `/es/` | 4020 → 1661 | 4,24 → 1,85 | 7124 → 3204 | 2,44 → 1,12 |
| `/about/` | 4125 → 191 | 1,96 → 1,86 | 4125 → 196 | 1,54 → 0,57 |
| `/es/about/` | 551 → 191 | 3,74 → 2,54 | 4126 → 197 | 1,50 → 1,12 |
| `/projects/` | 531 → 172 | 3,43 → 2,02 | 4106 → 177 | 1,08 → 0,78 |
| `/es/projects/` | 1003 → 172 | 2,80 → 2,26 | 4106 → 177 | 1,11 → 0,93 |
| `/stack/` | 419 → 252 | 3,87 → 2,43 | 4193 → 265 | 1,22 → 0,60 |
| `/es/stack/` | 435 → 252 | 3,62 → 2,43 | 4194 → 265 | 1,12 → 0,85 |
| `/journey/` | 632 → 265 | 3,48 → 1,91 | 4207 → 279 | 1,21 → 0,84 |
| `/es/journey/` | 633 → 265 | 3,34 → 2,27 | 4207 → 279 | 1,17 → 0,96 |
| `/contact/` | 1007 → 182 | 3,06 → 2,34 | 4111 → 183 | 1,12 → 0,68 |
| `/es/contact/` | 1008 → 182 | 2,94 → 2,12 | 4112 → 183 | 1,14 → 0,88 |

| Indicador agregado de las doce rutas | Móvil | Escritorio |
| --- | ---: | ---: |
| Mediana de LCP (s) | 3,45 → 2,19 | 1,19 → 0,86 |
| Mediana del primer título visible (s) | 3,31 → 1,96 | 0,93 → 0,44 |
| Mediana de FCP (s) | 0,98 → 0,95 | 0,20 → 0,20 |
| Máximo CLS observado | 0,0001 → 0,0326 | 0,0047 → 0,0048 |

- Inicio en inglés. La transferencia móvil pasó de **3,74 a 1,62 MiB** (−57 %). En escritorio pasó de **6,96 a 3,13 MiB** (−55 %).
- JavaScript externo antes de abrir el chat. El inicio móvil pasó de **77,9 a 7,8 KiB**. La cifra excluye los scripts embebidos en el HTML.
- Las cargas especulativas de avatares dejaron de aparecer en las visitas optimizadas sin interacción. La ganancia de transferencia varía según cuánto alcanzaba a descargar la visita base dentro de la ventana.
- Al adelantar el contenido se observaron algunos desplazamientos pequeños durante la carga en móvil. La tabla incluye el máximo observado y las métricas de tiempo se interpretan como resultados de laboratorio.

## Registro de decisiones

| Hallazgo | Decisión aplicada | Efecto o compromiso |
| --- | --- | --- |
| Toda la sección quedaba oculta hasta decodificar tiras y cargar fuentes, o hasta agotar una espera de 2,5 s. | Limitar `data-loading` al retrato. Iniciar selección, teclado y observadores al cargar la ruta. Esperar solo las tiras principales y descartar el resultado de un retrato que ya salió del DOM. | El texto y los controles pueden aparecer antes del retrato. La entrada y el reposo siguen sincronizados entre sí. Sin JavaScript se muestra el contenido y se usa el comportamiento CSS del retrato. |
| Se pedían por adelantado los retratos de las demás rutas y se precargaban todos los enlaces visibles. | Eliminar la precarga global de WebP. Mantener la precarga de páginas de Astro por intención de ratón o teclado. Priorizar la tira de entrada desde `AvatarStrip`. | Baja el tráfico de una visita que se queda en una sola página. El retrato de una sección nueva se pide al entrar si aún no está en caché. [Prefetch de Astro](https://docs.astro.build/en/guides/prefetch/). |
| Las tres tiras del inicio pesaban 3,03 MiB y se descargaban a resolución de escritorio en teléfono. | Servir tiras de 300 × 390 px por cuadro hasta 767 px y conservar las de 600 × 780 px en escritorio. Usar vecino más cercano, WebP con calidad 85 y alfa de calidad 100 para el inicio móvil. Los demás derivados móviles se codifican sin pérdida. | Las tiras del inicio móvil pesan 1,52 MiB. Su superficie RGBA teórica conjunta baja de 128,5 a 32,1 MiB, sin contar copias del compositor. Se conservan cuadros, duraciones y secuencia. El inicio móvil acepta pequeñas diferencias de color por compresión. |
| El modo de movimiento reducido descargaba la animación completa para mostrar su último cuadro. | Usar un WebP fijo de ese cuadro mediante `picture` y `prefers-reduced-motion`. | El inicio móvil pide un retrato fijo en lugar de tres tiras. La variante móvil y la de escritorio conservan el encuadre y el tamaño CSS. |
| React se descargaba para hidratar NishixAI en todas las visitas. | Cargar la isla al pulsar el botón con una directiva de Astro. La primera pulsación también abre el chat, y el foco pasa al campo de texto. Se conserva `transition:persist` dentro del mismo idioma. | La visita que no usa el chat evita React. La primera apertura necesita la descarga y la hidratación. El estado ocupado se retira al abrir o al fallar la carga. [API de directivas de Astro](https://docs.astro.build/en/reference/integrations-reference/#addclientdirective). |
| La marca de la cabecera descargaba un PNG de 25,1 KiB para una imagen de 44 px de ancho. | Servir un WebP de 88 px de ancho, conservando la proporción y la caja CSS. | La marca pesa 2,7 KiB y conserva una fuente de 2× para escritorio. |
| La caminata de la cronología se pedía con el contenido superior. Los estilos del retrato SVG alternativo se importaban globalmente. | Usar carga diferida nativa en la caminata y mover `pose.css` al componente que lo utiliza. | Chrome puede adelantar la caminata si queda cerca de la vista. Las rutas publicadas dejan de enviar los estilos de un componente que no montan. |
| Volver a Proyectos dejaba un listener de `matchMedia` asociado al DOM anterior. Cambios rápidos podían acumular temporizadores de desplazamiento. | Cancelar el listener al cambiar de página y cancelar la espera o el cuadro anterior al iniciar otro desplazamiento. | Se mantiene el acordeón móvil y se libera el trabajo de la ruta anterior. |

### Alternativas descartadas

- La recompresión WebP de escritorio sin pérdida con esfuerzo 6 agrandó las tres tiras. Las pruebas con calidad 90 y 94 también agrandaron las tiras de reposo. Se conservaron los originales.
- El reescalado directo de la entrada WebP antes de decodificar y la codificación móvil inicial a calidad 94 dieron archivos mayores que la versión final. Se decodifican los píxeles antes de aplicar vecino más cercano.
- Se mantuvieron las fuentes locales, los sprites pequeños y los estilos de interacción. La mayor parte del tráfico evitable venía de los retratos anticipados y la hidratación automática. Se conservó la publicación estática y las dependencias fijadas.

### Ajuste posterior de carga y estabilidad visual

- Se volvió a compartir la espera entre interfaz y retrato por decisión de diseño. Al decodificar la tira de entrada, el sitio revela ambos y reanuda el barrido. Si el reposo sigue cargando, el retrato mantiene el último cuadro de entrada hasta que esté listo. Tras ocho segundos se muestra el contenido aunque la entrada o el script principal sigan pendientes. El sitio conserva las tiras móviles, la imagen fija para movimiento reducido y la carga del chat bajo demanda.
- Los relevos entre tiras usan pasos discretos. La mariposa mantiene el clip activo hasta decodificar el siguiente y descarta cambios de puntero que hayan quedado obsoletos. Las máscaras estáticas del retrato conservan su encuadre y dejan de solicitar capas de composición por adelantado.

## Verificación y límites

- `npm run build` generó las 12 rutas y `npm run check` terminó sin errores de tipos.
- Playwright pasó **38 pruebas**. Se añadió cobertura para el título visible con las tiras retenidas y la apertura de NishixAI con el primer Enter. Se reprodujo en la base el fallo de una aserción que exigía una escala entera a la mariposa de 1,15×. La prueba corregida comprueba el tamaño declarado y la proporción.
- En Chromium se observaron los eventos de la entrada, el reposo y el barrido al navegar del inicio a Trayectoria. Con movimiento reducido, el inicio móvil pidió únicamente `hero-still-mobile.webp` como recurso de avatar. Se compararon tres cuadros del inicio con el original para revisar las diferencias del WebP móvil.
- La repetición del inicio, filtrando los recursos con transferencia de red, mantuvo el ahorro de bytes. El LCP móvil fue sensible a la ventana de muestreo. En la repetición de la base solo entró el candidato de la marca antes del corte, aunque el título seguía apareciendo más tarde.
- Esta prueba cubre las dos resoluciones indicadas y carga fría simulada. La medición de campo, el comportamiento de caché en visitas sucesivas y la fluidez en teléfonos físicos quedan fuera de sus resultados.
