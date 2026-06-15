document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.horizontal-sections');
  if (!container) return;

  const panels = Array.from(container.querySelectorAll('.panel'));

  panels.forEach((panel, i) => {
    const left = panel.querySelector('.swipe-left');
    const right = panel.querySelector('.swipe-right');

    if (left) left.addEventListener('click', () => scrollToIndex(i - 1));
    if (right) right.addEventListener('click', () => scrollToIndex(i + 1));
  });

  function isHorizontal() {
    return container.scrollWidth > container.clientWidth + 10;
  }

  function scrollToIndex(idx) {
    if (idx < 0) idx = panels.length - 1;
    if (idx >= panels.length) idx = 0;
    const target = panels[idx];
    if (!target) return;

    if (isHorizontal()) {
      container.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    } else {
      const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      // Scroll the page so the target panel is near top (account for sticky nav)
      window.scrollTo({ top: target.offsetTop - navHeight - 12, behavior: 'smooth' });
    }
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') scrollToIndex(currentVisibleIndex() + 1);
    if (e.key === 'ArrowLeft') scrollToIndex(currentVisibleIndex() - 1);
  });

  function currentVisibleIndex() {
    const rects = panels.map(p => p.getBoundingClientRect());
    if (isHorizontal()) {
      const centerX = window.innerWidth / 2;
      for (let i = 0; i < rects.length; i++) {
        if (rects[i].left <= centerX && rects[i].right >= centerX) return i;
      }
    } else {
      const centerY = window.innerHeight / 2;
      for (let i = 0; i < rects.length; i++) {
        if (rects[i].top <= centerY && rects[i].bottom >= centerY) return i;
      }
    }
    return 0;
  }
});
