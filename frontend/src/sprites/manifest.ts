/**
 * Lista de sprites que Codex debe generar (plan §14.6). El frontend ya los espera con este tamaño y
 * esta cantidad de cuadros. Para activar uno:
 *   1. Guarda la tira horizontal en `public/sprites/<archivo>` (cuadros uno al lado del otro, fondo transparente).
 *   2. Cambia `ready` a `true` aquí.
 * Mientras `ready` sea false se ve una caja de marcador, así la maquetación y los movimientos ya se pueden probar.
 */
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
): SpriteSlot => ({ id, label, width, height, frames, fps, file: `${id}.webp`, ready: false });

export const sprites = {
  // Reparto (plan §14.1)
  eco: slot('eco', 'Eco · late al ritmo, boca abierta/cerrada', 70, 80, 2, 3.3),
  butterfly: slot('butterfly', 'Mariposa · alas abiertas/cerradas', 45, 35, 2, 6),
  argenta: slot('argenta', 'Argenta · alas arriba/abajo', 80, 60, 2, 3.3),
  tuerca: slot('tuerca', 'Tuerca · ojos normales/glitch', 48, 64, 2, 1),
  lumi: slot('lumi', 'Lumi · con farol, parpadea', 60, 75, 2, 1),
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
