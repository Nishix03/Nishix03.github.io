/**
 * Catálogo de clips por acción (paquete de Codex, ver art/sprites/ready-to-integrate/IMPLEMENTATION.md).
 * clips.json lo genera `npm run sprites:clips`; aquí solo le damos tipos.
 * Cada clip es una tira horizontal: ancho total = ancho de cuadro × cuadros.
 *
 * Conceptos para Iván:
 * - `type` en TypeScript describe la FORMA de un objeto (sus campos y tipos), algo parecido a una clase de Java
 *   que solo tiene atributos. Solo existe al compilar: no genera código en el navegador.
 * - `export` hace visible un tipo o función para otros archivos (como `public` en Java).
 * - Quien lo usa: scripts/clips.ts y los componentes que dibujan <Clip>, para saber tamaño, cuadros y velocidad.
 */
// Importa el JSON generado. TypeScript deduce los tipos de sus campos automáticamente (resolveJsonModule).
import data from './clips.json';

// Un clip = una animación guardada como tira horizontal de cuadros dentro de una sola imagen.
export type Clip = {
  /** Nombre único del clip; solo puede ser uno de los que existen en clips.json. */
  id: ClipId;
  /** Ancho en píxeles de UN cuadro (no de toda la tira). */
  width: number;
  /** Alto en píxeles de un cuadro. */
  height: number;
  /** Cantidad de cuadros que tiene la tira. */
  frames: number;
  /** Cuadros por segundo: la velocidad de la animación. */
  fps: number;
  /** true si la animación se repite sin parar; false si se reproduce una vez. */
  loop: boolean;
  /** Duración total de una pasada, en milisegundos. */
  durationMs: number;
  /** Punto de anclaje (x, y): el pixel del dibujo que se coloca sobre su posición en la página. */
  anchor: { x: number; y: number };
  /** Nombre del archivo de imagen (.webp) de la tira. */
  file: string;
  // Los campos con `?` son opcionales (pueden no existir). Marcan cuadros clave de la animación:
  /** Cuadro en que ocurre el "golpe" o momento importante. */
  hitFrame?: number;
  /** Cuadro donde la pose se mantiene mientras se sostiene la acción. */
  sustainFrame?: number;
  /** Cuadro donde se suelta la pose. */
  releaseFrame?: number;
  /** Último cuadro útil de la animación. */
  terminalFrame?: number;
  /** Cuadro fijo que se muestra si el usuario pidió reducir el movimiento. */
  reducedMotionFrame?: number;
};

// keyof typeof data.clips = "las claves del objeto clips del JSON". Así ClipId es la unión de todos los nombres
// de clip válidos y TypeScript avisa si escribes uno que no existe (parecido a un enum de Java, pero generado).
export type ClipId = keyof typeof data.clips;

// Dado un id, devuelve el Clip completo: copia los datos del JSON (spread `...`) y añade el propio id.
export const clip = (id: ClipId): Clip => ({ id, ...data.clips[id] });

/**
 * Qué clip usa cada acción de cada sección (hero.ArrowUp → boyfriend-up…).
 * Tabla acción -> clip, tal cual viene del JSON.
 */
export const actions = data.actions;
