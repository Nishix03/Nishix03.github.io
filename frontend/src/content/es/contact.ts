import type { Contact } from '../types';
import { contacts as contactsEn, contactGlyphs } from '../en/contact';

export { contactGlyphs };

export const contactIntro = [
  { lead: 'Servicios:', text: 'Desarrollo de sitios web y agentes de IA para automatizar los procesos de tu negocio.' },
  { lead: 'Mi diferencial:', text: 'Aprendizaje constante y soluciones adaptadas a las necesidades de cada cliente.' },
  { lead: '', text: 'Soy estudiante de Ingeniería de Sistemas en la USAT (4.º ciclo). También busco oportunidades de prácticas y puestos de desarrollo full-stack de nivel júnior.' },
];

// Mismos medios y enlaces; cambian las etiquetas y el saludo de WhatsApp.
const es: Record<Contact['id'], Partial<Contact>> = {
  email: { sub: 'Correo' },
  whatsapp: {
    sub: 'Escríbeme',
    href: 'https://wa.me/51995258351?text=Hola%20Iv%C3%A1n%2C%20vi%20tu%20portafolio',
  },
  github: {},
  linkedin: {},
  platzi: {},
  cv: { label: 'Descargar CV' },
};

export const contacts: Contact[] = contactsEn.map((contact) => ({ ...contact, ...es[contact.id] }));

export const footer = {
  credit:
    '© 2026 Iván Rodas · Renderizado 3D y sprites de pixel art creados con ayuda de IA.',
  orbs: 'ORBES 0/7',
};
