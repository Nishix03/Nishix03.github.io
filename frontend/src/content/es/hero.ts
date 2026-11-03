import type { HeroOption } from '../types';
import { heroOptions as optionsEn } from '../en/hero';

export const hero = {
  label: 'ESTUDIANTE DE INGENIERÍA DE SISTEMAS · USAT · PERÚ',
  name: 'Iván Rodas',
  sideWord: 'IVÁN RODAS',
  headline: 'Creo páginas web y agentes de IA que automatizan los procesos de tu negocio.',
  support:
    'Lo que me diferencia: nunca dejo de aprender y hago trabajos ultra personalizados para mis clientes y para mí. Prueba: formo parte del equipo que ganó futurX 2026 con un tutor de lectura con IA.',
  poseNote:
    'Bucle sutil: respiración, un gesto lento y un parpadeo. Tira de sprites WebP, 15 fps, 2,5 s, con transparencia.',
  hints: [
    { key: '↑↓', text: 'Mover' },
    { key: 'Enter', text: 'Confirmar' },
  ],
};

// Mismos apartados, tamaños y colores que en inglés; cambian el nombre y la etiqueta.
const labels: Record<HeroOption['page'], [string, string]> = {
  about: ['Sobre mí', 'Persona'],
  projects: ['Proyectos', 'Social Links'],
  stack: ['Stack', 'Habilidades'],
  journey: ['Trayectoria', 'Línea de tiempo'],
  contact: ['Contacto', 'Vínculo'],
};

export const heroOptions: HeroOption[] = optionsEn.map((option) => ({
  ...option,
  label: labels[option.page][0],
  sub: labels[option.page][1],
}));
