// Chat UI. Uses textContent only (no innerHTML) so model output can't inject markup.
(function () {
  const log = document.getElementById('log');
  const form = document.getElementById('form');
  const input = document.getElementById('q');
  const send = document.getElementById('send');
  const reset = document.getElementById('reset');
  const lang = document.getElementById('lang');

  let history = [];
  const saved = localStorage.getItem('lang');
  if (saved && ['en', 'ta', 'hi'].includes(saved)) lang.value = saved;
  lang.addEventListener('change', () => localStorage.setItem('lang', lang.value));

  function add(cls, text) {
    const p = document.createElement('p');
    p.className = 'msg ' + cls;
    p.textContent = text;
    log.appendChild(p);
    p.scrollIntoView({ block: 'end' });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    add('user', text);
    history.push({ role: 'user', text });
    input.value = '';
    send.disabled = true;
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang: lang.value, messages: history })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'Something went wrong.');
      history.push({ role: 'model', text: data.reply });
      add('bot', data.reply);
    } catch (err) {
      history.pop();
      add('err', navigator.onLine ? err.message : 'You appear to be offline.');
    } finally {
      send.disabled = false;
    }
  });

  reset.addEventListener('click', () => {
    history = [];
    log.textContent = '';
    add('bot', 'New conversation started. What would you like to ask?');
  });
})();
