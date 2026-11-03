/**
 * Slots de integración: el catálogo generado aporta las dimensiones y los ciclos reales.
 * Ejecuta `npm run sprites:build` después de editar las fuentes en art/sprites.
 * Un ID ausente conserva el marcador para hacer visible un recurso pendiente.
 */
import packed from '../../public/sprites/manifest.json';

export type SpriteSlot = {
  /** Nombre corto que se usa en los componentes. */
  id: string;
  label: string;
  /** Tamaño de UN cuadro en pixeles CSS. */
  width: number;
  height: number;
  /** Cuadros de la tira. 1 = imagen fija (el movimiento lo da el CSS). */
  frames: number;
  /** Cuadros por segundo de la tira (solo si frames > 1). */
  fps: number;
  file: string;
  ready: boolean;
};

const slot = (
  id: string,
  label: string,
  width: number,
  height: number,
  frames: number,
  fps = 12,
): SpriteSlot => {
  const asset = (
    packed.sprites as Partial<
      Record<string, { width: number; height: number; frames: number; fps: number; file: string }>
    >
  )[id];
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
} satisfies Record<string, SpriteSlot>;

export type SpriteId = keyof typeof sprites;

/** Iconos de tecnología: el archivo es `icon-<id>.webp`. */
export const techIconSlot = (id: string): SpriteSlot => ({
  ...slot(`icon-${id}`, `Icono ${id}`, 36, 28, 1),
});
