import type { Project } from '../types';
import { projects as projectsEn } from '../en/projects';

// Mismos proyectos que en inglés (numeral, arcano, rango, enlaces); aquí solo cambia el texto.
const es: Record<string, Partial<Project>> = {
  I: {
    tag: 'EN DESARROLLO · Astro · React · TS',
    status: 'EN DESARROLLO',
    type: 'APP WEB / CLÍNICA',
    screenshot: '[Captura de la landing pública, sin datos de pacientes]',
    description:
      'Aplicación web en desarrollo para una clínica familiar: incluye un sitio público, gestión de citas y un panel interno. Busca sustituir una herramienta de pago por una solución a medida. La versión actual utiliza datos de prueba; el backend sigue en desarrollo.',
    cta: 'Repositorio privado: solo capturas',
  },
  II: {
    tag: 'EQUIPO · 1.er PUESTO futurX 2026',
    status: 'DEMO EN VIVO',
    type: 'TUTOR DE LECTURA CON IA / EQUIPO',
    screenshot: '[Captura de la demo en vivo]',
    description:
      'Tutor de lectura con inteligencia artificial desarrollado en equipo y ganador de futurX 2026, con más de 500 participantes de 9 países. Mi aporte fue el sistema de puntos y niveles, los sonidos, la corrección del tutorial y las pruebas automatizadas, con seis contribuciones integradas. La integración de IA estuvo a cargo del equipo.',
    stack: 'Repositorio del equipo de Alvaro-mendoza-12 · Playwright e2e',
    cta: 'Abrir la demo ↗',
  },
  III: {
    name: 'Prototipos de negocios · Chiclayo',
    tag: 'DEMO · 6 RUBROS',
    type: 'SISTEMA WEB / 6 RUBROS',
    screenshot: '[Hoja de contacto de los 6 héroes]',
    description:
      'Seis prototipos de sitios web para distintos rubros de Chiclayo. Comparten una base técnica y se adaptan a cada negocio mediante su configuración. Se revisaron la navegación con teclado, la accesibilidad y el rendimiento.',
    stack: 'Núcleo compartido · esquema JSON · Playwright · axe · Lighthouse',
    cta: '[URL de la demo en GitHub Pages]',
  },
  IV: {
    name: 'Gestor de tareas',
    tag: 'OTROS TRABAJOS · HTML/CSS/JS',
    type: 'APP WEB / PERSONAL',
    screenshot: '[Captura]',
    description: 'Aplicación web personal para organizar tareas, desarrollada con HTML, CSS y JavaScript sin frameworks.',
    cta: '[Enlace en vivo]',
  },
  V: {
    name: 'Gestor de citas',
    tag: 'OTROS TRABAJOS · JAVA SWING',
    status: 'ESCRITORIO',
    type: 'APP DE ESCRITORIO / PERSONAL',
    screenshot: '[Captura]',
    description: 'Aplicación de escritorio para gestionar citas, desarrollada en Java con la biblioteca de interfaces Swing.',
    cta: '[Enlace al repositorio]',
  },
};

export const projects: Project[] = projectsEn.map((project) => ({ ...project, ...es[project.numeral] }));
