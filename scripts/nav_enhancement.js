export function setupEnhancedNavigation() {
  const header = document.querySelector('header');
  if (!header) return;

  const SCROLL_THRESHOLD = 100;
  const MAX_TRANSFORM = 150; // pixels until full transformation
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeaderState(scrollY) {
    // Calculate transformation progress (0 to 1)
    const progress = Math.min(1, Math.max(0, scrollY / MAX_TRANSFORM));

    // Apply CSS variables for smooth transformation
    header.style.setProperty('--nav-progress', progress);

    // Scroll direction logic
    if (scrollY > lastScrollY && scrollY > SCROLL_THRESHOLD) {
      header.classList.add('nav-hidden');
    } else {
      header.classList.remove('nav-hidden');
    }

    lastScrollY = scrollY;
  }

  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeaderState(window.scrollY);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  updateHeaderState(window.scrollY);
}
