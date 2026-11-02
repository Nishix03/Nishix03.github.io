import type { PageKey } from '../types';

export const ui = {
  siteTitle: 'Iván Rodas — portfolio',
  description:
    'Iván Rodas, Systems Engineering student (USAT). Full-stack projects, honest stack, and the road so far.',
  handle: '@Nishix_03',
  nav: [
    { page: 'projects', label: 'Projects' },
    { page: 'stack', label: 'Stack' },
    { page: 'journey', label: 'Journey' },
    { page: 'contact', label: 'Contact' },
  ] satisfies { page: PageKey; label: string }[],
  back: 'Esc Return',
  langSoon: 'Spanish version coming soon',
  pages: {
    projects: {
      title: 'Projects',
      hint: 'Whose link do you want to view? · rank comes from evidence',
      word: 'SOCIAL LINK',
      num: '02',
      rank: 'RANK',
    },
    stack: { title: 'Stack', word: 'SKILLS', num: '03' },
    journey: { title: 'Journey', word: 'LEVEL', num: '04' },
    contact: { title: 'Let’s build', accent: 'something', word: 'LINK', num: '05' },
  },
};
