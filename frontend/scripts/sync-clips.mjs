/**
 * Copia el paquete de clips aprobado (art/sprites/ready-to-integrate) a la web:
 *  - las tiras WebP van a public/sprites/clips/
 *  - los metadatos que usa el código van a src/sprites/clips.json (sin cuadros sueltos ni prompts)
 * Ejecuta `npm run sprites:clips` cada vez que Codex entregue una versión nueva del paquete.
 */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const pack = path.join(root, 'art/sprites/ready-to-integrate');
const out = path.join(root, 'public/sprites/clips');
await mkdir(out, { recursive: true });

const manifest = JSON.parse(await readFile(path.join(pack, 'manifest.json'), 'utf8'));
const keep = ['hitFrame', 'sustainFrame', 'releaseFrame', 'terminalFrame', 'reducedMotionFrame'];
const clips = {};

for (const [id, clip] of Object.entries(manifest.clips)) {
  const file = path.basename(clip.file);
  await copyFile(path.join(pack, clip.file), path.join(out, file));
  clips[id] = {
    width: clip.width,
    height: clip.height,
    frames: Array.isArray(clip.frames) ? clip.frames.length : clip.frames,
    fps: clip.fps,
    loop: clip.loop,
    durationMs: clip.durationMs,
    anchor: { x: clip.anchor.x, y: clip.anchor.y },
    file: `clips/${file}`,
    ...Object.fromEntries(keep.filter((key) => key in clip).map((key) => [key, clip[key]])),
  };
}

await writeFile(
  path.join(root, 'src/sprites/clips.json'),
  `${JSON.stringify({ clips, actions: manifest.actions }, null, 2)}\n`,
);
console.log(`${Object.keys(clips).length} clips copiados a public/sprites/clips`);
