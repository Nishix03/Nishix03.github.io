/**
 * Punto de entrada del contenido: reúne los textos en inglés y en español y ofrece funciones para elegir
 * idioma y construir rutas. Las páginas de Astro piden sus textos con getContent(locale).
 *
 * Conceptos: `import { x } from './y'` trae lo exportado por otro archivo (como un import de Java);
 * `import type` trae solo un tipo, que desaparece al compilar; `import * as nombre` trae todo el módulo
 * bajo un solo nombre, y se usa como nombre.campo.
 */
import type { Locale } from './types';
// Textos en inglés: cada archivo de content/en exporta varios datos con nombre.
import { hero, heroOptions } from './en/hero';
import { projects } from './en/projects';
import { stack, stackIntro } from './en/stack';
import { journeyIntro, education, facts, milestones, diary, platzi } from './en/journey';
import { contactIntro, contactGlyphs, contacts, footer } from './en/contact';
import { about } from './en/about';
import { chat, chatQuestions } from './en/chat';
import { ui } from './en/ui';
// Textos en español: cada módulo se importa completo y luego se usa como esHero.hero, esHero.heroOptions...
import * as esHero from './es/hero';
import * as esProjects from './es/projects';
import * as esStack from './es/stack';
import * as esJourney from './es/journey';
import * as esContact from './es/contact';
import * as esAbout from './es/about';
import * as esChat from './es/chat';
import * as esUi from './es/ui';

// Un único objeto con todos los contenidos en inglés. La forma de este objeto define lo que TODOS los
// idiomas deben tener.
const en = {
  about,
  hero,
  heroOptions,
  projects,
  stack,
  stackIntro,
  journeyIntro,
  education,
  facts,
  milestones,
  diary,
  platzi,
  contactIntro,
  contactGlyphs,
  contacts,
  footer,
  chat,
  chatQuestions,
  ui,
};

// Español: mismos nombres y la misma forma que en inglés (TypeScript avisa si falta algo).
// `typeof en` = "el mismo tipo que el objeto en": si a este objeto le falta o le sobra un campo,
// TypeScript da error. Es como obligar a una clase a implementar la misma interfaz que otra.
const es: typeof en = {
  about: esAbout.about,
  hero: esHero.hero,
  heroOptions: esHero.heroOptions,
  projects: esProjects.projects,
  stack: esStack.stack,
  stackIntro: esStack.stackIntro,
  journeyIntro: esJourney.journeyIntro,
  education: esJourney.education,
  facts: esJourney.facts,
  milestones: esJourney.milestones,
  diary: esJourney.diary,
  platzi: esJourney.platzi,
  contactIntro: esContact.contactIntro,
  contactGlyphs: esContact.contactGlyphs,
  contacts: esContact.contacts,
  footer: esContact.footer,
  chat: esChat.chat,
  chatQuestions: esChat.chatQuestions,
  ui: esUi.ui,
};

// Diccionario idioma -> contenidos. `Record<Locale, typeof en>` = Map<Locale, Contenido> de Java.
const catalog: Record<Locale, typeof en> = { en, es };

// Lista de idiomas disponibles (útil para generar rutas y el selector de idioma).
export const locales: Locale[] = ['en', 'es'];

/**
 * El idioma sale de la URL: /es/... es español; el resto, inglés.
 * Recibe un URL (objeto estándar del navegador) y mira su pathname, la parte tras el dominio.
 */
export const localeFromUrl = (url: URL): Locale =>
  url.pathname === '/es' || url.pathname.startsWith('/es/') ? 'es' : 'en';

/**
 * Ruta de un apartado en un idioma: localePath('es', '/stack') → '/es/stack'.
 * Función pura: no cambia nada, solo calcula un texto. Se usa para todos los enlaces del sitio.
 */
export const localePath = (locale: Locale, path = '/') =>
  locale === 'en' ? path : path === '/' ? '/es/' : `/es${path}`;

/**
 * La misma página en otro idioma.
 * replace con una expresión regular quita el prefijo /es del principio: (?=\/|$) significa "seguido de / o del final".
 * `|| '/'` usa "/" si lo que queda es un texto vacío. Luego vuelve a poner el prefijo del idioma pedido.
 */
export const switchLocale = (url: URL, locale: Locale) => {
  const bare = url.pathname.replace(/^\/es(?=\/|$)/, '') || '/';
  return localePath(locale, bare);
};

// La función que usan las páginas: getContent('es').hero, getContent().ui... El idioma por defecto es inglés.
export const getContent = (locale: Locale = 'en') => catalog[locale];
