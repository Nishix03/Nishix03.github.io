import type { ChatQuestion } from '../types';

/** Prototipo: respuestas fijas. La versión real responderá desde un archivo de datos sobre Iván (plan §17.5). */
export const chat = {
  title: 'NishixAI',
  subtitle: 'Prototype · pre-written answers about Iván',
  greeting: 'Hi! I am NishixAI. Ask me about Iván: His studies, projects or availability.',
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
      'His team won 1st place at futurX 2026 with LeeContigo IA. His contribution: The progress system, sounds, a tutorial fix and the G1–G5 end-to-end tests, through six merged contributions. The AI integration was done by the team.',
  },
  {
    label: 'Current project',
    answer:
      'GastroClinic: An appointment manager and internal dashboard for a family clinic. Today it is a frontend demo with fictional data; he is learning the backend step by step.',
  },
  {
    label: 'Platzi studies',
    answer:
      'He has studied on Platzi with an Expert+ subscription since 2024. He has passed 17 courses and completed the Professional Web Development Fundamentals path (February 2026). His most recent courses cover Java and SQL (October 2026).',
  },
  {
    label: 'Open to work?',
    answer:
      "Yes. He builds websites and AI agents that automate business processes. He is also open to internships and junior full-stack development roles. His strengths: Continuous learning and tailored solutions. You can reach him at ivannishix@gmail.com.",
  },
];
