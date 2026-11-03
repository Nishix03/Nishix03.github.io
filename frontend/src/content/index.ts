import type { Locale } from './types';
import { hero, heroOptions } from './en/hero';
import { projects } from './en/projects';
import { stack, stackIntro } from './en/stack';
import { journeyIntro, education, facts, milestones, diary, platzi } from './en/journey';
import { contactIntro, contactGlyphs, contacts, footer } from './en/contact';
import { about } from './en/about';
import { chat, chatQuestions } from './en/chat';
import { ui } from './en/ui';
import * as esHero from './es/hero';
import * as esProjects from './es/projects';
import * as esStack from './es/stack';
import * as esJourney from './es/journey';
import * as esContact from './es/contact';
import * as esAbout from './es/about';
import * as esChat from './es/chat';
import * as esUi from './es/ui';

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

const catalog: Record<Locale, typeof en> = { en, es };

export const locales: Locale[] = ['en', 'es'];

/** El idioma sale de la URL: /es/... es español; el resto, inglés. */
export const localeFromUrl = (url: URL): Locale =>
  url.pathname === '/es' || url.pathname.startsWith('/es/') ? 'es' : 'en';

/** Ruta de un apartado en un idioma: localePath('es', '/stack') → '/es/stack'. */
export const localePath = (locale: Locale, path = '/') =>
  locale === 'en' ? path : path === '/' ? '/es/' : `/es${path}`;

/** La misma página en otro idioma. */
export const switchLocale = (url: URL, locale: Locale) => {
  const bare = url.pathname.replace(/^\/es(?=\/|$)/, '') || '/';
  return localePath(locale, bare);
};

export const getContent = (locale: Locale = 'en') => catalog[locale];
