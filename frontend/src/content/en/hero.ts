/**
 * Textos en inglés de la portada (Hero): el titular y el menú principal con las cinco opciones.
 * Alimenta la página de inicio; el menú se mueve con las flechas (ver scripts/keys.ts).
 */
import type { HeroOption } from '../types';

// Textos sueltos de la portada. Ver cada campo:
export const hero = {
  // Línea pequeña sobre el nombre (estudios y país).
  label: 'SYSTEMS ENGINEERING STUDENT · USAT · PERÚ',
  // Nombre completo.
  name: 'Iván Rodas',
  // Palabra grande decorativa en el lateral.
  sideWord: 'IVÁN RODAS',
  // Titular principal: qué hago.
  headline: 'I build websites and AI agents that automate the processes of your business.',
  // Frase de apoyo bajo el titular.
  support:
    "What sets me apart: I never stop learning, and I make ultra-personalized work for my clients and for myself. Proof: I'm part of the team that won futurX 2026 with an AI reading tutor.",
  // Nota técnica sobre la animación del avatar (para quien revise el proyecto).
  poseNote:
    'Subtle loop: breathing, one slow gesture, a blink. WebP sprite sheet, 15 fps, 2.5 s, alpha. 150 ms cross-fade on selection.',
  // Ayudas de teclado que se muestran: key = tecla, text = qué hace.
  hints: [
    { key: '↑↓', text: 'Move' },
    { key: 'Enter', text: 'Confirm' },
  ],
};

// Una opción del menú por apartado. Campos: page (a dónde lleva), label y sub (títulos), size (tamaño
// de letra en px), color (color del realce) y pose (descripción de la pose del avatar para esa opción).
export const heroOptions: HeroOption[] = [
  {
    page: 'about',
    label: 'About',
    sub: 'Persona',
    size: 64,
    color: '#e8c66a',
    pose: 'Iván crosses his arms with a half smile and looks straight at the camera',
  },
  {
    page: 'projects',
    label: 'Projects',
    sub: 'Social Links',
    size: 60,
    color: '#f4fff8',
    pose: 'Iván stands half-turned and presents the project with an open hand',
  },
  {
    page: 'stack',
    label: 'Stack',
    sub: 'Skills',
    size: 50,
    color: '#a8f0c8',
    pose: 'Iván works at a laptop, types calmly and glances up',
  },
  {
    page: 'journey',
    label: 'Journey',
    sub: 'Timeline',
    size: 44,
    color: '#49e0f0',
    pose: 'Iván walks forward at an easy pace, looking ahead',
  },
  {
    page: 'contact',
    label: 'Contact',
    sub: 'Link',
    size: 40,
    color: '#a8f0c8',
    pose: 'Iván faces the viewer with a slight nod and an open-hand invitation',
  },
];
