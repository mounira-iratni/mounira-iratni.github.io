document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');
  const navLinks = Array.from(menu.querySelectorAll('a[href^="#"]'));

  /* ---------- Menu mobile ---------- */
  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }

  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 880) setMenu(false); });

  /* ---------- Barre de navigation au défilement ---------- */
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Onglets des expériences ---------- */
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = Array.from(document.querySelectorAll('.tab-panel'));

  function selectTab(index, focus) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
      panels[i].classList.toggle('active', active);
    });
    if (focus) tabs[index].focus();
    tabs[index].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(i, false));
    tab.addEventListener('keydown', (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      selectTab((i + keys[e.key] + tabs.length) % tabs.length, true);
    });
  });

  /* ---------- Lien actif + apparition ---------- */
  if ('IntersectionObserver' in window) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));

    const reveal = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Année ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});