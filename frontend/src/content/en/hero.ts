import type { HeroOption } from '../types';

export const hero = {
  label: 'SYSTEMS ENGINEERING STUDENT · USAT · PERÚ',
  name: 'Iván Rodas',
  sideWord: 'IVÁN RODAS',
  headline:
    'Systems Engineering student (4th semester, USAT) who ships full-stack work — with AI-powered features.',
  support:
    'Part of the team that won futurX 2026 with an AI reading tutor. I built its progress system and its end-to-end guarantees.',
  poseNote:
    'Subtle loop: breathing, one slow gesture, a blink. WebP sprite sheet, 15 fps, 2.5 s, alpha. 150 ms cross-fade on selection.',
  hints: [
    { key: '↑↓', text: 'Move' },
    { key: 'Enter', text: 'Confirm' },
  ],
};

export const heroOptions: HeroOption[] = [
  {
    page: 'projects',
    label: 'Projects',
    sub: 'Social Links',
    size: 60,
    color: '#f4fff8',
    pose: 'Iván stands half-turned and presents the project with an open hand',
  },
  {
    page: 'stack',
    label: 'Stack',
    sub: 'Skills',
    size: 50,
    color: '#a8f0c8',
    pose: 'Iván works at a laptop, types calmly and glances up',
  },
  {
    page: 'journey',
    label: 'Journey',
    sub: 'Timeline',
    size: 44,
    color: '#49e0f0',
    pose: 'Iván walks forward at an easy pace, looking ahead',
  },
  {
    page: 'contact',
    label: 'Contact',
    sub: 'Link',
    size: 40,
    color: '#a8f0c8',
    pose: 'Iván faces the viewer with a slight nod and an open-hand invitation',
  },
];
