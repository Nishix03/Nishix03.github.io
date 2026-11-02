# Plan de diseño frontend: portafolio de Iván Rodas (Nishix_03)

Alcance: solo frontend. El backend (Spring Boot) queda fuera hasta que haga falta (formulario de contacto, demo de IA).
Estado: decisiones cerradas tras la entrevista; los puntos abiertos están al final.

## 1. Posicionamiento

- **Mensaje del hero:** desarrollador full-stack que entrega, con funciones impulsadas por IA.
- **Audiencia:** mixta. Manda el mensaje full-stack; empleo y freelance van como CTA secundarios (CV y contacto).
- **Marca:** "Iván Rodas" como nombre, con un avatar pixel art animado como mascota. `Nishix_03` es el handle secundario.
- **Idioma:** inglés por defecto, español opcional.

> Ojo con "agentes de IA para negocios": LeeContigo IA es IA educativa, no agentes de negocio. Mientras no exista un demo propio, usar "AI-powered features" y no prometer agentes.

## 2. Contenido real (sin relleno)

| Bloque | Contenido | Nota |
|---|---|---|
| Caso estrella | **GastroClinicWebV1**: landing con gestor de citas para la empresa de tus padres, más el demo de IA. Objetivo: sustituir una herramienta SaaS de pago. | **Aún no está en producción.** Se construye y se despliega antes del portafolio (ver fase 0). **No se publica ninguna cifra de precio, ahorro ni ganancia**; el valor se cuenta con resultados cualitativos (por ejemplo "reemplaza un servicio de pago por una solución propia y a medida"). Sin datos médicos en capturas. |
| Caso con premio | **LeeContigo IA**: 1.er lugar, hackathon futurX 2026 (14-24 oct, +500 participantes, 9 países). Tu parte: plan de reparto de commits y la barra de experiencia / sistema de niveles (visual + lógica). | Marcar como trabajo de equipo (IngeFuturX), con tu parte explícita. |
| Otros trabajos | Task manager (HTML/CSS/JS) y gestor de citas Java Swing. Sin caso de estudio. | Arreglar antes el saludo "User" y la bio cortada del task manager. |
| Certificados | Franja discreta: Platzi Expert+, 17 cursos de Web, ruta Fundamentos completada. | No es sección protagonista. |
| Tech stack | Solo lo que de verdad usas (unas 12 tecnologías). | La referencia con 50 logos infla el perfil; evitarla. |

Reglas de honestidad: nada de barras de skill en porcentajes, nada de métricas inventadas, y el origen de los sprites (IA) se declara en los créditos.

## 3. Estructura de la página (scroll narrativo, una sola página por idioma)

1. **Hero:** nombre, mensaje, avatar pixel animado, CTA "View projects" + "Contact".
2. **Projects:** tarjetas con problema, qué se entregó y stack. GastroClinic y LeeContigo grandes.
3. **Stack:** cuadrícula de iconos con estilo de tarjeta de cristal oscuro.
4. **Other works.**
5. **Journey (XP):** gráfico interactivo y animado, al final del portafolio.
6. **Certificates:** franja.
7. **Contact + footer.**

**Navegación (actualizada, ver §10):** una barra mínima fija (botón MENU, idioma, tema) y el **menú de pantalla completa estilo P3R**, que se abre con el botón o con Ctrl+K. Máximo 6 ítems.
Debe ser `<nav>` con enlaces reales, accesible por teclado, con botón visible y no solo el atajo.

## 4. Sistema visual

- **Base:** verde muy oscuro con tinte (`~#07110c`), no negro puro.
- **Acento:** verde neón (`~#39ff88`). Menta (`~#a8f0c8`) para texto secundario, hovers y un posible tema claro.
- **Todo en tokens CSS compartidos:** nada de colores hardcodeados.
- **Tipografía:** Figtree para cuerpo y títulos. Fuente pixel (Pixelify Sans o Silkscreen vía `@fontsource`) solo en etiquetas y detalles. Evitar Press Start 2P para texto corrido.
- **Superficies:** tarjetas de cristal sutil con borde fino, como las de tus referencias.
- **Pixel art:** `image-rendering: pixelated`, una rejilla común (por ejemplo 32×32), una paleta de unos 16 colores.
- **Referencias sutiles (tus gustos):** inspiración en motivos y mecánicas, nunca personajes, logos ni marcos oficiales (copyright y aspecto de fan page).
  Regla: máximo un guiño por sección.

| Gusto | Guiño propuesto | Dónde |
|---|---|---|
| Yu-Gi-Oh | Tarjetas de proyecto como cartas coleccionables: efecto holo al inclinar, "Type / Attribute" en vez de métricas inventadas, estrellas de nivel | Projects |
| Persona 3/4/5 | Pestaña activa de la píldora con forma angulada y alto contraste; "Social Link ranks" como nivel por tecnología; calendario de días para el Journey | Navegación y Journey |
| Dragon Ball | "Power level" / scouter en la barra de XP; 7 esferas escondidas por la página que desbloquean el easter egg retro | XP y easter egg |
| One Piece | "Bounty" como contador total de XP; mapa con checkpoints | Journey |
| Uncharted (**entra**) | Al abrir un hito del Journey, su detalle se muestra como una entrada de "diario de expedición": fecha, nota corta y qué se aprendió. Solo contenido y etiqueta; sin textura de papel, para no chocar con P3R | Journey |
| JoJo (**entra, cambiado**) | Símbolos pixel art de cada parte de la saga como **insignias de nivel** del Journey (LV). Son motivos genéricos (estrella, marcas), nunca personajes ni arte oficial | Journey |
| FNF (**entra**) | Flechas de ritmo pixel (↑↓←→) en la pista de teclado del menú | Menú |
| Roblox | Avatar pixel de aspecto "bloque" como mascota | Hero |

## 5. Pixel art animado

- 5 a 8 sprites pequeños y un avatar. Generados con IA y luego limpios.
- **Consistencia:** una sola hoja de estilo (prompt base, paleta fija y tamaño de rejilla), y cuantizar a la paleta con un script. Es el riesgo principal de usar IA.
- **Animación:** sprite sheets con CSS `steps()`, sin librería. GSAP solo para revelados de scroll y la barra de XP.
- **Rendimiento y accesibilidad:** pausar fuera de pantalla con `IntersectionObserver`, respetar `prefers-reduced-motion`, y marcar los sprites decorativos como `aria-hidden`.
- Máximo 8 sprites animados a la vez.
- `three` queda descartado.

## 6. Gráfico final de avance (XP y niveles)

Versión combinada: mecánica de XP de LeeContigo + marco P3R + habitante pixel.

**Layout (decidido):** barra de XP segmentada horizontal. Tu avatar pixel camina por ella. Al llegar a un hito aparece un "RANK UP" con fragmento diagonal estilo P3R (fondo blanco, texto negro, borde neón).
Encima: `LV n` y el total de XP como "power level" (guiño a Dragon Ball). La luna de cada hito es un icono pequeño junto a la fecha, no un calendario completo.

**Tres stats (decidido), como en P3R:**

| Stat | Qué mide | Evidencia actual |
|---|---|---|
| Learning | Cursos, rutas, certificados | Platzi: 17 cursos de Web, ruta Fundamentos |
| Teamwork | Trabajo en equipo | futurX 2026 (plan de commits y sistema de niveles de LeeContigo) |
| Shipping | Proyectos desplegados | Task manager en Pages; GastroClinic y demo de IA cuando estén |

**Regla de XP (auditable):** cada hito pesa por tipo. Curso = 1, ruta o certificado = 2, proyecto personal = 2, logro en equipo = 3, proyecto en producción = 3. El XP total es la suma visible de la lista, no un número inventado. Los niveles son umbrales fijos sobre esa suma.
El rango de cada stat sale de la misma regla (§10.1).

**Hitos reales:**
- Inicio en Platzi (2024).
- Ruta Fundamentos del Desarrollo Web (feb 2026).
- Curso de Introducción al Backend (abr 2026).
- Java, SQL y bases de datos (oct 2026).
- Ganar futurX 2026 (oct 2026).
- **Bloqueados (candado, en gris):** GastroClinic en producción y demo de IA publicado. Se desbloquean al cumplirse. Se muestran como camino, nunca como logro.

**Interacción (decidido):**
- Se anima con el scroll, **sin fijar la pantalla** (sin pinning): no secuestra el scroll y funciona en móvil.
- Cada hito es un elemento enfocable; flechas ←→ pasan entre hitos.
- Con `prefers-reduced-motion`: estado final sin caminata.
- Sin JS: lista ordenada con los mismos hitos. Los datos viven en un único archivo tipado (`journey.ts`), fuente de verdad para el gráfico y la lista.
- En móvil la barra se vuelve una lista vertical con una barra fina arriba.

Etiqueta visible: "nivel personal". El XP es un juego, no una certificación.
Guiños que se reducen: One Piece (bounty) sale del Journey. Dragon Ball queda como power level y esferas.

## 7. Stack técnico

- Astro con islas de React 19 y TypeScript. Solo se hidratan el menú de pantalla completa (con su atajo Ctrl+K) y el gráfico de XP.
- Tailwind CSS 4 (`@tailwindcss/vite`) con tokens CSS.
- GSAP, lucide-react y Figtree.
- **i18n:** enrutamiento nativo de Astro, `/` en inglés y `/es` en español, con el mismo árbol de contenido.
- **Calidad:** Prettier (con prettier-plugin-astro), `astro check`, `tsc`, y Playwright con `@axe-core/playwright`.
- **Despliegue:** hoy el sitio vive en GitHub Pages. Astro estático funciona allí. Decidir hosting definitivo en la fase de backend.
- Sin dependencias nuevas salvo necesidad demostrada. El Ctrl+K se escribe a mano con un `dialog` accesible.

## 8. Fases (sin fecha fija)

Al no haber fecha, la protección contra el "nunca termina" son las puertas de salida de cada fase.

| Fase | Entrega | Puerta de salida |
|---|---|---|
| Prerrequisito. GastroClinic | Landing + gestor de citas + demo de IA, desplegados | Producción real con al menos un uso verificable. Si pasa de 6-8 semanas, el portafolio v1 sale igual con GastroClinic como "en desarrollo" |
| 0. Contenido y assets | Textos EN/ES, capturas de GastroClinic y LeeContigo, sprites y avatar | Todo el contenido existe en un archivo, antes de escribir código |
| 1. Fundaciones | Tokens, tipografía, layout, píldora de navegación, hero con avatar | Se ve bien en móvil y escritorio |
| 2. Contenido | Proyectos, stack, otros trabajos, certificados, contacto, i18n | **Versión publicable** |
| 3. Extras | Gráfico de XP, Ctrl+K, easter egg Win98 | Cada extra pasa axe y respeta movimiento reducido |
| 4. Calidad | Pruebas Playwright + axe, Lighthouse | **Lighthouse 95+ en Performance y Accesibilidad y cero violaciones en axe** (confirmado). Los guiños extra se recortan antes que bajar de esa meta |

## 9. Puntos abiertos

1. ~~Lista de gustos~~ recibida (anime, videojuegos, Yu-Gi-Oh). Falta elegir qué guiños entran, ver §4.
2. **GastroClinic:** confirmar el permiso para mostrarla y qué se puede enseñar sin datos de pacientes. Regla fija: ninguna cifra de precio, ahorro o ganancia en el portafolio.
3. **Demo de IA:** se construye junto a GastroClinic. Mientras no esté publicado, el hero dice "AI-powered features" y no "agentes".
4. ~~Metas de rendimiento~~ cerrado: Lighthouse 95+ (Performance y Accesibilidad) y cero violaciones en axe.
5. ~~Task manager~~ cerrado: se arregla rápido (saludo "User", bio cortada, título inconsistente) y va a "Otros trabajos". Lo corriges tú primero y yo reviso, como pide tu CLAUDE.md.6. ~~Pixel art contra P3R~~ resuelto en §10.4.
7. ~~Paleta, peso de P3R y extras (§10.3)~~ confirmados.
8. **Carga del Journey:** con P3R, XP, tres stats, insignias JoJo, diario Uncharted y power level, es la sección más cargada. Se construye en capas: núcleo (barra, hitos, rank up) primero; insignias y diario después. Si sube el peso o baja Lighthouse, se recortan insignias y diario.

## 10. Lenguaje visual Persona 3 Reload

Referencia: tus tres capturas (menú principal, menú System, lista de Social Links).
Solo se toma el **lenguaje**: formas, composición, movimiento. No se usan sus fuentes, arte, personajes, logos ni las capturas (son © Atlus/Sega); las capturas no se guardan en el repo.
Los valores marcados con (*) fueron supuestos míos y ya están **confirmados** por ti: paleta Dark Hour verde con cian, tema Día/Noche con menta, P3R como lenguaje de la interfaz y arcanos romanos.

### 10.1 Qué se observa y cómo se traduce

| Elemento en el juego | Traducción web |
|---|---|
| Menú principal: texto en pila, rotado unos -8°, interlineado casi 0.85, grueso e itálico | Figtree Black Italic en mayúsculas, `transform: rotate(-8deg)` en el contenedor, con el texto sin deformar. No hace falta fuente nueva. |
| Ítem seleccionado: fragmento diagonal blanco con borde de acento y texto negro | `clip-path: polygon(...)` animado con GSAP. Texto negro sobre blanco; borde neón verde (*). |
| Palabra gigante recortada al fondo ("MENU", "SYSTEM") | Texto enorme `aria-hidden`, rotado 90°, cortado por el borde de la pantalla. Una por sección. |
| Número grande ("9") | Número de sección grande en gris translúcido. |
| Transición: círculo grande que revela la pantalla | `clip-path: circle()` animado entre menú y página. Se anula con movimiento reducido. |
| Caja "current wallet" arriba a la izquierda | Caja de estado: "Level + XP total" del Journey. Nunca dinero ni cifras de precio. |
| Pista inferior "Use a Skill / A Confirm / B Close" | Pista de teclado: "Enter Confirm · Esc Close · ↑↓ Move". |
| Lista de Social Links: numeral de arcano + nombre + RANK grande | Lista de proyectos y tecnologías: numeral romano, nombre y **RANK**. |
| Columna derecha con retratos y barras | Chips de tecnología con rango. Nada de porcentajes ni barras de "dominio". |
| "Return to Title" | Botón de volver arriba. "Rollback" como microcopy del "back to top". |

**Regla del RANK:** no es autoevaluación. Se deriva de evidencia: 1 = curso, 2 = proyecto personal, 3 = usado en un proyecto entregado, 4 = en producción, 5 = en equipo o con premio. Así se evita repetir las barras al 0% del portafolio actual.

### 10.2 Navegación y página
- El **menú de pantalla completa** reemplaza a la píldora y a la paleta Ctrl+K: es lo mismo. Ítems con nombre real y claro, con el guiño como subtítulo: PROJECTS, STACK, JOURNEY, CERTIFICATES, CONTACT, SYSTEM (idioma, tema, CV).
- Flechas ↑↓ para moverse, Enter para entrar, Esc para cerrar. En móvil, toque directo, con áreas de al menos 44 px aunque el texto se solape visualmente.
- La página normal sigue siendo de scroll. Cada sección usa la palabra gigante de fondo y el número grande.
- Projects es una lista estilo Social Link: numeral de arcano (0 Fool … XXI World), nombre, RANK. Las cartas de Yu-Gi-Oh quedan como vista al abrir un proyecto.

### 10.3 Paleta (*)
- Base Dark Hour: verde muy oscuro a verde azulado en degradado, el equivalente verde del azul de P3R.
- Acento: neón verde y blanco. Cian frío como secundario, sin púrpura.
- Tema Día: menta (el verde claro que elegiste).

### 10.4 Pixel art y P3R: resuelto
P3R manda en el marco (menú, tipografía, transiciones, rangos). El pixel art vive dentro: avatar, esferas y sprites decorativos.
**Avatar (decidido):** un solo personaje pixel en hero, Journey y esferas. La silueta plana P3R aparece solo como recorte grande de fondo, sin rostro, como en las capturas.
Así se evita el collage de dos estilos y se hace un solo juego de assets de personaje.

### 10.5 Riesgos
- **Legibilidad:** el interlineado casi cero y la rotación solo en formas; el texto corrido queda recto. Contraste mínimo AA en cian sobre verde.
- **Movimiento:** barridos y círculos son grandes. Cero destellos por encima de 3 por segundo, y todo desactivado con `prefers-reduced-motion`.
- **Lectores de pantalla:** las palabras gigantes y los números decorativos van `aria-hidden`.
- **Rendimiento:** degradados con CSS o SVG, sin imágenes pesadas ni desenfoques grandes.
- **Alcance:** esta interfaz pasa a ser la parte más costosa del proyecto. El Journey con calendario y el menú completo van en la fase 3, no en la v1.
