import sharp from 'sharp';
import path from 'node:path';
import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'art/sprites/butterfly-theme-source.png');
const pack = path.join(root, 'art/sprites/ready-to-integrate');
const meta = await sharp(source).metadata();
const frames = [];
for (let index = 0; index < 12; index++) {
  const col = index % 4, row = Math.floor(index / 4);
  const left = Math.round(col * meta.width / 4);
  const top = Math.round(row * meta.height / 3);
  const right = Math.round((col + 1) * meta.width / 4);
  const bottom = Math.round((row + 1) * meta.height / 3);
  frames.push(await sharp(source)
    .extract({ left, top, width: right - left, height: bottom - top })
    .resize(45, 35, { fit: 'fill', kernel: 'nearest' }).png().toBuffer());
}
for (const [name, start, count] of [['fly', 0, 8], ['hover', 8, 4]]) {
  const id = `p3-butterfly-${name}`;
  const frameDir = path.join(pack, 'keyframes', id);
  await mkdir(frameDir, { recursive: true });
  for (let i = 0; i < count; i++) {
    await sharp(frames[start + i]).toFile(path.join(frameDir, `${String(i).padStart(2, '0')}.png`));
  }
  const sheet = await sharp({ create: {
    width: 45 * count, height: 35, channels: 4, background: '#00000000',
  } }).composite(frames.slice(start, start + count).map((input, i) => ({
    input, left: i * 45, top: 0,
  }))).png().toBuffer();
  await sharp(sheet).toFile(path.join(pack, 'sheets', `${id}.png`));
  await sharp(sheet).webp({ lossless: true }).toFile(path.join(pack, 'sheets', `${id}.webp`));
  await copyFile(path.join(pack, 'sheets', `${id}.webp`), path.join(root, 'public/sprites/clips', `${id}.webp`));
}
await copyFile(source, path.join(pack, 'sources/p3-butterfly.png'));
const previewFrames = await Promise.all(frames.slice(0, 8).map(input =>
  sharp(input).resize(180, 140, { kernel: 'nearest' }).png().toBuffer(),
));
await sharp(previewFrames, { join: { animated: true } })
  .gif({ delay: Array(8).fill(80), loop: 0 })
  .toFile(path.join(root, 'art/sprites/butterfly-theme-preview.gif'));
