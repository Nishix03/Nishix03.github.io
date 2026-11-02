# Plan de mejora de diseño: 6 prototipos de Chiclayo

Borrador. Destino final: `docs/` del repo `prototipos-web-chiclayo`.
Se apoya en la lista de verificación del portafolio (§13 de `plan-diseno-frontend-portafolio.md`), en tus ADR 008 y 009, y en lo que vi hoy en las páginas publicadas.

**Límite de lo que vi:** solo la primera pantalla de cada rubro en escritorio, con el 3D en movimiento. No vi el scroll, el móvil ni la función estrella. Lo demás sale de tu README y tus ADR.

## 1. Cómo trabajas (inferido de tu repo)

Es una inferencia mía a partir de `PLAN.md`, `PROGRESO.md`, los ADR, los scripts y tu `CLAUDE.md`. Corrígeme donde me equivoque.

| Rasgo de tu proceso | Evidencia | Cómo lo respeta este plan |
|---|---|---|
| Planificas por escrito antes de construir, con un «por qué» para cada elección | `PLAN.md` con tabla de stack y columna «Por qué» | Este documento viene antes de tocar código |
| Documentas cada decisión como ADR | ADR 000 a 009 | Se proponen ADR 010 a 012 (§6) |
| Conviertes un «no me gusta» en reglas verificables | La «olla» fue rechazada y de ahí salió el ADR 009. En LeeContigo hiciste lo mismo con las garantías G1 a G5 (por ejemplo, «ninguna pista contiene la respuesta») y las probaste con Playwright | Cada rechazo de Iván agrega un criterio a la lista; lo de juicio se vuelve medible cuando se puede |
| Exploras 3 direcciones sobre la página real y eliges con tabla de puntaje | `?direccion=a\|b\|c` y `docs/visual/<rubro>.md` | Cada rubro hace A, B y C; lo de abajo es solo la hipótesis A |
| Todo se dirige por datos | `negocio.json` + `rubro.schema.json`; el build falla con error en español | Los componentes nuevos se configuran desde JSON y se validan al construir |
| Mides con herramientas propias, no a ojo | Scripts `control`, `lighthouse` (mediana de 5), `video`, `hoja` | Se amplía el Control en vez de revisar a ojo |
| Trabajas en ciclos cortos y trazables | Un rubro por rama y PR con checks; `PROGRESO.md` para retomar | Se mantiene |
| Das autonomía con reglas de parada | Modo autónomo con condiciones explícitas | Se mantiene, con aprobación tuya en el criterio 7 |
| Aprendes mientras construyes | «Un ejercicio práctico por fase»; tu `CLAUDE.md` pide explicar cada cambio | Cada fase lleva un ejercicio y una explicación en español |
| Eres honesto con el contenido | Aviso «(demo)», sin inventar resultados | Se mantiene |
| Piensas con sistemas de progresión y referencias | Niveles y XP en LeeContigo, plan de reparto de commits, colección de referencias que combinas | La gamificación aparece solo como mecánica sutil y como hipótesis, nunca impuesta |

## 2. Principios

1. **Cada decisión se explora y se documenta, no se asume.** Los puntos siguientes son hipótesis para que las pruebes con tu método de 3 direcciones.
2. **Los gustos personales entran como mecánicas de interfaz**, no como tema ni personajes (menú de comandos, rangos, cartas, fases del día). Son negocios reales y el criterio 6 pide identidades distintas.
3. **Una sola idea nueva por rubro**, ligada a su función estrella.
4. **No se migra a Astro, React ni Tailwind.** El repo ya es Vite + JavaScript vanilla + Three.js + GSAP, con ganchos `data-*` y pruebas. Tu skill de stack dice respetar lo existente. Coinciden GSAP, Three.js, Prettier, Playwright y axe.
5. **Reglas de movimiento de §11 del portafolio:** solo `transform`, `opacity`, `filter` y `clip-path`; nada de `transition: all`; versión reducida siempre.
6. **Rendimiento según el ADR 008.** No se agrega 3D nuevo; el peso nuevo se compensa.

## 3. Diagnóstico visual de hoy

| Rubro | Lo que vi | Fortaleza | Riesgo frente a los criterios |
|---|---|---|---|
| Restaurante «Sabores del Norte» | Cuencos 3D con ingredientes sobre terracota, tarjeta de titular arriba a la izquierda | La más fuerte y propia | La tarjeta del titular es pequeña |
| Barbería «Filo» | Negro y dorado, letras cromadas, caja centrada con borde dorado | Cromo llamativo; «Espera hoy» en la cabecera | Caja centrada tipo plantilla (criterio 4); móvil en 86 |
| Dental «Sonrisa Clara» | Burbujas de vidrio menta, titular en pregunta | Titular claro y funcional | Burbujas genéricas, sonrisa no visible (criterio 3); menta parecido al spa (criterio 6) |
| Spa «Remanso» | Fondo verde grisáceo casi liso, ondas casi invisibles | Calma y legibilidad | **El más plano** (criterio 4); verde parecido al dental (criterio 6) |
| Veterinaria «Trufa» | Crema con huesos y pelotas 3D, barra roja de urgencias | Alegre, con identidad | No evaluado más allá del hero |
| Gimnasio «Latido» | Lima neón sobre negro con ondas de pulso | Fuerte y coherente | Contraste del texto pequeño sobre las ondas |

## 4. Hipótesis A por rubro

Cada una se enfrenta a una B y una C que se definen en el paso 2 de cada rubro. Estas son solo el punto de partida.

| Rubro | Hipótesis A | Mecánica | Cambios de datos (`negocio.json` / esquema) |
|---|---|---|---|
| **Spa** (prioridad 1) | Agua como protagonista que reacciona al cursor y cambia con la hora; cita en 3 pasos con un dial de fases del día; paleta cálida; paquetes escalonados; revisar el comparador antes/después | Dial de fases | `paquetes[].franja` (amanecer, tarde, noche) |
| **Dental** (prioridad 2) | Las piezas de vidrio se cierran en sonrisa al cargar; paleta azul glaciar y blanco; cuestionario con barra segmentada sobria | Barra de progreso | Sin cambios; conservar la validación existente |
| **Barbería** (prioridad 3) | Hero recompuesto, con el titular reflejado en el cromo y el botón dentro de la escena; barbero elegido con cartas | Selector de personaje | `barberos[].especialidad` y `espera` |
| **Gimnasio** (prioridad 4) | Horario como menú de comandos con la clase en curso en fragmento diagonal; intensidad I a V por clase; «Mi semana» local | Menú de comandos | `clases[].intensidad` |
| **Veterinaria** (prioridad 5) | Carta de mascota generada en el navegador, con holo; carnet de vacunas con sellos | Carta coleccionable | `vacunas[].sello` |
| **Restaurante** (prioridad 6) | Solo pulido: tarjeta del titular más grande, carta como lista de comandos, total animado | Menú de comandos | Sin cambios; no tocar `carrito.js`, la comanda ni las reservas |

**Cuidados concretos**
- **Spa:** el shader cuesta en móvil (hoy 93). Si baja de 85, se aligera. El comparador antes/después con datos de demo contradice tu decisión del dental de «no fabricar resultados».
- **Dental:** son datos de salud, así que sin tono de juego. Conservar «sin antes y después», el aviso de orientación y el sello «COP 00000 (demo)».
- **Barbería:** móvil en 86; no se agrega peso 3D.
- **Gimnasio:** el texto inclinado solo en formas, nunca en el texto corrido.
- **Veterinaria:** la carta se genera en el navegador, sin subir fotos ni guardar datos. Holo solo con puntero fino, hasta 8°, y apagado con movimiento reducido.
- **Restaurante:** escritorio en 89; no empeorar.

## 5. Tabla de puntaje para elegir entre A, B y C

Sigue tu tabla actual (exigencias, identidad distinta, costo de rendimiento), con dos criterios nuevos.

| Criterio | Qué mide | Tipo |
|---|---|---|
| Exigencias del ADR 009 | Pasa los puntos medibles del Control | Puerta: si no pasa, queda fuera |
| Identidad distinta | No se parece a los otros 5 en la hoja de contactos | Puntaje |
| Costo de rendimiento | Lighthouse móvil y escritorio frente a la línea base | Puntaje |
| **Ajuste al negocio (nuevo)** | Un dueño de ese rubro en Chiclayo lo vería como suyo | Puntaje, juicio de Iván |
| **Costo de construir (nuevo)** | Piezas nuevas de `core/` frente a piezas reutilizadas | Puntaje |

## 6. ADR propuestos (en el repo de prototipos)

- **ADR 010 – Mecánicas de interfaz por rubro:** qué se toma de tus gustos y qué no, con el motivo.
- **ADR 011 – Paletas separadas:** dental pasa a azul glaciar y blanco; spa a arena, ámbar y arcilla. Los demás se mantienen. Con esto el verde de tu portafolio no coincide con ningún prototipo, salvo el lima neón del gimnasio.
- **ADR 012 – Componentes compartidos en `core/componentes/`:** `lista-comandos`, `carta-seleccion`, `paso-progreso`, `contador-animado`. Cada rubro los viste con sus tokens para no parecerse.
- **ADR 013 – Agente como marcador de posición mientras no haya backend** (ver §9).

## 7. Ciclo por rubro

1. **Revisión:** Iván mira la página actual contra los criterios 1 a 6 y anota qué falla.
2. **Tres direcciones** (A, B, C) como variantes de la página real, capturadas con `npm run control -- <rubro> <a|b|c>`.
3. **Puntaje** en `docs/visual/<rubro>.md` y **aprobación de Iván** con los storyboards (criterio 7).
4. **Construcción** con Control de exigencias al inicio y al final; los esquemas y el build validan los datos nuevos.
5. **Rendimiento, axe y teclado** en verde; una rama y un PR con los checks.
6. **Cierre:** se actualiza `PROGRESO.md` y se escribe el ADR del rubro.
7. **Ejercicio práctico** del rubro, con una explicación en español del concepto nuevo (por ejemplo, `clip-path` para el fragmento diagonal o por qué un shader cuesta en móvil).

Un rubro se cierra completo antes de empezar el siguiente. La regla de salida del tope de 6-8 semanas del portafolio sigue vigente.

## 8. Orden y herramientas

- **Orden:** 0) piezas compartidas y el marcador del asistente en `core/` (§9), 1) spa, 2) dental, 3) barbería, 4) gimnasio, 5) veterinaria, 6) restaurante. Por impacto: primero los que fallan criterios.
- **Scripts a ampliar (no a crear desde cero):**
  - `control`: añadir el criterio 6 (hoja de contactos con los 6 heros) como comparación automática.
  - `hoja.mjs`: guardar la hoja por ronda para compararla con la anterior.
- **Skills:** las del plan del portafolio (§12), con la corrección de tu ADR 009: `frontend-design` con las exigencias, `copy-edit` y `brand-voice`, y las auditorías que corrigen sin borrar.

## 9. Agente de IA: marcador de posición (solo interfaz)

**Estado: por implementar, solo frontend.** Sin backend y sin funcionalidad real. Es un marcador de posición que muestra cómo se vería el asistente en el sitio de un negocio.

### 9.1 Qué es y qué no es
- Es un componente visual: no entiende preguntas, no consulta ningún modelo y no guarda nada.
- **No es un agente de IA** y no se presenta como tal, ni en la web del prototipo ni en el portafolio.
- Riesgo a evitar: un chat que finge responder engaña al visitante. De ahí las reglas de abajo.

### 9.2 Reglas de honestidad
- Rótulo visible: «Vista previa · asistente virtual (próximamente)».
- **No hay campo de texto que simule responder.** En su lugar, un ejemplo estático de conversación con la etiqueta «Ejemplo» y un botón «Escribir por WhatsApp» con el mensaje ya armado.
- No simula escritura («...»), ni respuestas distintas según lo que se escriba.
- Dental y veterinaria: el ejemplo no contiene consejo clínico ni respuestas sobre salud.
- No recoge datos.

### 9.3 Contrato mínimo en `negocio.json`
```json
"agente": {
  "activo": true,
  "estado": "proximamente",
  "nombre": "Asistente de Sabores del Norte",
  "ejemplo": [
    { "de": "visitante", "texto": "¿Tienen delivery?" },
    { "de": "asistente", "texto": "Sí, dentro de Chiclayo (demo). Arma tu comanda por WhatsApp." }
  ]
}
```
El esquema lo valida. Si falta `ejemplo` o `estado` no es `"proximamente"`, el build se detiene con un error en español, como ya haces con el dental. Con `"activo": false` no se renderiza nada. El texto del ejemplo debe coincidir con los datos del demo (se revisa en el criterio 10 de §13 del portafolio).

### 9.4 Ejemplo por rubro

| Rubro | Pregunta de ejemplo |
|---|---|
| Restaurante | «¿Tienen delivery?» |
| Barbería | «¿Hay espera hoy?» |
| Dental | «¿Cuánto cuesta una limpieza?» (precio «desde», sin consejo clínico) |
| Spa | «¿Cuánto dura el masaje?» |
| Veterinaria | «¿Atienden urgencias?» (responde 24 h y el botón de llamar) |
| Gimnasio | «¿Qué clase hay ahora?» |

### 9.5 Diseño, rendimiento y pruebas
- Componente `asistente-vista-previa` en `core/componentes/`, junto al botón flotante de WhatsApp, vestido con los tokens de cada rubro.
- Peso mínimo: HTML, CSS y muy poco JavaScript. Carga con `import()` tras el primer pintado, no cuenta para el LCP y Lighthouse no puede bajar.
- Accesibilidad: `role="dialog"`, foco atrapado y devuelto al cerrar, Esc cierra, todo con teclado.
- Animación según §11 del portafolio: apertura 300 ms, cierre 150 ms, versión reducida.
- Pruebas con Playwright: abre y cierra, teclado, rótulo visible, enlace de WhatsApp correcto, `activo: false` no renderiza, y axe en 0.

### 9.6 Camino futuro (no se implementa ahora)
El bloque `agente` reserva el lugar. Cuando exista un backend, `estado` pasaría a `"activo"` y se añadiría un `endpoint`, sin rediseñar la interfaz.
Las versiones del borrador anterior (asistente por reglas, embeddings en el navegador, modelo por endpoint) quedan **fuera de este plan**. Si se retoman, exigen un ADR nuevo con reglas de seguridad: llaves de API fuera del navegador, límite de uso, y la Ley 29733 de protección de datos personales si hay datos de salud (por verificar con una fuente oficial).

### 9.7 ADR 013
«Agente como marcador de posición mientras no haya backend»: contexto (webs sin backend), opciones (solo interfaz, reglas, modelo por endpoint), decisión (solo interfaz) y consecuencias.

### 9.8 Relación con el portafolio
- El marcador **no sostiene** el mensaje «agentes de IA para negocios». El hero sigue con «AI-powered features» y el hito «Demo de IA publicado» del Journey sigue bloqueado.
- Esto cambia una decisión anterior del portafolio, donde el demo de IA sería un agente sobre los prototipos. Hoy la única IA real que puedes mostrar es LeeContigo.

## 10. Decisiones pendientes de Iván

1. ¿Esta lectura de tu proceso (§1) es correcta? Corrige o añade.
2. ¿Aceptas «mecánica, no tema» como punto de partida, sabiendo que A, B y C pueden contradecirlo?
3. ¿Cambias la paleta del dental y del spa?
4. Spa: ¿quitas el comparador antes/después o se mantiene con la etiqueta «demo»?
5. Carta de mascota y «Mi semana»: ¿te parecen buena idea o demasiado juego para esos negocios?
6. ¿Basta el ejemplo estático, o quieres chips de preguntas con respuestas fijas? Si los hay, irían siempre rotulados como simulación.
7. ¿Se construirá un demo de IA real aparte para el portafolio, o el mensaje de IA queda solo con LeeContigo?
