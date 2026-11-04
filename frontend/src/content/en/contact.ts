/**
 * Textos en inglés de la página "Contact": servicios, iconos pixel de cada medio de contacto, la lista de
 * enlaces (correo, WhatsApp, GitHub...) y el pie de página. Alimenta la página contact y el footer.
 *
 * Concepto: `Record<string, string[]>` es un diccionario texto -> lista de textos (un Map<String, List<String>>
 * de Java). `Contact[]` es una lista de objetos con la forma definida en content/types.ts.
 */
import type { Contact } from '../types';

/**
 * Servicios y diferencial (líneas separadas) más la situación actual.
 * Cada elemento tiene `lead` (palabra destacada al inicio, puede ir vacía) y `text` (el resto de la frase).
 */
export const contactIntro = [
  { lead: 'Services:', text: 'website implementation + AI agents that automate processes in your business.' },
  { lead: 'My edge:', text: 'constant drive to learn and ultra-personalized content, for me and for every client.' },
  { lead: '', text: 'Systems Engineering student at USAT (4th semester); also open to internships and junior full-stack roles.' },
];

/**
 * Iconos pixel de cada medio de contacto: rejilla de 12 columnas, '#' = celda encendida.
 * Se dibujan con box-shadow de celdas de 3 px y toman el color del texto (currentColor).
 *
 * Cada clave (email, whatsapp...) coincide con el `id` de un Contact en `contacts`.
 * Cada texto del array es una fila del icono; así se ve "dibujado" con caracteres.
 */
export const contactGlyphs: Record<string, string[]> = {
  email: ['############','##........##','#.#......#.#','#..#....#..#','#...#..#...#','#....##....#','#..........#','#..........#','#..........#','############'],
  whatsapp: ['.##########.','#..........#','#..........#','#..#..#..#.#','#..........#','#..........#','.####..#####','....#.#.....','.....##.....'],
  github: ['.##......##.','.###....###.','############','############','###.####.###','############','############','.##########.','..########..','...######...'],
  linkedin: ['.##########.','############','############','###.########','############','###.#....###','###.#.##.###','###.#.##.###','###.#.##.###','###.#.##.###','############','.##########.'],
  platzi: ['.##########.','############','###......###','###......###','###..##..###','###..##..###','###......###','###......###','###..#######','###..#######','############','.##########.'],
  cv: ['.######.....','.#....##....','.#....#.#...','.#....####..','.#.......#..','.#.#####.#..','.#.......#..','.#.#####.#..','.#.......#..','.#########..'],
};

// El enlace de WhatsApp lleva el código de país (51) sin "+" ni espacios; el texto va codificado para URL.
// Cada contacto tiene: id (qué medio es), label (texto principal), sub (texto pequeño), href (enlace) y size
// (tamaño del icono en px). Un href "#" significa que el enlace real aún no está.
export const contacts: Contact[] = [
  { id: 'email', label: 'ivannishix@gmail.com', sub: 'Email', href: 'mailto:ivannishix@gmail.com', size: 34 },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    sub: 'Chat with me',
    href: 'https://wa.me/51995258351?text=Hi%20Iv%C3%A1n%2C%20I%20saw%20your%20portfolio',
    size: 36,
  },
  { id: 'github', label: 'GitHub', sub: '@Nishix03', href: 'https://github.com/Nishix03', size: 36 },
  // Pendiente: la URL real de LinkedIn.
  { id: 'linkedin', label: 'LinkedIn', sub: '[your profile URL]', href: '#linkedin', size: 36 },
  { id: 'platzi', label: 'Platzi', sub: '@ivannishix', href: 'https://platzi.com/p/ivannishix/', size: 36 },
  { id: 'cv', label: 'Download CV', sub: 'PDF', href: '#', size: 36 },
];

// Pie de página: créditos legales y el contador de "orbes" (un detalle de juego).
export const footer = {
  // Texto de derechos y créditos del arte.
  credit:
    '© 2026 Iván Rodas · 3D render and pixel sprites made with AI assistance. Fan art: Yu-Gi-Oh! and Persona 3. Third-party characters belong to their respective owners.',
  // Contador decorativo estilo videojuego.
  orbs: 'ORBS 0/7',
};
