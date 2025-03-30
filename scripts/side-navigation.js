// Side Navigation Functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing side navigation');

  const navTrigger = document.querySelector('.side-nav-trigger');
  const sideNav = document.querySelector('.side-navigation');
  const navClose = document.querySelector('.nav-close');
  const overlay = document.querySelector('.overlay');
  const navLinks = document.querySelectorAll('.side-nav-links .nav-item a');

  console.log('Nav elements found:', {
    trigger: navTrigger,
    nav: sideNav,
    close: navClose,
    overlay: overlay,
    links: navLinks.length
  });

  // Open navigation
  navTrigger.addEventListener('click', () => {
    console.log('Nav trigger clicked');
    sideNav.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when nav is open
  });

  // Close navigation functions
  const closeNav = () => {
    sideNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
  };

  navClose.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);

  // Close navigation when clicking on links (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  // Active link highlighting based on scroll position
  const sections = document.querySelectorAll('section[id]');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.side-nav-links .nav-item a[href*=${sectionId}]`)
          ?.parentElement.classList.add('active');
      } else {
        document.querySelector(`.side-nav-links .nav-item a[href*=${sectionId}]`)
          ?.parentElement.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);
});
