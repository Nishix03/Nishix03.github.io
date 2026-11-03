import type { Contact } from '../types';

/** Servicios y diferencial (líneas separadas) más la situación actual. */
export const contactIntro = [
  { lead: 'Services:', text: 'website implementation + AI agents that automate processes in your business.' },
  { lead: 'My edge:', text: 'constant drive to learn and ultra-personalized content, for me and for every client.' },
  { lead: '', text: 'Systems Engineering student at USAT (4th semester); also open to internships and junior full-stack roles.' },
];

/**
 * Iconos pixel de cada medio de contacto: rejilla de 12 columnas, '#' = celda encendida.
 * Se dibujan con box-shadow de celdas de 3 px y toman el color del texto (currentColor).
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

export const footer = {
  credit:
    '© 2026 Iván Rodas · 3D render and pixel sprites made with AI assistance. Fan art: Yu-Gi-Oh!, FNF, Persona 3 and Undertale. Third-party characters belong to their respective owners.',
  orbs: 'ORBS 0/7',
};
