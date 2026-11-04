/**
 * Textos en inglés del chat NishixAI (un asistente de prueba). Hay dos partes: los textos fijos de la ventana
 * (`chat`) y las preguntas sugeridas con su respuesta escrita de antemano (`chatQuestions`).
 *
 * Concepto: `import type` trae solo un tipo de TypeScript (ChatQuestion, definido en content/types.ts); no
 * existe en el código final del navegador. El tipo obliga a que cada pregunta tenga label y answer.
 */
import type { ChatQuestion } from '../types';

/**
 * Prototipo: respuestas fijas. La versión real responderá desde un archivo de datos sobre Iván (plan §17.5).
 * Cada campo es un texto de la interfaz del chat.
 */
export const chat = {
  // Nombre mostrado en la cabecera de la ventana.
  title: 'NishixAI',
  // Aviso de que es un prototipo con respuestas fijas.
  subtitle: 'Prototype · pre-written answers about Iván',
  // Primer mensaje que dice el asistente.
  greeting: 'Hi! I am NishixAI. Ask me about Iván: his studies, projects or availability.',
  // Respuesta cuando el usuario escribe algo que no es una pregunta sugerida.
  fallback:
    'In this prototype I can only answer the suggested questions. The real version will answer from a fixed file of facts about Iván.',
  // Texto gris dentro de la caja de escribir.
  placeholder: 'Ask about Iván…',
  // Etiqueta para lectores de pantalla (accesibilidad) de la caja de escribir.
  inputLabel: 'Ask NishixAI about Iván',
};

// Botones de preguntas sugeridas. `ChatQuestion[]` = lista (array) de objetos con:
//   label  -> el texto del botón;  answer -> la respuesta que aparece al pulsarlo.
export const chatQuestions: ChatQuestion[] = [
  {
    label: 'Who is Iván?',
    answer:
      'Iván Rodas is a Systems Engineering student in his 4th semester at USAT (Chiclayo, Perú). He builds web projects with HTML, CSS and JavaScript, and is learning Astro, React and TypeScript.',
  },
  {
    label: 'futurX 2026?',
    answer:
      'His team won 1st place at futurX 2026 with LeeContigo IA. His part: the progress system, sounds, a tutorial fix and the e2e guarantees G1–G5, in 6 merged PRs. The AI integration was done by the team.',
  },
  {
    label: 'Current project',
    answer:
      'GastroClinic: an appointment manager and internal panel for a family clinic. Today it is a frontend demo with fictional data; he is learning the backend step by step.',
  },
  {
    label: 'Platzi studies',
    answer:
      'Platzi Expert+ since 2024: 17 courses passed and the Professional Web Development Fundamentals path (Feb 2026). Latest: Java and SQL courses (Oct 2026).',
  },
  {
    label: 'Open to work?',
    answer:
      "Yes: I offer website implementation + AI agents that automate business processes, and I'm open to internships and junior full-stack roles. My edge: constant drive to learn and ultra-personalized work. Email: ivannishix@gmail.com",
  },
];
