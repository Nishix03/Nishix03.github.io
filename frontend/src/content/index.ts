import type { Locale } from './types';
import { hero, heroOptions } from './en/hero';
import { projects } from './en/projects';
import { stack, stackIntro } from './en/stack';
import { journeyIntro, education, facts, milestones, diary, platzi } from './en/journey';
import { contactIntro, contacts, footer } from './en/contact';
import { chat, chatQuestions } from './en/chat';
import { ui } from './en/ui';

const en = {
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
  contacts,
  footer,
  chat,
  chatQuestions,
  ui,
};

/** Hoy solo inglés. Para añadir /es: crear src/content/es/ con los mismos archivos y registrarlo aquí. */
const catalog: Record<Locale, typeof en> = { en };

export const getContent = (locale: Locale = 'en') => catalog[locale];
