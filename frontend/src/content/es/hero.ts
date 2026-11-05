import type { HeroOption } from '../types';
import { heroOptions as optionsEn } from '../en/hero';

export const hero = {
  label: 'ESTUDIANTE DE INGENIERÍA DE SISTEMAS · USAT · PERÚ',
  name: 'Iván Rodas',
  sideWord: 'IVÁN RODAS',
  headline: 'Creo páginas web y agentes de IA que automatizan los procesos de tu negocio.',
  support:
    'Lo que me diferencia: Aprendo constantemente y desarrollo soluciones a medida para mis clientes y mis propios proyectos. Formo parte del equipo ganador de futurX 2026, donde creamos un tutor de lectura con IA.',
  poseNote:
    'Animación sutil: Movimiento del pelo, los accesorios y los pliegues de la ropa, con los ojos cerrados. Ciclo de 6,4 segundos con transparencia.',
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
