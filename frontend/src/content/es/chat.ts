import type { ChatQuestion } from '../types';

export const chat = {
  title: 'NishixAI',
  subtitle: 'Prototipo · respuestas escritas sobre Iván',
  greeting: '¡Hola! Soy NishixAI. Pregúntame sobre Iván: Sus estudios, proyectos o disponibilidad.',
  fallback:
    'En este prototipo solo respondo las preguntas sugeridas. La versión real responderá desde un archivo fijo con datos sobre Iván.',
  placeholder: 'Pregunta sobre Iván…',
  inputLabel: 'Pregúntale a NishixAI sobre Iván',
};

export const chatQuestions: ChatQuestion[] = [
  {
    label: '¿Quién es Iván?',
    answer:
      'Iván Rodas es estudiante de 4.º ciclo de Ingeniería de Sistemas en la USAT (Chiclayo, Perú). Hace proyectos web con HTML, CSS y JavaScript, y está aprendiendo Astro, React y TypeScript.',
  },
  {
    label: '¿futurX 2026?',
    answer:
      'Su equipo ganó el 1.er puesto en futurX 2026 con LeeContigo IA. Su aporte: El sistema de progreso, los sonidos, una corrección del tutorial y las pruebas de extremo a extremo G1–G5, con seis contribuciones integradas. La integración de IA la hizo el equipo.',
  },
  {
    label: 'Proyecto actual',
    answer:
      'GastroClinic: Un gestor de citas y un panel interno para una clínica familiar. Hoy es una demo de frontend con datos ficticios; está aprendiendo el backend paso a paso.',
  },
  {
    label: 'Estudios en Platzi',
    answer:
      'Estudia en Platzi con el plan Expert+ desde 2024. Ha aprobado 17 cursos y completado la ruta de Fundamentos de Desarrollo Web Profesional (febrero de 2026). Sus cursos más recientes son de Java y SQL (octubre de 2026).',
  },
  {
    label: '¿Disponible?',
    answer:
      'Sí. Ofrece desarrollo de sitios web y agentes de IA para automatizar procesos de negocio. También busca prácticas y puestos de desarrollo full-stack de nivel júnior. Su diferencial: Aprendizaje constante y soluciones a medida. Puedes escribirle a ivannishix@gmail.com.',
  },
];
