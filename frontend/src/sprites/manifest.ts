/**
 * Slots de integración: el catálogo generado aporta las dimensiones y los ciclos reales.
 * Ejecuta `npm run sprites:build` después de editar las fuentes en art/sprites.
 * Un ID ausente conserva el marcador para hacer visible un recurso pendiente.
 *
 * Conceptos para Iván:
 * - Un "slot" es un hueco reservado para una imagen pixel (adorno o icono). Si la imagen ya existe en el
 *   manifiesto generado, se usa su tamaño real (`ready: true`); si no, queda un marcador con medidas por defecto.
 * - `Record<string, X>` es un diccionario texto -> X, como un Map<String, X> de Java.
 * - `satisfies` comprueba que un objeto cumple un tipo SIN perder los nombres exactos de sus claves.
 * - Lo usan los componentes de la web que pintan adornos (brújula, flechas de ritmo, iconos del Stack).
 */
// Manifiesto generado por `npm run sprites:build`: describe las imágenes ya empaquetadas en public/sprites.
import packed from '../../public/sprites/manifest.json';

// Descripción de un hueco de sprite: lo que necesita un componente para reservar espacio y cargar la imagen.
export type SpriteSlot = {
  /** Nombre corto que se usa en los componentes. */
  id: string;
  /** Descripción legible (por ejemplo para texto alternativo/accesibilidad). */
  label: string;
  /** Tamaño de UN cuadro en pixeles CSS. */
  width: number;
  height: number;
  /** Cuadros de la tira. 1 = imagen fija (el movimiento lo da el CSS). */
  frames: number;
  /** Cuadros por segundo de la tira (solo si frames > 1). */
  fps: number;
  /** Nombre del archivo .webp. */
  file: string;
  /** true si la imagen real ya existe; false si es solo un marcador pendiente. */
  ready: boolean;
};

// Fábrica de slots: busca `id` en el manifiesto; si lo encuentra, usa sus medidas reales; si no, las que
// recibe por parámetro. `fps = 12` es un valor por defecto (como un parámetro opcional con valor, tipo
// sobrecarga de métodos en Java).
const slot = (
  id: string,
  label: string,
  width: number,
  height: number,
  frames: number,
  fps = 12,
): SpriteSlot => {
  // `as Partial<Record<...>>` le dice a TypeScript que cualquier id puede NO estar en el manifiesto
  // (Partial = todos los campos opcionales); por eso `asset` puede ser undefined.
  const asset = (
    packed.sprites as Partial<
      Record<string, { width: number; height: number; frames: number; fps: number; file: string }>
    >
  )[id];
  // Operador ternario `cond ? a : b`, igual que en Java: con asset -> datos reales; sin asset -> marcador.
  return asset
    ? {
        id,
        label,
        width: asset.width,
        height: asset.height,
        frames: asset.frames,
        fps: asset.fps,
        file: asset.file,
        ready: true,
      }
    : { id, label, width, height, frames, fps, file: `${id}.webp`, ready: false };
};

// Catálogo de adornos. La clave (compass, arrowLeft...) es el nombre que usan los componentes;
// los argumentos de slot() son: id de archivo, etiqueta, ancho, alto y número de cuadros.
export const sprites = {
  // El reparto (Boyfriend, mariposa, Blue-Eyes, Springtrap, Frisk) vive en clips.ts: un clip por acción.
  // Adornos (plan §14.1b)
  compass: slot('compass', 'Brújula del diario', 36, 36, 1),
  menace: slot('menace', 'Flechas ゴゴゴ de LATEST', 40, 24, 1),
  arrowLeft: slot('arrow-left', 'Flecha de ritmo ←', 27, 27, 1),
  arrowDown: slot('arrow-down', 'Flecha de ritmo ↓', 27, 27, 1),
  arrowUp: slot('arrow-up', 'Flecha de ritmo ↑', 27, 27, 1),
  arrowRight: slot('arrow-right', 'Flecha de ritmo →', 27, 27, 1),
  // Iconos del Stack (plan §16.4): 36×28, uno por tecnología
  iconNishixAI: slot('icon-nishixai', 'Icono NishixAI (chat)', 36, 28, 1),
// Verifica que cada entrada es un SpriteSlot, pero conserva el tipo exacto de cada clave.
} satisfies Record<string, SpriteSlot>;

// Unión de los nombres válidos de sprites (compass, arrowLeft...). Evita escribir un nombre inexistente.
export type SpriteId = keyof typeof sprites;

/** Iconos de tecnología: el archivo es `icon-<id>.webp`. */
// Los iconos de tecnología se piden por id (por ejemplo "react" -> icon-react.webp) y no están en la lista fija
// de arriba porque cambian según las tecnologías de content/*/stack.ts.
export const techIconSlot = (id: string): SpriteSlot => ({
  ...slot(`icon-${id}`, `Icono ${id}`, 36, 28, 1),
});
