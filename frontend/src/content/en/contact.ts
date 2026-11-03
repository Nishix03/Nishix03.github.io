import type { Contact } from '../types';

export const contactIntro =
  'Systems Engineering student at USAT (4th semester). Open to internships, junior full-stack roles and small freelance projects.';

// El enlace de WhatsApp lleva el código de país (51) sin "+" ni espacios; el texto va codificado para URL.
export const contacts: Contact[] = [
  { label: 'ivannishix@gmail.com', sub: 'Email', href: 'mailto:ivannishix@gmail.com', size: 34 },
  {
    label: 'WhatsApp',
    sub: 'Chat with me',
    href: 'https://wa.me/51995258351?text=Hi%20Iv%C3%A1n%2C%20I%20saw%20your%20portfolio',
    size: 36,
  },
  { label: 'GitHub', sub: '@Nishix03', href: 'https://github.com/Nishix03', size: 36 },
  // Pendiente: la URL real de LinkedIn.
  { label: 'LinkedIn', sub: '[your profile URL]', href: '#linkedin', size: 36 },
  { label: 'Platzi', sub: '@ivannishix', href: 'https://platzi.com/p/ivannishix/', size: 36 },
  { label: 'Download CV', sub: 'PDF', href: '#', size: 36 },
];

export const footer = {
  credit:
    '© 2026 Iván Rodas · 3D render and pixel sprites made with AI assistance. Fan art: Yu-Gi-Oh!, FNF, FNAF, Persona 3 and Undertale. Third-party characters belong to their respective owners.',
  orbs: 'ORBS 0/7',
};
