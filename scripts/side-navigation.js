document.addEventListener('DOMContentLoaded', () => {
  const navTrigger = document.querySelector('.side-nav-trigger');
  const fullscreenNav = document.querySelector('.fullscreen-nav');

  if (!navTrigger || !fullscreenNav) return;

  const toggleNav = () => {
    const isOpen = fullscreenNav.classList.contains('active');

    if (isOpen) {
      fullscreenNav.classList.remove('active');
      navTrigger.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      fullscreenNav.classList.add('active');
      navTrigger.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  navTrigger.addEventListener('click', toggleNav);

  fullscreenNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', toggleNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreenNav.classList.contains('active')) {
      toggleNav();
    }
  });
});
