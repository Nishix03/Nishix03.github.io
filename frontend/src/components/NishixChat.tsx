/*
 * NishixChat.tsx — chat de NishixAI (React).
 *
 * ¿Qué es? Un botón en la cabecera que abre un panelito de chat. Muestra un saludo, unas
 * preguntas rápidas (chips) con respuestas ya escritas y una caja de texto cuya respuesta es
 * siempre un mensaje genérico (`fallback`): es un prototipo, no hay IA real conectada.
 * ¿Dónde se usa? En Header.astro: <NishixChat client:idle transition:persist=... />.
 *
 * Conceptos nuevos:
 * - ISLA DE REACT: Astro entrega HTML estático y solo "activa" (hidrata) con JavaScript los
 *   componentes marcados con `client:*`. Este es el único componente de React de la web.
 * - HOOKS: funciones de React que empiezan por `use`. Dan memoria y efectos a un componente:
 *     useState -> guarda un valor que, al cambiar, vuelve a dibujar el componente.
 *     useEffect -> ejecuta código DESPUÉS de dibujar, cuando cambian ciertos valores.
 *     useRef   -> guarda una referencia a un elemento del DOM (o un valor) sin provocar redibujado.
 *     useId    -> genera un id único y estable (para enlazar etiquetas y controles).
 * - Props en React: llegan como el parámetro de la función (ver `type Props` más abajo).
 * - TSX: TypeScript + JSX (HTML dentro de JavaScript). En JSX se usa `className` en vez de `class`.
 */
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
// Iconos como componentes (flecha de enviar y X de cerrar).
import { ArrowRight, X } from 'lucide-react';
// Estilos propios del chat (metodología BEM). Los importa Astro/Vite junto con el componente.
import './NishixChat.css';

// Una pregunta rápida: el texto del botón (label) y la respuesta que se muestra al pulsarla.
type Question = { label: string; answer: string };
// Un mensaje de la conversación: quién lo dice y qué dice. `'You' | 'NishixAI'` = solo esos dos valores.
type Message = { from: 'You' | 'NishixAI'; text: string };

// Props del componente. Los textos llegan ya traducidos desde Header.astro (por eso no hay texto fijo aquí,
// salvo algunos aria-label). `iconSrc?` es opcional.
type Props = {
  title: string;
  subtitle: string;
  greeting: string;
  fallback: string;
  placeholder: string;
  inputLabel: string;
  questions: Question[];
  /** Ruta del icono pixel de Codex cuando exista; si no, se ven las letras NX. */
  iconSrc?: string;
};

/**
 * Chat de NishixAI (prototipo, plan §17.5). Es la única isla de React de la web:
 * guarda el estado de la conversación y se mantiene al cambiar de página (transition:persist).
 */
export default function NishixChat(props: Props) {
  const { title, subtitle, greeting, fallback, placeholder, inputLabel, questions, iconSrc } =
    props;
  // ── IDs únicos ──
  // Sirven para conectar elementos por accesibilidad (aria-controls y htmlFor). useId evita
  // repetidos si hubiera más de un chat en la página.
  const panelId = useId();
  const inputId = useId();

  // ── Estado (useState) ──
  // Patrón: const [valor, setValor] = useState(valorInicial). Llamar a setValor redibuja el componente.
  const [open, setOpen] = useState(false); // ¿el panel está abierto?
  const [draft, setDraft] = useState(''); // texto que se está escribiendo en la caja
  // Lista de mensajes; empieza con el saludo de NishixAI. `useState<Message[]>` indica el tipo.
  const [messages, setMessages] = useState<Message[]>([{ from: 'NishixAI', text: greeting }]);

  // ── Referencias (useRef) ──
  // Acceso directo a elementos del DOM para enfocarlos o hacer scroll. Empiezan en null y React
  // las rellena al dibujar los elementos que llevan `ref={...}`.
  const toggleRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // ── Efectos (useEffect) ──
  // Al abrir el panel, mandamos el foco a la caja de texto (comodidad y accesibilidad con teclado).
  // El arreglo final `[open]` significa: "ejecuta esto solo cuando `open` cambie".
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Cada vez que cambian los mensajes, bajamos el scroll de la lista hasta el último.
  // `?.` (encadenamiento opcional) evita error si la referencia todavía es null.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  // ── Funciones ──
  // `say`: añade al chat la pregunta del usuario y la respuesta de NishixAI. Se pasa una función a
  // setMessages (`current => ...`) para partir de la lista más reciente y se crea una lista NUEVA
  // con `...current` (React necesita un array nuevo, no modificar el anterior).
  const say = (question: string, answer: string) =>
    setMessages((current) => [
      ...current,
      { from: 'You', text: question },
      { from: 'NishixAI', text: answer },
    ]);

  // Envío del formulario con texto libre: responde siempre con el mensaje genérico `fallback`.
  const send = (event: FormEvent) => {
    // Evita que el navegador recargue la página al enviar el <form>.
    event.preventDefault();
    const text = draft.trim(); // quita espacios al inicio y al final
    if (!text) return; // si está vacío no hacemos nada (guard clause)
    say(text, fallback);
    setDraft(''); // vacía la caja
  };

  // Cierra el panel y devuelve el foco al botón que lo abrió (para quien usa teclado).
  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  // Tecla Escape dentro del panel: lo cierra.
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    // preventDefault avisa a la tecla global Esc (volver al inicio) de que ya se usó aquí.
    event.preventDefault();
    close();
  };

  // Icono: la imagen pixel si hay `iconSrc`; si no, las letras NX. alt="" porque es decorativo.
  const icon = iconSrc ? <img src={iconSrc} alt="" width={36} height={28} /> : <span>NX</span>;

  // ── Lo que se dibuja ──
  // El fragmento <> ... </> agrupa varios elementos sin añadir una etiqueta extra al HTML.
  return (
    <>
      {/* Botón que abre/cierra el chat. aria-expanded dice si está abierto; aria-controls, qué panel controla. */}
      <button
        ref={toggleRef}
        type="button"
        className="option chat__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {/* Los dos primeros <span> son adornos del estilo "option" (tajo y placa); aria-hidden los oculta a lectores. */}
        <span className="option__slash" aria-hidden="true" />
        <span className="option__plate" aria-hidden="true" />
        <span className="option__icon chat__icon" aria-hidden="true">
          {icon}
        </span>
        <span className="option__label">{title}</span>
      </button>

      {/* Renderizado condicional: `open && (...)` solo dibuja el panel cuando open es true.
          role="dialog" + aria-label le dan nombre y función de diálogo para lectores de pantalla. */}
      {open && (
        <aside
          id={panelId}
          className="chat"
          role="dialog"
          aria-label={`${title} chat`}
          onKeyDown={onKeyDown}
        >
          {/* Cabecera del panel: icono, título, subtítulo y botón de cerrar. */}
          <div className="chat__head">
            <span className="chat__ribbon" aria-hidden="true" />
            <span className="chat__icon chat__icon--head" aria-hidden="true">
              {icon}
            </span>
            <div className="chat__titles">
              <div className="chat__title">{title}</div>
              <div className="chat__subtitle mono">{subtitle}</div>
            </div>
            <button type="button" className="chat__close" aria-label="Close chat" onClick={close}>
              <X size={18} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>

          {/* Lista de mensajes. aria-live="polite": los lectores de pantalla anuncian los mensajes nuevos
              sin interrumpir. Se usa `key` para que React identifique cada elemento de la lista;
              aquí es el índice porque los mensajes solo se añaden al final y nunca se reordenan. */}
          <ol ref={listRef} className="chat__list" aria-live="polite">
            {messages.map((message, index) => (
              <li
                key={index}
                className={`chat__bubble fx-cascade chat__bubble--${message.from === 'You' ? 'you' : 'ai'}`}
              >
                <span className="chat__who mono">{message.from}</span>
                {message.text}
              </li>
            ))}
          </ol>

          {/* Preguntas rápidas: un botón por pregunta; al pulsarlo se añade la pregunta y su respuesta. */}
          <div className="chat__chips">
            {questions.map((q) => (
              <button
                key={q.label}
                type="button"
                className="chat__chip"
                onClick={() => say(q.label, q.answer)}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Formulario de texto libre. onSubmit llama a `send`. */}
          <form className="chat__form" onSubmit={send}>
            {/* Etiqueta solo para lectores de pantalla (`sr-only` la oculta a la vista). htmlFor la une al input por su id. */}
            <label className="sr-only" htmlFor={inputId}>
              {inputLabel}
            </label>
            {/* "Componente controlado": el valor del input vive en el estado `draft` y onChange lo actualiza
                con cada tecla, así React siempre sabe qué hay escrito. */}
            <input
              ref={inputRef}
              id={inputId}
              className="chat__input"
              type="text"
              value={draft}
              placeholder={placeholder}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button type="submit" className="chat__send" aria-label="Send">
              <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
