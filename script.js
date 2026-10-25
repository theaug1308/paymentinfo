(() => {
  const rows = [...document.querySelectorAll('.row')];
  const status = document.getElementById('status');

  rows.forEach((row) => {
    const a = row.dataset.address;
    row.querySelector('.short').textContent = a.slice(0, 6) + '…' + a.slice(-4);
    // One continuous string: first 6 and last 4 characters highlighted
    const box = row.querySelector('.addr');
    const head = document.createElement('b'), tail = document.createElement('b');
    head.textContent = a.slice(0, 6);
    tail.textContent = a.slice(-4);
    box.append(head, a.slice(6, -4), tail);
    const copy = row.querySelector('.copy');
    copy.dataset.copy = a;
    copy.dataset.name = 'Address';
  });

  function setOpen(row, open) {
    row.classList.toggle('open', open);
    row.querySelector('h2 button').setAttribute('aria-expanded', open);
    row.querySelector('.panel').hidden = !open;
  }

  function show(id) {
    rows.forEach((r) => setOpen(r, r.id === id));
    history.replaceState(null, '', '#' + id);
  }

  rows.forEach((row) => {
    row.querySelector('h2 button').addEventListener('click', () => {
      if (row.classList.contains('open')) {
        setOpen(row, false);
        history.replaceState(null, '', location.pathname + location.search);
      } else show(row.id);
    });
  });

  const hash = location.hash.slice(1);
  show(rows.some((r) => r.id === hash) ? hash : rows[0].id);

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch {}
      ta.remove();
      return ok;
    }
  }

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const label = btn.textContent;
    let timer;
    btn.addEventListener('click', async () => {
      const ok = await copyText(btn.dataset.copy);
      clearTimeout(timer);
      btn.classList.toggle('is-error', !ok);
      btn.textContent = ok ? 'Copied' : 'Couldn’t copy';
      status.textContent = ok
        ? `${btn.dataset.name} copied`
        : 'Couldn’t copy. Select the text and copy it by hand.';
      if (!ok) {
        const addr = btn.closest('.row')?.querySelector('.addr');
        if (addr) getSelection().selectAllChildren(addr);
      }
      timer = setTimeout(() => {
        btn.textContent = label;
        btn.classList.remove('is-error');
      }, 2000);
    });
  });
})();
