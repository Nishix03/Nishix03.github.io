/**
 * Página About me: quién es, cómo trabaja, qué hace ahora y qué le gusta fuera del teclado.
 * Textos en inglés de la página "About me" (Sobre mí): presentación, forma de trabajar, qué hago ahora y
 * aficiones. Lo consume la página about y content/index.ts.
 *
 * Concepto: `export const about = { ... }` exporta un objeto literal (como crear un objeto con sus campos
 * ya llenos). Las listas se escriben entre corchetes [ ] (arrays). La versión en español está en
 * content/es/about.ts y reutiliza este objeto con `...aboutEn` (copia los campos y cambia solo los textos).
 */
export const about = {
  // Línea pequeña sobre el título (estudios, universidad, ciclo).
  eyebrow: 'SYSTEMS ENGINEERING STUDENT · USAT · 4TH SEMESTER',
  // Ciudad y usuario público, debajo del nombre.
  place: 'Chiclayo, Perú · @Nishix_03',
  // Frase principal de presentación, la más grande.
  lead: 'I’m a creator of personalized experiences. I turn what a person or a business really needs into a website or an AI agent that feels made for them, not a template with their logo on it.',
  // Párrafos de la presentación; cada texto entre comillas es un párrafo.
  body: [
    'I started with Java desktop apps (Swing). Now I build for the web, end to end: the interface, the backend and the automations in between. I’m a 4th-semester Systems Engineering student at USAT, in Chiclayo.',
    'I learn by building and by writing things down: notes organized by topic, Platzi paths, and prototypes I keep iterating until they feel right. I work with AI tools as teammates, and I care about the details most people skip: the pixel, the transition, the wording. For me, software is art.',
  ],
  // Título del bloque "Cómo trabajo".
  howTitle: 'How I work',
  // Tarjetas de "cómo trabajo": cada una con title (encabezado) y text (explicación).
  how: [
    {
      title: 'Honest demos',
      text: 'Every prototype says “(demo)” and uses no invented numbers: the Chiclayo prototypes, GastroClinic with fictional data.',
    },
    {
      title: 'If it isn’t tested, it isn’t done',
      text: 'Playwright and axe on this site; end-to-end guarantees G1–G5 on LeeContigo IA.',
    },
    {
      title: 'Small, explained commits',
      text: 'I planned how the futurX team split its commits; here, one commit per logical change.',
    },
  ],
  // Título del bloque "Ahora".
  nowTitle: 'Now',
  // Lo que hago ahora: label es la etiqueta corta en mayúsculas y text el detalle.
  now: [
    { label: 'LEARNING', text: 'Backend with Spring Boot, step by step (a 15-stage plan).' },
    { label: 'BUILDING', text: 'GastroClinic, in development.' },
    { label: 'STUDYING', text: '4th semester of Systems Engineering at USAT.' },
  ],
  // Título del bloque de aficiones.
  offTitle: 'Off the keyboard',
  // Aficiones fuera del teclado (label = categoría, text = detalle).
  off: [
    { label: 'Cards', text: 'Yu-Gi-Oh! and Pokémon' },
    { label: 'Games', text: 'Persona 3 Reload, FNAF' },
    { label: 'Anime', text: 'JoJo, One Piece' },
    { label: 'Music', text: 'Soda Stereo while I code, plus film and game soundtracks' },
    { label: 'Photography', text: 'Night shots and trips: Barranquilla, Pimentel' },
    { label: 'Style', text: 'Black outfits, baggy fits' },
  ],
  // Botón de descargar CV: etiqueta, subtítulo y enlace ("#" mientras no hay archivo).
  cv: { label: 'Download CV', sub: 'PDF', href: '#' },
  // Botón para ir a la página de contacto (href es la ruta interna).
  talk: { label: 'Let’s talk', sub: 'Contact', href: '/contact' },
};
