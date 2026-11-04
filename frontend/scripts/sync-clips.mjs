/**
 * sync-clips.mjs — sincroniza los clips de animación aprobados con la web.
 *
 * Copia el paquete de clips aprobado (art/sprites/ready-to-integrate) a la web:
 *  - las tiras WebP van a public/sprites/clips/
 *  - los metadatos que usa el código van a src/sprites/clips.json (sin cuadros sueltos ni prompts)
 * Ejecuta `npm run sprites:clips` cada vez que Codex entregue una versión nueva del paquete.
 *
 * Conceptos nuevos:
 *  - Un "clip" es una animación pixel-art guardada como UNA sola imagen ancha (una "tira"):
 *    todos los cuadros van uno al lado del otro y el CSS los va mostrando de uno en uno.
 *  - Este archivo es un script de Node.js (JavaScript que corre en tu PC, no en el navegador).
 *    Es parecido a escribir un main() en Java que lee y copia archivos.
 *  - La extensión .mjs le dice a Node que use módulos ES (ESM): se importa con `import ... from`,
 *    igual que en Java importas clases con `import java.nio.file.*`.
 */

// 'node:fs/promises' es el módulo de Node para leer/copiar/escribir archivos (como java.nio.file.Files).
// Sus funciones devuelven "promesas": operaciones lentas que se esperan con `await`.
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
// fileURLToPath convierte una URL de archivo (file:///C:/...) en una ruta normal del sistema.
import { fileURLToPath } from 'node:url';
// 'path' arma rutas sin preocuparse por si el sistema usa / (Linux/Mac) o \ (Windows).
import path from 'node:path';

// import.meta.url es la ubicación de ESTE archivo; con '../' subimos a la carpeta frontend/.
// (En módulos ESM no existe __dirname, por eso se calcula así.)
const root = fileURLToPath(new URL('../', import.meta.url));
// Carpeta de origen: el paquete que entrega el artista/herramienta de sprites.
const pack = path.join(root, 'art/sprites/ready-to-integrate');
// Carpeta de destino: todo lo que está en public/ se publica tal cual en la web.
const out = path.join(root, 'public/sprites/clips');
// Crea la carpeta de destino; `recursive` evita error si ya existe (como Files.createDirectories).
// `await` pausa aquí hasta que la operación termine (al nivel superior de un módulo ESM está permitido).
await mkdir(out, { recursive: true });

// Lee manifest.json (la "lista de contenidos" del paquete) y lo convierte en un objeto con JSON.parse.
const manifest = JSON.parse(await readFile(path.join(pack, 'manifest.json'), 'utf8'));
// Claves opcionales que, si el clip las trae, también se guardan (cuadros clave de la animación).
const keep = ['hitFrame', 'sustainFrame', 'releaseFrame', 'terminalFrame', 'reducedMotionFrame'];
// Aquí se acumulan los metadatos limpios de cada clip, indexados por su id.
const clips = {};

// Object.entries convierte el objeto en pares [id, datos] para recorrerlo con for...of.
for (const [id, clip] of Object.entries(manifest.clips)) {
  // basename deja solo el nombre del archivo (sin carpetas), p. ej. "ruta/a/x.webp" -> "x.webp".
  const file = path.basename(clip.file);
  // Copia la tira WebP desde el paquete hasta public/sprites/clips/.
  await copyFile(path.join(pack, clip.file), path.join(out, file));
  // Guarda solo los datos que el código de la web necesita para animar el clip.
  clips[id] = {
    width: clip.width,
    height: clip.height,
    // `frames` puede venir como lista de cuadros o como número; aquí siempre queda un número.
    frames: Array.isArray(clip.frames) ? clip.frames.length : clip.frames,
    fps: clip.fps, // cuadros por segundo
    loop: clip.loop, // si la animación se repite
    durationMs: clip.durationMs,
    anchor: { x: clip.anchor.x, y: clip.anchor.y }, // punto de referencia para colocar el clip
    file: `clips/${file}`,
    // Esparce (`...`) en este objeto solo las claves de `keep` que existan en el clip:
    // filtra las que están, arma pares [clave, valor] y los vuelve a convertir en objeto.
    ...Object.fromEntries(keep.filter((key) => key in clip).map((key) => [key, clip[key]])),
  };
}

// Escribe src/sprites/clips.json con sangría de 2 espacios (legible) y un salto de línea final.
// También se incluyen las "acciones" del manifiesto tal cual.
await writeFile(
  path.join(root, 'src/sprites/clips.json'),
  `${JSON.stringify({ clips, actions: manifest.actions }, null, 2)}\n`,
);
// Mensaje de confirmación en la terminal.
console.log(`${Object.keys(clips).length} clips copiados a public/sprites/clips`);
