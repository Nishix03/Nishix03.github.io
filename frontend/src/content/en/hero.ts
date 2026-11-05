import type { HeroOption } from '../types';

export const hero = {
  label: 'SYSTEMS ENGINEERING STUDENT · USAT · PERÚ',
  name: 'Iván Rodas',
  sideWord: 'IVÁN RODAS',
  headline: 'I build websites and AI agents that automate your business processes.',
  support:
    "What sets me apart: I keep learning and build tailored solutions for my clients and my own projects. I’m part of the team that won futurX 2026, where we developed an AI reading tutor.",
  poseNote:
    'Subtle animation: Movement in the hair, accessories and clothing folds, with the eyes closed. A transparent 6.4-second loop.',
  hints: [
    { key: '↑↓', text: 'Move' },
    { key: 'Enter', text: 'Confirm' },
  ],
};

export const heroOptions: HeroOption[] = [
  {
    page: 'about',
    label: 'About',
    sub: 'Persona',
    size: 64,
    color: '#e8c66a',
    pose: 'Iván crosses his arms with a half smile and looks straight at the camera',
  },
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
