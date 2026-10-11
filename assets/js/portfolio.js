/* Progressive enhancement. Page content and image links also work without JS. */
(() => {
  const dialog = document.querySelector('.lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    const image = dialog.querySelector('img');
    const caption = dialog.querySelector('.lightbox-caption');
    document.querySelectorAll('a[data-lightbox]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        image.src = link.href;
        image.alt = link.querySelector('img')?.alt || '';
        caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent || image.alt;
        dialog.showModal();
      });
    });
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  }
  const tocLinks = [...document.querySelectorAll('.case-nav a')];
  if ('IntersectionObserver' in window && tocLinks.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-8% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('.case-section[id]').forEach(section => observer.observe(section));
  }
  // Add keyboard focus management to Phantom's slide-out menu.
  const trigger = document.querySelector('a[href="#menu"]');
  const menu = document.querySelector('#menu');
  if (trigger && menu) {
    trigger.setAttribute('aria-controls', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    let wasOpen = false;
    const observer = new MutationObserver(() => {
      const open = document.body.classList.contains('is-menu-visible');
      trigger.setAttribute('aria-expanded', String(open));
      if (open && !wasOpen) menu.querySelector('a')?.focus();
      if (!open && wasOpen) trigger.focus();
      wasOpen = open;
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Tab' || !document.body.classList.contains('is-menu-visible')) return;
      const links = [...menu.querySelectorAll('a,button')];
      if (!links.length) return;
      if (event.shiftKey && document.activeElement === links[0]) {
        event.preventDefault(); links[links.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === links[links.length - 1]) {
        event.preventDefault(); links[0].focus();
      }
    });
  }
})();
