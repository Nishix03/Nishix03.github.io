import { about as aboutEn } from '../en/about';

export const about = {
  ...aboutEn,
  eyebrow: 'ESTUDIANTE DE INGENIERÍA DE SISTEMAS · USAT · 4.º CICLO',
  lead: 'Creo experiencias digitales personalizadas. Transformo las necesidades de cada persona o negocio en un sitio web o un agente de IA diseñado a su medida.',
  body: [
    'Empecé con aplicaciones de escritorio en Java (Swing). Ahora desarrollo soluciones web completas: La interfaz, el backend y las automatizaciones que los conectan. Curso el 4.º ciclo de Ingeniería de Sistemas en la USAT, en Chiclayo.',
    'Aprendo a través de la práctica y la escritura: Organizo mis apuntes por temas, sigo rutas de Platzi y mejoro mis prototipos de forma iterativa. Trabajo con herramientas de IA como compañeras de equipo y cuido los detalles que la mayoría pasa por alto: Los píxeles, las transiciones y las palabras. Para mí, el software es arte.',
  ],
  howTitle: 'Cómo trabajo',
  how: [
    {
      title: 'Demos honestas',
      text: 'Identifico las demostraciones como tales y evito presentar cifras sin respaldo. Los prototipos de Chiclayo y GastroClinic utilizan datos ficticios.',
    },
    {
      title: 'Si no está probado, no está terminado',
      text: 'Utilizo Playwright y axe en este sitio, y desarrollé las pruebas de extremo a extremo G1–G5 de LeeContigo IA.',
    },
    {
      title: 'Commits pequeños y explicados',
      text: 'Planifiqué la organización de los commits del equipo de futurX. En este portafolio, agrupo cada cambio lógico en un commit.',
    },
  ],
  nowTitle: 'Ahora',
  now: [
    { label: 'APRENDIENDO', text: 'Backend con Spring Boot, paso a paso (un plan de 15 etapas).' },
    { label: 'CONSTRUYENDO', text: 'GastroClinic, en desarrollo.' },
    { label: 'ESTUDIANDO', text: '4.º ciclo de Ingeniería de Sistemas en la USAT.' },
  ],
  offTitle: 'Lejos del teclado',
  off: [
    { label: 'Cartas', text: 'Yu-Gi-Oh! y Pokémon' },
    { label: 'Juegos', text: 'Persona 3 Reload, FNAF' },
    { label: 'Anime', text: 'JoJo, One Piece' },
    { label: 'Música', text: 'Soda Stereo mientras programo y bandas sonoras de cine y videojuegos' },
    { label: 'Fotografía', text: 'Fotos nocturnas y viajes: Barranquilla, Pimentel' },
    { label: 'Estilo', text: 'Ropa negra y holgada' },
  ],
  cv: { ...aboutEn.cv, label: 'Descargar CV' },
  talk: { label: 'Hablemos', sub: 'Contacto', href: '/contact' },
};
