import { readdir } from 'node:fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const avatar = new URL('../public/avatar/', import.meta.url);
const brand = new URL('../public/brand/', import.meta.url);
const frameWidth = 600;
const frameHeight = 780;
const downsample = async (image) => {
  // Decodificar primero evita el reescalado de WebP durante la lectura.
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return sharp(data, { raw: info }).resize(info.width / 2, info.height / 2, { kernel: 'nearest' });
};

// Las tiras de escritorio son la fuente de los derivados. Los cuadros conservan su orden.
for (const file of await readdir(avatar)) {
  if (!/^(hero|about|projects|stack|journey|contact)-(entry|rest(?:-[01])?)\.webp$/.test(file)) continue;
  const source = fileURLToPath(new URL(file, avatar));
  const { width, height } = await sharp(source).metadata();
  if (height !== frameHeight || width % frameWidth !== 0) throw new Error(`Dimensiones inesperadas: ${file}`);
  const mobile = await downsample(sharp(source));
  await mobile
    .webp(file.startsWith('hero-') ? { quality: 85, alphaQuality: 100, effort: 6 } : { lossless: true })
    .toFile(fileURLToPath(new URL(file.replace('.webp', '-mobile.webp'), avatar)));

  if (file.endsWith('-entry.webp')) {
    const still = sharp(source)
      .extract({ left: width - frameWidth, top: 0, width: frameWidth, height: frameHeight });
    await still.clone()
      .webp({ lossless: true })
      .toFile(fileURLToPath(new URL(file.replace('-entry.webp', '-still.webp'), avatar)));
    const mobileStill = await downsample(still);
    await mobileStill
      .webp({ lossless: true })
      .toFile(fileURLToPath(new URL(file.replace('-entry.webp', '-still-mobile.webp'), avatar)));
  }
}

await sharp(fileURLToPath(new URL('nishix-nx-pixel.png', brand)))
  .resize({ width: 88, kernel: 'nearest' })
  .webp({ lossless: true })
  .toFile(fileURLToPath(new URL('nishix-nx-header.webp', brand)));
