document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  /* ----- Menu mobile ----- */
  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  // Ferme le menu après un clic sur un lien
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  // Ferme le menu avec Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Ferme le menu si l'écran repasse en grand format
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMenu();
  });

  /* ----- Ombre de l'en-tête au défilement ----- */
  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ----- Lien actif selon la section visible ----- */
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => spy.observe(section));

    /* ----- Apparition des éléments ----- */
    const reveal = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));
  } else {
    // Navigateurs anciens : tout est affiché directement
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  /* ----- Année du pied de page ----- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});