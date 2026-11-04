/**
 * Tipos de los datos de contenido (los textos de la web).
 *
 * Un `type` de TypeScript describe la forma de un objeto: qué campos tiene y de qué tipo (algo así como una
 * clase de Java que solo tiene atributos). `export` lo hace visible para otros archivos. `A | B` significa
 * "A o B". Estos tipos los usan content/en/*.ts y content/es/*.ts; como ambos idiomas cumplen el mismo tipo,
 * TypeScript avisa si a una traducción le falta algún campo.
 */
// Idiomas disponibles; el sitio tiene inglés (por defecto) y español. Es un tipo unión de textos literales,
// parecido a un enum de Java con dos valores.
export type Locale = 'en' | 'es';

// Los apartados del sitio. Se usa en el menú, las rutas y como clave en los textos.
export type PageKey = 'projects' | 'stack' | 'journey' | 'about' | 'contact';

// Una opción del menú del Hero (la portada). Alimenta la lista de botones junto al avatar.
export type HeroOption = {
  /** A qué apartado lleva la opción. */
  page: PageKey;
  /** Título que se ve en el menú. */
  label: string;
  /** Subtítulo pequeño (estilo del juego Persona 3 Reload). */
  sub: string;
  /** Tamaño de letra de la opción en píxeles. */
  size: number;
  /** Color del texto o realce (código hexadecimal CSS). */
  color: string;
  /** Descripción de la pose del avatar para esa opción (texto alternativo). */
  pose: string;
};

// Un proyecto del portafolio, presentado como una carta de tarot. Alimenta la página Projects.
export type Project = {
  /** Número romano de la carta (I, II, ...); en español sirve además de clave para unir textos. */
  numeral: string;
  /** Nombre corto del arcano (MAGICIAN...). */
  arcana: string;
  /** Nombre completo del arcano (THE MAGICIAN...). */
  arcanaTitle: string;
  /** Qué símbolo dibujar en la carta; solo uno de los cinco permitidos. */
  symbol: 'magician' | 'priestess' | 'empress' | 'emperor' | 'hierophant';
  /** Nombre del proyecto. */
  name: string;
  /** Etiqueta corta con estado y tecnologías. */
  tag: string;
  /** Rango 1 a 5 según la evidencia (curso, personal, entregado, producción, equipo/premio). */
  rank: 1 | 2 | 3 | 4 | 5;
  /** Estado actual (en desarrollo, demo...). */
  status: string;
  /** Tipo de proyecto (app web, de escritorio...). */
  type: string;
  /** Texto marcador de la captura (aún no hay imagen real). */
  screenshot: string;
  /** Descripción larga del proyecto. */
  description: string;
  /** Tecnologías usadas, como texto. */
  stack: string;
  /** Texto del botón o enlace de acción. */
  cta: string;
  /** Dirección del enlace; "#" si todavía no hay. */
  href: string;
};

// Una tecnología del apartado Stack, con su porcentaje de dominio y la evidencia que lo justifica.
export type Technology = {
  /** Identificador interno (por ejemplo "react"); sirve para buscar su icono. */
  id: string;
  /** Nombre visible. */
  name: string;
  /** Dos letras que se ven mientras llega el icono pixel definitivo. */
  code: string;
  /** Color de fondo del icono provisional. */
  background: string;
  /** Color de las letras del icono provisional. */
  foreground: string;
  /** Rango de 1 a 5; el literal `1 | 2 | 3 | 4 | 5` limita los valores posibles. */
  rank: 1 | 2 | 3 | 4 | 5;
  /** Autoevaluación, siempre por debajo del tope de su rango (ver stack.ts). */
  percent: number;
  /** Texto que explica de dónde sale ese nivel (cursos, proyectos...). */
  evidence: string;
};

// Un hito de la línea de tiempo (apartado Journey).
export type Milestone = {
  /** Fecha mostrada, como texto (por ejemplo "OCT 2026"). */
  date: string;
  /** Descripción del hito. */
  label: string;
  /** true = aún bloqueado: es un objetivo futuro, no un logro. */
  locked: boolean;
};

// Un medio de contacto (apartado Contact). Alimenta la lista de enlaces y su icono pixel.
export type Contact = {
  /** Identificador del medio; también es la clave del icono en contactGlyphs. */
  id: 'email' | 'whatsapp' | 'github' | 'linkedin' | 'platzi' | 'cv';
  /** Texto principal visible. */
  label: string;
  /** Texto pequeño bajo el principal. */
  sub: string;
  /** A dónde apunta el enlace (mailto:, https://...). */
  href: string;
  /** Tamaño del icono en píxeles. */
  size: number;
};

// Una pregunta sugerida del chat NishixAI: lo que se ve en el botón y la respuesta prefijada.
export type ChatQuestion = { label: string; answer: string };
