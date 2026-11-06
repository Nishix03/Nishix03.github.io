import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowRight, MessageSquare, X } from 'lucide-react';
import './NishixChat.css';

type Question = { label: string; answer: string };
type Message = { from: 'You' | 'NishixAI'; text: string };

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
  const panelId = useId();
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ from: 'NishixAI', text: greeting }]);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const say = (question: string, answer: string) =>
    setMessages((current) => [
      ...current,
      { from: 'You', text: question },
      { from: 'NishixAI', text: answer },
    ]);

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    say(text, fallback);
    setDraft('');
  };

  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    // preventDefault avisa a la tecla global Esc (volver al inicio) de que ya se usó aquí.
    event.preventDefault();
    close();
  };

  const icon = iconSrc ? <img src={iconSrc} alt="" width={36} height={28} /> : <span>NX</span>;

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="option chat__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="option__slash" aria-hidden="true" />
        <span className="option__plate" aria-hidden="true" />
        <span className="option__icon chat__icon" aria-hidden="true">
          {icon}
        </span>
        <MessageSquare className="chat__toggle-icon" size={16} aria-hidden="true" />
        <span className="option__label">{title}</span>
      </button>

      {open && (
        <aside
          id={panelId}
          className="chat"
          role="dialog"
          aria-label={`${title} chat`}
          onKeyDown={onKeyDown}
        >
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

          <ol ref={listRef} className="chat__list" aria-live="polite" tabIndex={0}>
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

          <form className="chat__form" onSubmit={send}>
            <label className="sr-only" htmlFor={inputId}>
              {inputLabel}
            </label>
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
