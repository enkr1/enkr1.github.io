// Export the setupScrollEvents function
export function setupScrollEvents() {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize smooth scrolling
    document.body.classList.add('smooth-scroll');

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.fade-in');

    // Intersection Observer for fade-in elements
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve after animation
          // revealObserver.unobserve(entry.target);
        } else {
          // Optional: remove the class when element is not in view
          // entry.target.classList.remove('visible');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

    // Parallax effect for background elements
    const parallaxElements = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });

    // Tech grid animation on scroll
    const gridLines = document.querySelectorAll('.grid-line');

    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      gridLines.forEach((line, index) => {
        const moveAmount = (scrollPosition / windowHeight) * (10 + (index % 5));
        line.style.transform = `translateX(${moveAmount}px)`;
      });
    });

    // Glitch effect on scroll
    const glitchElements = document.querySelectorAll('.glitch-on-scroll');

    window.addEventListener('scroll', () => {
      glitchElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isInView = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth
        );

        if (isInView) {
          element.classList.add('glitching');
          setTimeout(() => {
            element.classList.remove('glitching');
          }, 1000);
        }
      });
    });

    // Scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = `${scrolled}%`;
    });

    // Scroll-triggered section transitions
    const sections = document.querySelectorAll('section');

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-active');

          // Add data attribute to body to track current section
          document.body.setAttribute('data-current-section', entry.target.id);

          // Trigger any section-specific animations
          const animElements = entry.target.querySelectorAll('.anim-trigger');
          animElements.forEach(el => {
            el.classList.add('anim-active');
          });
        } else {
          // Optional: remove active class when section is not in view
          // entry.target.classList.remove('section-active');
        }
      });
    }, {
      threshold: 0.3
    });

    sections.forEach(section => {
      sectionObserver.observe(section);
    });

    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating');

    floatingElements.forEach((element, index) => {
      const randomDelay = Math.random() * 2;
      const randomDuration = 3 + Math.random() * 2;

      element.style.animation = `floatAnimation ${randomDuration}s ease-in-out ${randomDelay}s infinite alternate`;
    });

    // Tech typing effect
    const typingElements = document.querySelectorAll('.typing-text');

    typingElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.classList.add('terminal-text');

      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 50 + Math.random() * 50);
        }
      };

      const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typeWriter();
            typingObserver.unobserve(element);
          }
        });
      }, { threshold: 0.5 });

      typingObserver.observe(element);
    });
  });



}
