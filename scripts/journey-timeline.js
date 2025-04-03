document.addEventListener('DOMContentLoaded', () => {
  const timelineEntries = document.querySelectorAll('.timeline-entry');
  const timelineProgress = document.querySelector('.timeline-progress');
  const timelineScrollDot = document.querySelector('.timeline-scroll-dot');
  const journeySection = document.querySelector('.journey-section');

  // Create roadmap elements
  const createRoadmapElements = () => {
    const roadmap = document.createElement('div');
    roadmap.className = 'timeline-roadmap';
    journeySection.appendChild(roadmap);

    // Add stars
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('div');
      star.className = 'roadmap-star';
      roadmap.appendChild(star);
    }

    // Add checkpoints
    for (let i = 0; i < 5; i++) {
      const checkpoint = document.createElement('div');
      checkpoint.className = 'roadmap-checkpoint';
      roadmap.appendChild(checkpoint);
    }
  };

  // Create the snowing effect particles
  const createSnowingEffect = () => {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'timeline-particles';
    journeySection.appendChild(particlesContainer);

    // Create multiple particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'timeline-particle';

      // Random position, size and animation delay
      const size = Math.random() * 4 + 1;
      const left = Math.random() * 100;
      const animDelay = Math.random() * 5;
      const animDuration = Math.random() * 10 + 10;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.animationDelay = `${animDelay}s`;
      particle.style.animationDuration = `${animDuration}s`;

      particlesContainer.appendChild(particle);
    }
  };

  // Function to check if an element is in viewport
  const isInViewport = (element, offset = 0.8) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * offset &&
      rect.bottom >= 0
    );
  };

  // Function to update timeline progress based on scroll position
  const updateTimelineProgress = () => {
    if (!journeySection) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const journeyTop = journeySection.offsetTop;
    const journeyHeight = journeySection.offsetHeight;
    const windowHeight = window.innerHeight;

    // Calculate how far we've scrolled through the journey section
    const scrollPosition = scrollTop - journeyTop + windowHeight / 2;
    const scrollPercentage = Math.min(
      100,
      Math.max(
        0,
        (scrollPosition / journeyHeight) * 100
      )
    );

    // Update progress line height
    if (timelineProgress) {
      timelineProgress.style.height = `${scrollPercentage}%`;

      // Position the scroll dot along the timeline
      const dot = document.querySelector('.timeline-scroll-dot');
      if (dot) {
        dot.style.top = `${scrollPercentage}%`;

        // Calculate x-offset for winding path
        const pathOffset = Math.sin(scrollPercentage / 100 * Math.PI * 2) * 10;
        dot.style.marginLeft = `${pathOffset}px`;
      }
    }

    // Check each timeline entry
    timelineEntries.forEach((entry) => {
      const entryRect = entry.getBoundingClientRect();
      const entryMiddle = entryRect.top + entryRect.height / 2;
      const screenMiddle = window.innerHeight / 2;

      // Calculate distance from middle of screen
      const distance = Math.abs(entryMiddle - screenMiddle);
      const maxDistance = window.innerHeight * 0.4; // 40% of screen height

      // If entry is close to the dot/middle of screen
      if (distance < maxDistance) {
        // Calculate how close (0 = far, 1 = at center)
        const proximity = 1 - (distance / maxDistance);

        // Add active class when very close
        if (proximity > 0.7) {
          entry.classList.add('active');
        } else {
          entry.classList.remove('active');
        }

        // Scale based on proximity
        const scale = 1 + (proximity * 0.05);
        entry.querySelector('.entry-content').style.transform = `translateZ(${proximity * 30}px) scale(${scale})`;
      } else {
        entry.classList.remove('active');
        entry.querySelector('.entry-content').style.transform = '';
      }

      // Add visible class for basic animations
      if (isInViewport(entry, 0.9)) {
        entry.classList.add('visible');
      }
    });
  };

  // Initialize the timeline
  const initTimeline = () => {
    // Create roadmap elements
    createRoadmapElements();

    // Create snowing effect
    createSnowingEffect();

    // Initial check
    updateTimelineProgress();

    // Listen for scroll events
    window.addEventListener('scroll', updateTimelineProgress);

    // Add mouse interaction for 3D effect
    journeySection.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = journeySection.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      // Apply 3D effect to visible entries
      document.querySelectorAll('.timeline-entry.visible:not(.active) .entry-content').forEach(content => {
        content.style.transform = `translateZ(20px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
      });

      // Move roadmap stars slightly with mouse
      document.querySelectorAll('.roadmap-star').forEach(star => {
        star.style.transform = `translateX(${x * 20}px) translateY(${y * 20}px)`;
      });
    });

    journeySection.addEventListener('mouseleave', () => {
      // Reset 3D effect for non-active entries
      document.querySelectorAll('.timeline-entry.visible:not(.active) .entry-content').forEach(content => {
        content.style.transform = '';
      });

      // Reset star positions
      document.querySelectorAll('.roadmap-star').forEach(star => {
        star.style.transform = '';
      });
    });
  };

  // Initialize everything
  if (journeySection) {
    initTimeline();
  }
});
