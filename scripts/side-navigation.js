// Side Navigation Functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing side navigation');

  const navTrigger = document.querySelector('.side-nav-trigger');
  const sideNav = document.querySelector('.side-navigation');
  const navClose = document.querySelector('.nav-close');
  const overlay = document.querySelector('.overlay');
  const navLinks = document.querySelectorAll('.side-nav-links .nav-item a');
  const dropdownToggles = document.querySelectorAll('.side-nav-links .dropdown .dropdown-toggle');

  console.log('Nav elements found:', {
    trigger: navTrigger,
    nav: sideNav,
    close: navClose,
    overlay: overlay,
    links: navLinks.length,
    dropdowns: dropdownToggles.length
  });

  // Open navigation with enhanced animation
  navTrigger.addEventListener('click', () => {
    console.log('Nav trigger clicked');

    // Reset any ongoing animations
    sideNav.style.animation = 'none';
    sideNav.offsetHeight; // Force reflow
    sideNav.style.animation = '';

    // Set delay index for each nav item to create sequence
    const navItems = document.querySelectorAll('.side-nav-links .nav-item');
    navItems.forEach((item, index) => {
      item.style.setProperty('--item-index', index);
    });

    // Add active class after setting indices
    sideNav.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close navigation with animation
  const closeNav = () => {
    // Allow the exit animation to play before removing the active class
    sideNav.addEventListener('animationend', function handler() {
      if (!sideNav.classList.contains('active')) {
        document.body.style.overflow = '';
        sideNav.removeEventListener('animationend', handler);
      }
    });

    overlay.classList.remove('active');
    sideNav.classList.remove('active');
  };

  navClose.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);

  // Close navigation when clicking on non-dropdown links
  navLinks.forEach(link => {
    if (!link.classList.contains('dropdown-toggle')) {
      link.addEventListener('click', () => {
        closeNav();
      });
    }
  });

  // Handle dropdown toggles
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.parentElement;

      // Toggle current dropdown without closing others
      parent.classList.toggle('open');
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
