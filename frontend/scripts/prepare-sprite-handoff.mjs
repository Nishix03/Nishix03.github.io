/**
 * prepare-sprite-handoff.mjs — prepara el "paquete de entrega" de clips de animación.
 *
 * Exports an offline asset kit. Does not write to src/ or public/.
 * (En español: genera un kit de recursos sin tocar el código de la web ni lo publicado. Su salida
 * queda en art/sprites/ready-to-integrate; después `sync-clips.mjs` copia a la web lo aprobado.)
 *
 * Qué hace, paso a paso:
 *  1. Lee imágenes fuente (cuadrículas con varias poses de un personaje).
 *  2. Recorta cada pose, la ajusta al tamaño final y limita sus colores a una paleta fija.
 *  3. Arma "tiras" (hojas) con los cuadros de cada clip, en PNG y WebP sin pérdida.
 *  4. Escribe manifest.json, CSS de animación, archivos .piskel editables, un reporte de
 *     validación y una página preview.html para revisar todo a ojo.
 *
 * Conceptos nuevos:
 *  - Node.js + ESM (.mjs): JavaScript ejecutado fuera del navegador, con `import ... from`.
 *    Se corre desde la terminal; es como un programa con main() en Java.
 *  - sharp: librería para manipular imágenes (recortar, redimensionar, componer, convertir).
 *  - Buffer: bloque de bytes en memoria (como byte[]). Una imagen "raw" tiene 4 bytes por píxel
 *    (R, G, B, A = rojo, verde, azul y transparencia).
 *  - async/await: las operaciones con archivos/imágenes son lentas y devuelven promesas;
 *    `await` espera su resultado. Funciona al nivel superior porque es un módulo ES.
 *  - assert: comprobación que lanza un error si algo no se cumple (como una aserción en Java).
 *  - Cuantizar: reducir colores a los de una paleta, cambiando cada píxel por el más parecido.
 */

// sharp: procesamiento de imágenes.
import sharp from 'sharp';
// fs/promises: crear carpetas, leer y escribir archivos (con promesas).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
// Convierte la URL de este archivo en una ruta del sistema (en ESM no existe __dirname).
import { fileURLToPath } from 'node:url';
// path: unir rutas sin preocuparse por / o \.
import path from 'node:path';
// assert/strict: comparaciones estrictas que lanzan error si fallan.
import assert from 'node:assert/strict';

// Carpeta frontend/ (un nivel arriba de scripts/).
const root = fileURLToPath(new URL('../', import.meta.url));
// Carpeta del kit de entrega; aquí se escribe todo lo generado.
const kit = path.join(root, 'art/sprites/ready-to-integrate');
// Colores permitidos (hexadecimal sin #). Cada píxel final será uno de estos.
const colors = [
  '0b111c',
  '171725',
  '303348',
  '50556d',
  '858b9b',
  'b3c2d4',
  'eef5ff',
  'ffffff',
  '092064',
  '1749ba',
  '238cdb',
  '49d4ff',
  '9feaff',
  '452a1b',
  '7a3e1d',
  'ba6224',
  'ef9c38',
  'ffd27a',
  '573b2a',
  '96694b',
  'dba174',
  'f3c58e',
  'ffe457',
  '778039',
  'a5ac54',
  '454b26',
  'c83345',
  'f34558',
  '813f9f',
  'b56ed2',
  '197e98',
  '07110c',
];
// Convierte cada color hex en [r, g, b]: separa pares de dígitos y parseInt(n, 16) los pasa a número.
const palette = colors.map((c) => c.match(/../g).map((n) => parseInt(n, 16)));
// range(a, n): lista de n números consecutivos desde a. Ej.: range(6, 3) = [6, 7, 8].
const range = (a, n) => Array.from({ length: n }, (_, i) => a + i);
// Definición de cada imagen fuente:
//  - columns/rows: cómo está repartida la cuadrícula de poses
//  - size: tamaño final de cada cuadro [ancho, alto]
//  - bodyHeight: altura objetivo del cuerpo del personaje dentro del cuadro
//  - clips: animaciones que se arman con esas poses (indices = qué poses y en qué orden,
//    fps = cuadros por segundo, loop = si se repite, action = descripción de para qué sirve,
//    mirror = reflejar horizontalmente, hitFrame/terminalFrame... = cuadros clave)
//  - anchor / preserveLayout: opciones especiales de colocación (ver más abajo)
const definitions = {
  'blue-eyes': {
    columns: 4,
    rows: 3,
    size: [80, 60],
    bodyHeight: 48,
    clips: {
      idle: {
        indices: range(0, 6),
        fps: 6,
        loop: true,
        action: 'Reposo sobre el expositor de Projects',
      },
      hover: {
        indices: range(6, 6),
        fps: 10,
        loop: true,
        action: 'Aleteo mientras flota junto a las cartas',
      },
    },
  },
  boyfriend: {
    columns: 4,
    rows: 3,
    size: [96, 96],
    bodyHeight: 76,
    clips: {
      idle: {
        indices: range(0, 6),
        fps: 10,
        loop: true,
        action: 'Reposo a 100 BPM: un ciclo cada 600 ms',
      },
    },
  },
  'boyfriend-arrows': {
    columns: 4,
    rows: 4,
    size: [96, 96],
    bodyHeight: 76,
    // Crea un clip por dirección: cada una usa 4 poses consecutivas de la cuadrícula.
    clips: Object.fromEntries(
      ['up', 'down', 'left', 'right'].map((direction, i) => [
        direction,
        {
          indices: range(i * 4, 4),
          fps: 12,
          loop: false,
          action: `Flecha ${direction}`,
          hitFrame: 1,
          sustainFrame: 2,
          releaseFrame: 3,
        },
      ]),
    ),
  },
  springtrap: {
    columns: 4,
    rows: 4,
    size: [64, 80],
    bodyHeight: 66,
    clips: {
      'walk-right': {
        indices: range(0, 8),
        fps: 10,
        loop: true,
        action: 'Patrulla hacia la derecha; traslación externa',
      },
      // mirror: true = misma animación reflejada, para no dibujar dos veces el lado contrario.
      'walk-left': {
        indices: range(0, 8),
        mirror: true,
        fps: 10,
        loop: true,
        action: 'Patrulla hacia la izquierda; reflejo horizontal documentado',
      },
      'turn-left': {
        indices: range(8, 4),
        fps: 10,
        loop: false,
        action: 'Giro de perfil derecho a izquierdo',
      },
      'turn-right': {
        indices: range(8, 4),
        mirror: true,
        fps: 10,
        loop: false,
        action: 'Giro de perfil izquierdo a derecho',
      },
      'glitch-left': {
        indices: range(12, 4),
        fps: 10,
        loop: false,
        action: 'Pausa y tirón ocasional mirando a la izquierda',
      },
      'glitch-right': {
        indices: range(12, 4),
        mirror: true,
        fps: 10,
        loop: false,
        action: 'Pausa y tirón ocasional mirando a la derecha',
      },
    },
  },
  'p3-butterfly': {
    columns: 4,
    rows: 3,
    size: [45, 35],
    bodyHeight: 25,
    // anchor 'center': el punto de referencia es el centro del cuerpo (vuela), no los pies.
    anchor: 'center',
    clips: {
      fly: {
        indices: range(0, 8),
        fps: 12,
        loop: true,
        action: 'Vuelo por la ruta del hero; trayectoria externa',
      },
      hover: {
        indices: range(8, 4),
        fps: 8,
        loop: true,
        action: 'Aleteo corto al detenerse sobre la silueta',
      },
    },
  },
  frisk: {
    columns: 4,
    rows: 3,
    size: [60, 75],
    bodyHeight: 63,
    clips: {
      idle: { indices: range(0, 6), fps: 5, loop: true, action: 'Reposo tranquilo en Contact' },
      greet: {
        indices: range(6, 6),
        fps: 8,
        loop: false,
        action: 'Saludo al entrar a Contact o al enfocar un enlace',
      },
    },
  },
  'yugioh-card-back': {
    columns: 1,
    rows: 1,
    size: [118, 172],
    bodyHeight: 168,
    clips: {
      // Un clip de un solo cuadro (imagen fija): fps 0.
      still: {
        indices: [0],
        fps: 0,
        loop: false,
        action: 'Reverso real de Yu-Gi-Oh: remolino marrón/naranja; reemplaza el arcano propio',
      },
    },
  },
  'blue-eyes-emerge': {
    columns: 4,
    rows: 3,
    size: [256, 256],
    // preserveLayout: mantiene la posición relativa respecto a la carta fija (el dragón "sale" de ella).
    preserveLayout: true,
    clips: {
      summon: {
        indices: range(0, 12),
        fps: 12,
        loop: false,
        action: 'Blue-Eyes sale de una carta de Yu-Gi-Oh al revelar un proyecto',
        terminalFrame: 11,
      },
    },
  },
};
// Manifiesto: el índice JSON con todos los clips generados; `actions` indica qué clip usa cada
// página (hero, projects, stack, contact) según la tecla o evento.
const manifest = {
  version: 2,
  status: 'ready-for-implementation-not-installed',
  palette: colors.map((c) => '#' + c),
  clips: {},
  actions: {
    hero: {
      idle: 'boyfriend-idle',
      ArrowUp: 'boyfriend-up',
      ArrowDown: 'boyfriend-down',
      ArrowLeft: 'boyfriend-left',
      ArrowRight: 'boyfriend-right',
      butterflyFly: 'p3-butterfly-fly',
      butterflyHover: 'p3-butterfly-hover',
    },
    projects: {
      card: 'yugioh-card-back-still',
      idle: 'blue-eyes-idle',
      hover: 'blue-eyes-hover',
      reveal: 'blue-eyes-emerge-summon',
    },
    stack: {
      right: 'springtrap-walk-right',
      left: 'springtrap-walk-left',
      turnLeft: 'springtrap-turn-left',
      turnRight: 'springtrap-turn-right',
      glitchLeft: 'springtrap-glitch-left',
      glitchRight: 'springtrap-glitch-right',
    },
    contact: { idle: 'frisk-idle', enter: 'frisk-greet' },
  },
};
// Crea las carpetas de salida (`recursive` evita error si ya existen).
await mkdir(path.join(kit, 'sheets'), { recursive: true });
await mkdir(path.join(kit, 'editable'), { recursive: true });
// Texto CSS que se va acumulando (una animación por clip).
let css = '/* Prepared keyframes. This file is NOT imported by the application. */\n';
// Reporte de validación: una fila por clip generado.
const report = [];

// bbox(): calcula el rectángulo mínimo ("bounding box") que contiene los píxeles visibles
// (alfa >= 180). `data` es el Buffer raw: el alfa de cada píxel está en el 4.º byte (índice + 3).
function bbox(data, width, height) {
  let left = width,
    top = height,
    right = -1,
    bottom = -1;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (data[(y * width + x) * 4 + 3] >= 180) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
  // Si no se encontró ningún píxel visible, el cuadro está vacío: se detiene con un error.
  assert(right >= left, 'Empty generated keyframe');
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}
// quantize(): cambia cada píxel por el color más cercano de la paleta.
// Los casi transparentes (alfa < 180) quedan totalmente transparentes; el resto, totalmente opaco.
function quantize(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 180) {
      data.fill(0, i, i + 4);
      continue;
    }
    let nearest = palette[0],
      distance = Infinity;
    for (const c of palette) {
      // Distancia al cuadrado entre dos colores (diferencias de R, G y B elevadas al cuadrado).
      const d = c.reduce((sum, v, j) => sum + (v - data[i + j]) ** 2, 0);
      if (d < distance) {
        distance = d;
        nearest = c;
      }
    }
    data.set(nearest, i);
    data[i + 3] = 255;
  }
  return data;
}
// cardAnchor(): en el clip del dragón saliendo de la carta, localiza la carta (por su color
// marrón/naranja) y devuelve su centro horizontal (x), su borde inferior (y) y su ancho.
// Sirve de punto fijo para alinear todos los cuadros.
function cardAnchor(data, width, height) {
  let left = width,
    right = -1,
    bottom = -1;
  for (let y = Math.floor(height * 0.4); y < height; y++) {
    for (let x = Math.floor(width * 0.2); x < width * 0.8; x++) {
      const i = (y * width + x) * 4;
      const [r, g, b, a] = data.subarray(i, i + 4);
      if (a >= 180 && r > 70 && r > g * 1.25 && g > b * 1.3 && g > 25) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
  }
  assert(right >= left, 'Card anchor not detected');
  return { x: (left + right) / 2, y: bottom, width: right - left + 1 };
}
// Bucle principal: procesa cada imagen fuente definida arriba.
// `[asset, def]` desestructura cada par [nombre, definición].
for (const [asset, def] of Object.entries(definitions)) {
  const input = path.join(kit, 'sources', asset + '.png');
  // metadata() da ancho, alto, etc. de la imagen.
  const meta = await sharp(input).metadata();
  // Solo para el dragón que sale de la carta: una capa extra alineada con la imagen principal.
  const registeredLayer = def.preserveLayout
    ? await sharp(path.join(kit, 'sources', 'blue-eyes-emerge-layer.png'))
        .resize(meta.width, meta.height, { kernel: 'nearest' })
        .png()
        .toBuffer()
    : undefined;
  const cells = [];
  // PASO 1: recorta cada pose de la cuadrícula.
  for (let i = 0; i < def.columns * def.rows; i++) {
    // Columna y fila de la celda i (% = resto de la división, Math.floor = parte entera).
    const col = i % def.columns,
      row = Math.floor(i / def.columns);
    const left = Math.round((col * meta.width) / def.columns),
      top = Math.round((row * meta.height) / def.rows);
    const width = Math.round(((col + 1) * meta.width) / def.columns) - left,
      height = Math.round(((row + 1) * meta.height) / def.rows) - top;
    // extract() recorta; raw() entrega los píxeles crudos (RGBA) como Buffer.
    const raw = await sharp(input)
      .extract({ left, top, width, height })
      .ensureAlpha()
      .raw()
      .toBuffer();
    // Rectángulo que contiene al personaje en esa celda.
    const bounds = bbox(raw, width, height);
    const card = def.preserveLayout ? cardAnchor(raw, width, height) : undefined;
    const content = registeredLayer
      ? await sharp(registeredLayer)
          .extract({ left, top, width, height })
          .ensureAlpha()
          .raw()
          .toBuffer()
      : raw;
    // Aplica la paleta y vuelve a convertir los bytes crudos en un PNG.
    const png = await sharp(quantize(content), { raw: { width, height, channels: 4 } })
      .png()
      .toBuffer();
    cells.push({ png, bounds, width, height, card });
  }
  const [width, height] = def.size;
  // A single scale per atlas preserves relative pose sizes; the summon locks the card anchor.
  // (Un único factor de escala por imagen mantiene las proporciones entre poses; se toma el menor
  // de varios límites para que ninguna pose se salga del cuadro.)
  const scale = def.preserveLayout
    ? Math.min(
        96 / cells[0].card.width,
        (width / 2 - 5) /
          Math.max(
            ...cells.map((c) =>
              Math.max(c.card.x - c.bounds.left, c.bounds.left + c.bounds.width - c.card.x),
            ),
          ),
        (height - 12) / Math.max(...cells.map((c) => c.card.y - c.bounds.top)),
      )
    : Math.min(
        def.bodyHeight / cells[0].bounds.height,
        (width - 6) / Math.max(...cells.map((c) => c.bounds.width)),
        (height - 6) / Math.max(...cells.map((c) => c.bounds.height)),
      );
  // frames: cuadros finales completos; overlays: solo el personaje sobre fondo transparente
  // (sin la carta), usado por el clip de la carta.
  const frames = [];
  const overlays = [];
  // Carta fija (reverso) que se dibuja detrás en el clip de la carta.
  const fixedCard = def.preserveLayout
    ? await sharp(path.join(kit, 'sheets', 'yugioh-card-back-still.png'))
        .trim({ background: '#00000000' })
        .resize(96, 140, { kernel: 'nearest' })
        .png()
        .toBuffer()
    : undefined;
  // PASO 2: ajusta y coloca cada pose dentro de un cuadro del tamaño final.
  for (const c of cells) {
    const box = c.bounds;
    // Tamaño reducido de la pose (mínimo 1 px); 'nearest' mantiene los bordes nítidos de pixel-art.
    const w = Math.max(1, Math.round(box.width * scale)),
      h = Math.max(1, Math.round(box.height * scale));
    const pose = await sharp(c.png)
      .extract(box)
      .resize(w, h, { kernel: 'nearest' })
      .png()
      .toBuffer();
    // Posición dentro del cuadro: centrada en horizontal; en vertical, apoyada abajo (a 3 px),
    // centrada (anchor 'center') o alineada a la carta (preserveLayout).
    const left = def.preserveLayout
        ? Math.round(width / 2 + (box.left - c.card.x) * scale)
        : Math.floor((width - w) / 2),
      top = def.preserveLayout
        ? Math.round(height - 5 + (box.top - c.card.y) * scale)
        : def.anchor === 'center'
          ? Math.floor((height - h) / 2)
          : height - h - 3;
    if (def.preserveLayout)
      overlays.push(
        await sharp({ create: { width, height, channels: 4, background: '#00000000' } })
          .composite([{ input: pose, left, top }])
          .png()
          .toBuffer(),
      );
    // Compone el cuadro final sobre un lienzo transparente (la carta fija detrás, si existe).
    frames.push(
      await sharp({ create: { width, height, channels: 4, background: '#00000000' } })
        .composite([
          ...(fixedCard
            ? [{ input: fixedCard, left: Math.round(width / 2 - 48), top: height - 5 - 140 }]
            : []),
          { input: pose, left, top },
        ])
        .png()
        .toBuffer(),
    );
  }
  // PASO 3: arma cada clip (animación) de esta imagen fuente.
  for (const [state, clip] of Object.entries(def.clips)) {
    // Identificador del clip, p. ej. "springtrap-walk-right".
    const id = asset === 'boyfriend-arrows' ? `boyfriend-${state}` : `${asset}-${state}`;
    // Cuadros del clip; si `mirror`, cada uno se refleja con flop() (espejo horizontal).
    // Promise.all espera a que todas las operaciones en paralelo terminen.
    const poses = await Promise.all(
      clip.indices.map((i) => (clip.mirror ? sharp(frames[i]).flop().png().toBuffer() : frames[i])),
    );
    // Une los cuadros en una tira horizontal (cada cuadro desplazado `width` píxeles).
    const png = await sharp({
      create: { width: width * poses.length, height, channels: 4, background: '#00000000' },
    })
      .composite(poses.map((input, i) => ({ input, left: i * width, top: 0 })))
      .png()
      .toBuffer();
    // Guarda la tira como PNG y como WebP sin pérdida (lossless).
    await writeFile(path.join(kit, 'sheets', id + '.png'), png);
    await sharp(png)
      .webp({ lossless: true })
      .toFile(path.join(kit, 'sheets', id + '.webp'));
    // Para la carta, también se guarda una tira solo con el personaje (sin carta).
    if (def.preserveLayout) {
      const overlaySheet = await sharp({
        create: { width: width * poses.length, height, channels: 4, background: '#00000000' },
      })
        .composite(
          clip.indices.map((index, i) => ({ input: overlays[index], left: i * width, top: 0 })),
        )
        .png()
        .toBuffer();
      await writeFile(path.join(kit, 'sheets', id + '-overlay.png'), overlaySheet);
      await sharp(overlaySheet)
        .webp({ lossless: true })
        .toFile(path.join(kit, 'sheets', id + '-overlay.webp'));
    }
    // Guarda también cada cuadro suelto (00.png, 01.png...) para revisarlos o editarlos.
    await mkdir(path.join(kit, 'keyframes', id), { recursive: true });
    for (let i = 0; i < poses.length; i++)
      await writeFile(
        path.join(kit, 'keyframes', id, `${String(i).padStart(2, '0')}.png`),
        poses[i],
      );
    // Punto de anclaje: la referencia para colocar el clip en la página
    // (borde inferior de la carta, centro del cuerpo o los pies).
    const anchor = def.preserveLayout
      ? { x: width / 2, y: height - 5, kind: 'card-bottom' }
      : def.anchor === 'center'
        ? { x: width / 2, y: height / 2, kind: 'body-center' }
        : { x: width / 2, y: height - 3, kind: 'feet' };
    // Registra el clip en el manifiesto con todos sus datos (tamaño, cuadros, duración, archivos...).
    // `...clip` copia las propiedades del clip; `indices: undefined` hace que no aparezca en el JSON.
    manifest.clips[id] = {
      ...clip,
      indices: undefined,
      id,
      width,
      height,
      frames: poses.length,
      durationMs: clip.fps ? Math.round((1000 * poses.length) / clip.fps) : 0,
      anchor,
      source: asset,
      sourceFrames: clip.indices,
      ...(def.preserveLayout
        ? {
            fixedCard: {
              x: width / 2 - 48,
              y: height - 5 - 140,
              width: 96,
              height: 140,
              source: 'yugioh-card-back-still',
            },
            overlayFile: `sheets/${id}-overlay.webp`,
          }
        : {}),
      mirrored: Boolean(clip.mirror),
      file: `sheets/${id}.webp`,
      png: `sheets/${id}.png`,
      cssName: `kf-${id}`,
      reducedMotionFrame: clip.terminalFrame ?? 0,
      keyframes: poses.map((_, i) => ({
        index: i,
        x: i * width,
        y: 0,
        file: `keyframes/${id}/${String(i).padStart(2, '0')}.png`,
      })),
    };
    // Genera el @keyframes CSS: en cada porcentaje de la línea de tiempo desplaza la tira
    // para mostrar el cuadro siguiente.
    css += `@keyframes kf-${id} { ${poses.map((_, i) => `${(100 * i) / poses.length}% { transform:translateX(-${i * width}px); }`).join(' ')} 100% { transform:translateX(-${(poses.length - 1) * width}px); } }\n`;
    // Explicit discrete poses give every frame equal time and hold the final one-shot pose.
    // (steps(1, end) = saltos bruscos entre cuadros, sin transición suave; `forwards` deja el último
    // cuadro visible cuando la animación no se repite.)
    css += `.clip-${id} { width:${width * poses.length}px; height:${height}px; image-rendering:pixelated;${poses.length > 1 ? ` animation:kf-${id} ${poses.length / clip.fps}s steps(1, end) ${clip.loop ? 'infinite' : '1 forwards'};` : ''} }\n`;
    // Archivo .piskel: formato del editor de pixel-art Piskel, para retocar el clip a mano.
    // base64 = bytes representados como texto, para poder guardar el PNG dentro del JSON.
    const layer = {
      name: state,
      opacity: 1,
      frameCount: poses.length,
      chunks: [
        {
          layout: [poses.map((_, i) => i)],
          base64PNG: 'data:image/png;base64,' + png.toString('base64'),
        },
      ],
    };
    await writeFile(
      path.join(kit, 'editable', id + '.piskel'),
      JSON.stringify({
        modelVersion: 2,
        piskel: {
          name: id,
          description: clip.action,
          fps: Math.max(1, clip.fps),
          width,
          height,
          layers: [JSON.stringify(layer)],
        },
      }),
    );
    // Validate actual exports, including the final frame of one-shot sequences.
    // (Vuelve a leer el WebP escrito y comprueba que sea idéntico al PNG original.)
    const decoded = await sharp(path.join(kit, 'sheets', id + '.webp'))
      .ensureAlpha()
      .raw()
      .toBuffer();
    const reference = await sharp(png).ensureAlpha().raw().toBuffer();
    assert(decoded.equals(reference), `${id}: WebP must be lossless`);
    // Debe existir al menos un píxel transparente (alfa = 0, en el byte 4 de cada píxel).
    assert(
      decoded.some((v, i) => i % 4 === 3 && v === 0),
      `${id}: missing transparency`,
    );
    // Set de cuadros únicos: sirve para saber cuántos cuadros distintos tiene el clip.
    const hashes = new Set(poses.map((p) => p.toString('base64')));
    report.push({ id, frames: poses.length, distinct: hashes.size, width, height, lossless: true });
  }
}
// Respeto a la preferencia "reducir movimiento" del sistema: se apagan las animaciones...
css +=
  '@media (prefers-reduced-motion:reduce) { [class*="clip-"] { animation:none !important; } }\n';
// ...y cada clip muestra un cuadro fijo representativo (reducedMotionFrame).
for (const c of Object.values(manifest.clips))
  if (c.reducedMotionFrame)
    css += `@media (prefers-reduced-motion:reduce) { .clip-${c.id} { transform:translateX(-${c.reducedMotionFrame * c.width}px); } }\n`;
// Escribe los archivos finales del kit: CSS, manifiesto y reporte de validación.
await writeFile(path.join(kit, 'keyframes.css'), css);
await writeFile(path.join(kit, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
await writeFile(path.join(kit, 'validation.json'), JSON.stringify(report, null, 2) + '\n');
// Una tarjeta HTML por clip para la página de revisión.
const cards = Object.values(manifest.clips)
  .map(
    (c) =>
      `<section data-clip="${c.id}"><h2>${c.id}</h2><p>${c.action}</p><p>${c.frames} cuadros · ${c.width}×${c.height} · ${c.fps} fps · ${c.loop ? 'ciclo' : 'una vez'}</p><div class="window" style="width:${c.width}px;height:${c.height}px"><img class="clip-${c.id}" src="${c.file}" alt="${c.action}" data-frames="${c.frames}" data-width="${c.width}"></div><p><button data-replay>Reproducir</button> <button data-step>Cuadro siguiente</button> <a href="${c.png}">PNG</a> · <a href="editable/${c.id}.piskel">Piskel</a></p><details><summary>Ver todos los keyframes</summary><img class="sheet" src="${c.png}" alt="Cuadros de ${c.id}"></details></section>`,
  )
  .join('');
// preview.html: página autónoma (funciona sin servidor) para ver las animaciones, pausarlas,
// repetirlas o avanzar cuadro a cuadro antes de aprobar el kit.
await writeFile(
  path.join(kit, 'preview.html'),
  `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Sprites listos para implementar</title><link rel="stylesheet" href="keyframes.css"><style>body{margin:32px;background:#07110c;color:#d3f3e0;font:16px system-ui}h1,h2{color:#a8f0c8}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}section{padding:20px;border:1px solid #397052;overflow:auto}.window{overflow:hidden;background:repeating-conic-gradient(#18241f 0% 25%,#24362b 0% 50%) 0 0/16px 16px}.window img{max-width:none;display:block}button{padding:10px;background:#a8f0c8;color:#07110c;border:0;margin-bottom:8px}a{color:#49e0f0}.sheet{image-rendering:pixelated;max-width:none}body.paused .window img{animation-play-state:paused!important}</style><h1>Paquete listo para implementar</h1><p>Estos recursos no están conectados a las páginas. Revisión de acciones y keyframes; funciona sin servidor.</p><button id="pause">Pausar / continuar todo</button><main>${cards}</main><script>document.querySelector('#pause').onclick=()=>document.body.classList.toggle('paused');document.querySelectorAll('[data-replay]').forEach(b=>b.onclick=()=>{const i=b.closest('section').querySelector('.window img');i.style.animation='none';i.style.transform='';void i.offsetWidth;i.style.animation='';i.dataset.frame='0'});document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{const i=b.closest('section').querySelector('.window img');const f=(Number(i.dataset.frame||0)+1)%Number(i.dataset.frames);i.style.animation='none';i.style.transform='translateX(-'+(f*Number(i.dataset.width))+'px)';i.dataset.frame=f});</script></html>`,
);
// Mensaje final en la terminal.
console.log(`Prepared ${report.length} clips in ${kit}; no application source files written.`);
