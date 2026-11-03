/**
 * Catálogo de clips por acción (paquete de Codex, ver art/sprites/ready-to-integrate/IMPLEMENTATION.md).
 * clips.json lo genera `npm run sprites:clips`; aquí solo le damos tipos.
 * Cada clip es una tira horizontal: ancho total = ancho de cuadro × cuadros.
 */
import data from './clips.json';

export type Clip = {
  id: ClipId;
  width: number;
  height: number;
  frames: number;
  fps: number;
  loop: boolean;
  durationMs: number;
  anchor: { x: number; y: number };
  file: string;
  hitFrame?: number;
  sustainFrame?: number;
  releaseFrame?: number;
  terminalFrame?: number;
  reducedMotionFrame?: number;
};

export type ClipId = keyof typeof data.clips;

export const clip = (id: ClipId): Clip => ({ id, ...data.clips[id] });

/** Qué clip usa cada acción de cada sección (hero.ArrowUp → boyfriend-up…). */
export const actions = data.actions;
