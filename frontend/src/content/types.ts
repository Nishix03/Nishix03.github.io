export type Locale = 'en';

export type PageKey = 'projects' | 'stack' | 'journey' | 'contact';

export type HeroOption = {
  page: PageKey;
  label: string;
  sub: string;
  size: number;
  color: string;
  pose: string;
};

export type Project = {
  numeral: string;
  arcana: string;
  arcanaTitle: string;
  symbol: 'magician' | 'priestess' | 'empress' | 'emperor' | 'hierophant';
  name: string;
  tag: string;
  rank: 1 | 2 | 3 | 4 | 5;
  status: string;
  type: string;
  screenshot: string;
  description: string;
  stack: string;
  cta: string;
  href: string;
};

export type Technology = {
  id: string;
  name: string;
  /** Dos letras que se ven mientras llega el icono pixel definitivo. */
  code: string;
  background: string;
  foreground: string;
  rank: 1 | 2 | 3 | 4 | 5;
  /** Autoevaluación, siempre por debajo del tope de su rango (ver stack.ts). */
  percent: number;
  evidence: string;
};

export type Milestone = {
  date: string;
  label: string;
  locked: boolean;
};

export type Contact = {
  label: string;
  sub: string;
  href: string;
  size: number;
};

export type ChatQuestion = { label: string; answer: string };
