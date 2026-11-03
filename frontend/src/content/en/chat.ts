import type { ChatQuestion } from '../types';

/** Prototipo: respuestas fijas. La versión real responderá desde un archivo de datos sobre Iván (plan §17.5). */
export const chat = {
  title: 'NishixAI',
  subtitle: 'Prototype · pre-written answers about Iván',
  greeting: 'Hi! I am NishixAI. Ask me about Iván: his studies, projects or availability.',
  fallback:
    'In this prototype I can only answer the suggested questions. The real version will answer from a fixed file of facts about Iván.',
  placeholder: 'Ask about Iván…',
  inputLabel: 'Ask NishixAI about Iván',
};

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
