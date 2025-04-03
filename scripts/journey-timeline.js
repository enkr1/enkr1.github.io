document.addEventListener('DOMContentLoaded', () => {
  const timelineEntries = document.querySelectorAll('.timeline-entry');
  const timelineProgress = document.querySelector('.timeline-progress');
  const timelineScrollDot = document.querySelector('.timeline-scroll-dot');
  const journeySection = document.querySelector('.journey-section');

  // Create timeline milestones
  const createMilestones = () => {
    const timelineLine = document.querySelector('.timeline-line');
    if (!timelineLine) return;

    // Create a milestone for each entry
    timelineEntries.forEach((entry, index) => {
      const percentage = (index / (timelineEntries.length - 1)) * 100;
      const milestone = document.createElement('div');
      milestone.className = 'timeline-milestone';
      milestone.style.top = `${percentage}%`;
      milestone.dataset.index = index;
      timelineLine.appendChild(milestone);

      // Add year label to milestone
      const year = entry.getAttribute('data-year');
      if (year) {
        const yearLabel = document.createElement('div');
        yearLabel.className = 'milestone-year';
        yearLabel.textContent = year;
        yearLabel.style.position = 'absolute';
        yearLabel.style.left = index % 2 === 0 ? '-50px' : '20px';
        yearLabel.style.top = '0';
        yearLabel.style.fontSize = '0.8rem';
        yearLabel.style.opacity = '0.6';
        yearLabel.style.transition = 'all 0.3s ease';
        milestone.appendChild(yearLabel);
      }
    });

    // Add the scroll dot
    if (!timelineScrollDot) {
      const dot = document.createElement('div');
      dot.className = 'timeline-scroll-dot';
      timelineLine.appendChild(dot);
    }
  };

  // Create the snowing effect particles (keep this as you like it)
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
    const scrollPosition = scrollTop - journeyTop + windowHeight/2;
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
      }
    }

    // Calculate which entry should be active based on scroll position
    const entryHeight = journeyHeight / timelineEntries.length;
    const activeIndex = Math.floor(scrollPosition / entryHeight);

    // Update milestone states
    document.querySelectorAll('.timeline-milestone').forEach((milestone) => {
      const index = parseInt(milestone.dataset.index);
      if (index <= activeIndex) {
        milestone.classList.add('active');
      } else {
        milestone.classList.remove('active');
      }
    });

    // Update entry states for slideshow effect
    timelineEntries.forEach((entry, index) => {
      // Remove all states first
      entry.classList.remove('active', 'past', 'future');

      if (index === activeIndex) {
        // Current entry
        entry.classList.add('active');

        // Animate the connecting line
        const line = entry.querySelector('.entry-content::before');
        if (line) {
          line.style.width = '30px';
        }

        // Trigger a subtle animation
        entry.style.animation = 'none';
        void entry.offsetWidth; // Trigger reflow
        entry.style.animation = 'entryPulse 0.5s ease-out';
      } else if (index < activeIndex) {
        // Past entries
        entry.classList.add('past');
      } else {
        // Future entries
        entry.classList.add('future');
      }
    });

    // Add a parallax effect to the active entry
    const activeEntry = document.querySelector('.timeline-entry.active');
    if (activeEntry) {
      const entryRect = activeEntry.getBoundingClientRect();
      const entryCenter = entryRect.top + entryRect.height / 2;
      const screenCenter = windowHeight / 2;
      const offset = (entryCenter - screenCenter) * 0.05;

      activeEntry.style.transform = `translateY(${-offset}px) scale(1)`;
    }
  };

  // Add scroll snap functionality for a more slideshow-like experience
  const addScrollSnap = () => {
    // Calculate snap points
    const snapPoints = [];
    timelineEntries.forEach((entry, index) => {
      const journeyTop = journeySection.offsetTop;
      const journeyHeight = journeySection.offsetHeight;
      const entryHeight = journeyHeight / timelineEntries.length;
      const snapPoint = journeyTop + (index * entryHeight);
      snapPoints.push(snapPoint);
    });

    // Add smooth scrolling to next/prev entry
    let isScrolling = false;
    let scrollTimeout;

    window.addEventListener('wheel', (e) => {
      // Only handle wheel events when in the journey section
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const journeyTop = journeySection.offsetTop;
      const journeyBottom = journeyTop + journeySection.offsetHeight;

      if (scrollTop >= journeyTop - 100 && scrollTop <= journeyBottom + 100) {
        if (!isScrolling) {
          clearTimeout(scrollTimeout);

          // Find closest snap point
          const currentPosition = scrollTop;
          let closestPoint = snapPoints[0];
          let minDistance = Math.abs(currentPosition - closestPoint);

          snapPoints.forEach((point) => {
            const distance = Math.abs(currentPosition - point);
            if (distance < minDistance) {
              minDistance = distance;
              closestPoint = point;
            }
          });

          // Determine direction and target
          const direction = e.deltaY > 0 ? 1 : -1;
          const currentIndex = snapPoints.indexOf(closestPoint);
          const targetIndex = Math.max(0, Math.min(snapPoints.length - 1, currentIndex + direction));
          const targetPoint = snapPoints[targetIndex];

          // Only scroll if we're changing points
          if (targetPoint !== closestPoint) {
            isScrolling = true;

            window.scrollTo({
              top: targetPoint,
              behavior: 'smooth'
            });

            // Reset scrolling flag after animation completes
            scrollTimeout = setTimeout(() => {
              isScrolling = false;
            }, 800);

            e.preventDefault();
          }
        } else {
          e.preventDefault();
        }
      }
    }, { passive: false });
  };

  // Initialize the timeline
  const initTimeline = () => {
    // Create milestones
    createMilestones();

    // Create snowing effect
    createSnowingEffect();

    // Initial check
    updateTimelineProgress();

    // Add scroll snap
    addScrollSnap();

    // Listen for scroll events
    window.addEventListener('scroll', updateTimelineProgress);

    // Add mouse interaction for 3D effect
    journeySection.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = journeySection.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      // Apply 3D effect to active entry
      const activeEntry = document.querySelector('.timeline-entry.active .entry-content');
      if (activeEntry) {
        activeEntry.style.transform = `translateZ(30px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
      }
    });

    journeySection.addEventListener('mouseleave', () => {
      // Reset 3D effect
      const activeEntry = document.querySelector('.timeline-entry.active .entry-content');
      if (activeEntry) {
        activeEntry.style.transform = 'translateZ(30px)';
      }
    });
  };

  // Initialize everything
  if (journeySection) {
    initTimeline();
  }
});
