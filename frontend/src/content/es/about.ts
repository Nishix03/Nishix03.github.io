/**
 * Textos en español de la página "Sobre mí". En vez de repetir todo, parte del objeto en inglés y cambia lo
 * traducible.
 *
 * Concepto: `...aboutEn` es el operador spread: copia todos los campos del objeto en inglés. Los campos que
 * se escriben después reemplazan a los copiados (como sobrescribir un método heredado en Java).
 */
// `about as aboutEn` renombra lo importado para no chocar con el `about` que se exporta aquí.
import { about as aboutEn } from '../en/about';

// Mismo objeto que en inglés, con los textos en español.
export const about = {
  // Primero se copia todo el contenido en inglés...
  ...aboutEn,
  // ...y de aquí en adelante se reemplazan los textos por su traducción (mismos campos que en inglés).
  eyebrow: 'ESTUDIANTE DE INGENIERÍA DE SISTEMAS · USAT · 4.º CICLO',
  lead: 'Soy un creador de experiencias personalizadas. Convierto lo que una persona o un negocio necesita de verdad en una web o un agente de IA que se siente hecho para ellos, no una plantilla con su logo encima.',
  body: [
    'Empecé con aplicaciones de escritorio en Java (Swing). Ahora construyo para la web de punta a punta: la interfaz, el backend y las automatizaciones entre medio. Estudio 4.º ciclo de Ingeniería de Sistemas en la USAT, en Chiclayo.',
    'Aprendo construyendo y escribiendo: apuntes ordenados por tema, rutas de Platzi y prototipos que itero hasta que se sienten bien. Trabajo con herramientas de IA como compañeras de equipo y cuido los detalles que la mayoría pasa por alto: el píxel, la transición, las palabras. Para mí, el software es arte.',
  ],
  howTitle: 'Cómo trabajo',
  how: [
    {
      title: 'Demos honestas',
      text: 'Cada prototipo dice «(demo)» y no inventa cifras: los prototipos de Chiclayo, GastroClinic con datos ficticios.',
    },
    {
      title: 'Si no está probado, no está terminado',
      text: 'Playwright y axe en este sitio; garantías e2e G1–G5 en LeeContigo IA.',
    },
    {
      title: 'Commits pequeños y explicados',
      text: 'Planeé cómo el equipo de futurX dividía sus commits; aquí, un commit por cambio lógico.',
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
    { label: 'Música', text: 'Soda Stereo mientras programo, y bandas sonoras de cine y videojuegos' },
    { label: 'Fotografía', text: 'Fotos nocturnas y viajes: Barranquilla, Pimentel' },
    { label: 'Estilo', text: 'Ropa negra y holgada' },
  ],
  // Del CV solo se cambia la etiqueta; sub y href se conservan del inglés.
  cv: { ...aboutEn.cv, label: 'Descargar CV' },
  // Botón de contacto en español; la ruta interna se ajusta con localePath en la página.
  talk: { label: 'Hablemos', sub: 'Contacto', href: '/contact' },
};
