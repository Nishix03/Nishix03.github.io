/**
 * Textos en español de la página "Contacto". Reutiliza los iconos y los enlaces del inglés y solo cambia
 * etiquetas y el saludo de WhatsApp. Alimenta la página contact y el pie de página.
 */
import type { Contact } from '../types';
import { contacts as contactsEn, contactGlyphs } from '../en/contact';

// Re-exporta los iconos pixel sin cambios: no hay nada que traducir en ellos. Así content/index.ts puede
// importar todo desde el módulo en español.
export { contactGlyphs };

// Servicios y diferencial en español (lead = palabra destacada, text = frase).
export const contactIntro = [
  { lead: 'Servicios:', text: 'implementación de páginas web + agentes de IA que automatizan procesos de tu negocio.' },
  { lead: 'Mi diferencial:', text: 'ganas constantes de aprender y contenido ultra personalizado, para mí y para cada cliente.' },
  { lead: '', text: 'Estudiante de Ingeniería de Sistemas en la USAT (4.º ciclo); también abierto a prácticas y puestos junior full-stack.' },
];

// Mismos medios y enlaces; cambian las etiquetas y el saludo de WhatsApp.
// `Record<Contact['id'], Partial<Contact>>`: diccionario cuya clave es un id de contacto y cuyo valor es un
// Contact "parcial" (Partial = solo algunos campos). Aquí van únicamente los campos que cambian.
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

// Une cada contacto en inglés con su ajuste en español: `{ ...contact, ...es[contact.id] }` copia todo y luego
// reemplaza lo que esté en `es`. map() recorre la lista y devuelve otra nueva (como un stream de Java).
export const contacts: Contact[] = contactsEn.map((contact) => ({ ...contact, ...es[contact.id] }));

// Pie de página en español: credit (créditos) y orbs (contador decorativo).
export const footer = {
  credit:
    '© 2026 Iván Rodas · Render 3D y sprites pixel hechos con ayuda de IA. Fan art: Yu-Gi-Oh! y Persona 3. Los personajes pertenecen a sus respectivos dueños.',
  orbs: 'ORBES 0/7',
};
