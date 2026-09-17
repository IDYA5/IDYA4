(() => {
  const byId = (id) => document.getElementById(id);

  async function inject(id, url) {
    const host = byId(id);
    if (!host) return;
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      host.innerHTML = await response.text();
    } catch (error) {
      console.error(`Unable to load ${url}:`, error);
      host.innerHTML = `<div class="site-shell" style="padding:18px 28px;color:#5d7390">Navigation component could not be loaded.</div>`;
    }
  }

  function setActiveNav() {
    const page = document.body.dataset.page || 'home';
    document.querySelectorAll('[data-nav]').forEach((link) => {
      if (link.dataset.nav === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.primary-nav');
    if (!toggle || !nav) return;

    const close = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    window.addEventListener('resize', () => { if (window.innerWidth > 960) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  }

  function setYear() {
    document.querySelectorAll('[data-current-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  async function init() {
    await Promise.all([
      inject('site-header', 'partials/header.html'),
      inject('site-footer', 'partials/footer.html')
    ]);
    setActiveNav();
    initMobileNav();
    setYear();
    document.dispatchEvent(new CustomEvent('idya4:ready'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
