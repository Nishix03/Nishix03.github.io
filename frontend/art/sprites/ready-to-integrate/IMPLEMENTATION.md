# Integración pendiente: sprites por acción

## Estado de esta entrega

Este paquete no está importado por la aplicación. Se prepararon los recursos y se retiraron los archivos de Lumi. No se modificó ningún archivo de `src/`: `runtime-baseline.json` conserva sus hashes anteriores para verificarlo. El código existente que todavía utiliza el slot `lumi` debe sustituirse al implementar Frisk; no se renombró ese slot por adelantado.

## Archivos y coordenadas

- `manifest.json`: catálogo de 19 clips, mapa `actions` por sección, fps, duración, repetición, ancla y cuadros con offsets.
- `sheets/`: una tira horizontal PNG y WebP por acción; ancho = cuadro × cantidad de cuadros.
- `keyframes/<clip>/`: PNG individuales, índices desde 00.
- `keyframes.css`: keyframes discretos y clases de demostración; no está importado en el sitio.
- `editable/`: una fuente Piskel por clip.
- `sources/` y `prompts.json`: originales de imagegen y prompts exactos.
- `validation.json`: conteo de cuadros distintos y comprobación de transparencia/WebP sin pérdida.
- `preview.html`: revisión independiente, sin servidor. Permite reproducir y avanzar por cuadros.

Las coordenadas `anchor` están en píxeles locales de cada cuadro: pies para personajes, centro para la mariposa y borde inferior central de la carta para la invocación. Todos los cuadros de un mismo atlas comparten escala. No recortar/reescalar cada pose por separado. Renderizar con `image-rendering: pixelated`.

## Hero: Boyfriend y flechas

| Entrada        | Clip              | Poses                                                             |
| -------------- | ----------------- | ----------------------------------------------------------------- |
| Sin tecla      | `boyfriend-idle`  | 6 cuadros a 10 fps: 600 ms, 100 BPM                               |
| ArrowUp / ↑    | `boyfriend-up`    | Anticipación, canto hacia arriba, sostén, recuperación            |
| ArrowDown / ↓  | `boyfriend-down`  | Anticipación, agacharse/canto hacia abajo, sostén, recuperación   |
| ArrowLeft / ←  | `boyfriend-left`  | Anticipación, inclinarse/cantar a izquierda, sostén, recuperación |
| ArrowRight / → | `boyfriend-right` | Anticipación, inclinarse/cantar a derecha, sostén, recuperación   |

Los cuatro clips direccionales tienen 4 cuadros a 12 fps y una caja común de 96×96. `hitFrame=1`, `sustainFrame=2`, `releaseFrame=3`. En `keydown`, seleccionar el clip correspondiente y encender únicamente su flecha. Si se mantiene pulsada la tecla, sostener el cuadro 2; en `keyup`, reproducir el 3 y volver a reposo. Una pulsación breve reproduce el clip completo. La última dirección pulsada tiene prioridad; los eventos `repeat` no deben reiniciar continuamente la anticipación.

Conservar la navegación por teclado del menú de inmediato: no esperar a la animación. Las flechas izquierda/derecha tienen su pose propia aunque la navegación actual use principalmente arriba/abajo. No capturar las flechas al escribir en el chat ni en campos de texto. Si hay controles táctiles de flecha, enviarles las mismas acciones. No añadir audio por esta entrega.

Quitar el rebote externo `.fx-eco-beat` del personaje cuando se use este ciclo dibujado, para evitar duplicar el movimiento. El pulso de las flechas puede permanecer. Migrar el slot anterior `eco` al nuevo catálogo explícitamente.

## Projects: carta de Yu-Gi-Oh y Blue-Eyes

El reverso es el remolino marrón/naranja de Yu-Gi-Oh, no un arcano personalizado. Utilizar `yugioh-card-back-still` (118×172, proporción 59:86) para todos los proyectos. Los títulos, numerales y datos del proyecto pertenecen al HTML exterior; no superponerlos sobre el reverso. Sustituir el dibujo de `TarotBack.astro` durante la implementación; no se hizo en esta entrega.

- `blue-eyes-idle`: 6 cuadros a 6 fps, reposo junto al expositor.
- `blue-eyes-hover`: 6 cuadros a 10 fps, aleteo junto a las cartas. Una capa externa puede aportar flotación suave.
- `blue-eyes-emerge-summon`: 12 cuadros a 12 fps, una sola reproducción al revelar un proyecto o seleccionar otro. El remolino abre un portal, aparecen cabeza/cuello, salen garras y torso, se libera la cola y el dragón termina sobre la carta.

La invocación es una composición completa de 256×256 que YA contiene la carta. Durante ese clip ocultar el reverso independiente para no duplicarlo. El ancla de la carta permanece fija; no trasladar ni normalizar por el tamaño del dragón. Al finalizar, mantener el cuadro 11. No encadenarlo directamente al reposo de 80×60: son composiciones distintas y provocaría un salto de escala. Los clips de 80×60 sirven para la presentación independiente junto a cartas; la invocación conserva su composición final.

Ante selecciones rápidas, terminar la invocación activa y conservar solo el último proyecto pendiente. Nunca apilar varios clips ni impedir que cambie el texto del proyecto. El CSS de una sola reproducción retiene el último cuadro sin mostrar un cuadro vacío.

## Stack: Springtrap

`walk-right` y `walk-left` tienen 8 cuadros a 10 fps, dibujados en el lugar. La traslación por el ancho disponible de `.stack__patrol` es responsabilidad del contenedor. No usar un sprite frontal para caminar de lado.

Secuencia propuesta: caminar a derecha → `turn-left` → caminar a izquierda → `turn-right` → caminar a derecha. Los giros tienen 4 cuadros y se reproducen una vez en los extremos. No espejar otra vez los clips izquierdos: ya están reflejados y el manifiesto lo declara.

`glitch-left` y `glitch-right` son pausas con un tirón de 4 cuadros. Activar aproximadamente cada 5 s al terminar el ciclo de paso, conservando la orientación actual; pausar la traslación mientras dura. Al acabar, reanudar el paseo. Retirar `.fx-walk` y `.fx-glitch` externos al migrar para que no dupliquen las poses.

## Hero: mariposa de P3

`p3-butterfly-fly`: 8 cuadros a 12 fps para la ruta actual del hero. La imagen bate alas sin desplazamiento dibujado; la trayectoria se aplica fuera de la tira. `p3-butterfly-hover`: 4 cuadros a 8 fps para pausas sobre la silueta. Mantener el centro del cuerpo como ancla para evitar saltos al abrir las alas.

## Contact: Frisk sustituye a Lumi

Eliminar el slot/consumidor `lumi` y usar `frisk`. El paquete contiene Frisk con pelo castaño, ojos horizontales, piel amarilla y jersey azul con dos rayas violetas. No tiene farol, impermeable, bufanda ni luciérnaga.

`frisk-idle`: 6 cuadros a 5 fps, reposo tranquilo. `frisk-greet`: 6 cuadros a 8 fps, saludo completo al entrar al viewport de Contact. También puede saludar al enfocar un enlace después de terminar la animación anterior. Volver al reposo al acabar; no reiniciar el saludo en cada movimiento del puntero. Sustituir la decoración de farol/luciérnaga al migrar.

## Reglas comunes para la implementación

Decorativos con `aria-hidden`; el contenido y los controles permanecen en HTML. Pausar fuera de pantalla y con `document.hidden`; máximo 8 sprites animados simultáneos. Con movimiento reducido, fijar `reducedMotionFrame`: reposo inicial para personajes y cuadro 11 para la invocación, sin trayectoria, parpadeo ni rebote. El CSS preparado incluye estas posiciones.

Conservar los créditos de ayuda de IA y añadir Undertale a la atribución de las obras. No activar los recursos nuevos cambiando a ciegas todos los `ready`: seleccionar clips por acción mediante el manifiesto.

## Verificación antes de integrar

Revisar cada acción en `preview.html`, especialmente las cuatro flechas, los giros de Springtrap y la salida desde la carta. Copiar solo el paquete aprobado a los recursos públicos, conectar los consumidores y comprobar después carga, foco, movimiento reducido, pausa, móviles y ausencia de saltos. Las pruebas de esta entrega verifican el paquete independiente, no afirman que la integración pendiente ya funcione en el sitio.

## Composición de la carta durante la invocación

La hoja final de invocación usa una copia idéntica del reverso preparado en todos los cuadros. La capa del dragón y el portal se extrajo con imagegen; el empaquetador la registra sobre esa carta fija para evitar que cambie de tamaño o posición. `layer-prompt.json` conserva ese prompt adicional.

El manifiesto ofrece `overlayFile` por separado y `fixedCard` con posición y tamaño dentro del cuadro. Se puede usar la hoja completa, o dibujar una sola carta y animar el overlay en la misma caja de 256×256. Son dos alternativas: no dibujar la carta independiente si se utiliza la hoja completa. Ambas mantienen la misma ancla. El overlay permite conservar una carta HTML/imagen inmóvil y controlar únicamente la aparición del dragón, sin tener que separar manualmente las capas.
