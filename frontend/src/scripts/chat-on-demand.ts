import type { ClientDirective } from 'astro';

const chat: ClientDirective = (load, _options, island) => {
  const button = island.querySelector('.chat__toggle');
  if (!button) return;

  const open = async () => {
    if (island.hasAttribute('data-open-chat')) return;
    island.setAttribute('data-open-chat', '');
    island.setAttribute('aria-busy', 'true');
    try {
      const hydrate = await load();
      await hydrate();
      button.removeEventListener('click', open);
    } catch (error) {
      island.removeAttribute('data-open-chat');
      island.removeAttribute('aria-busy');
      console.error('NishixAI', error);
    }
  };

  button.addEventListener('click', open);
};

export default chat;
