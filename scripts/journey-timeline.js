document.addEventListener('DOMContentLoaded', () => {
  const timelineEntries = document.querySelectorAll('.timeline-entry');
  const timelineProgress = document.querySelector('.timeline-progress');

  // Function to check if an element is in viewport
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  };

  // Function to update timeline progress
  const updateTimelineProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const journeySection = document.querySelector('.journey-section');
    const journeyTop = journeySection.offsetTop;
    const journeyHeight = journeySection.offsetHeight;

    // Calculate scroll percentage within the journey section
    const scrollPercentage = Math.min(
      100,
      Math.max(
        0,
        ((scrollTop - journeyTop) / (journeyHeight - window.innerHeight)) * 100
      )
    );

    // Update progress line height
    if (timelineProgress) {
      timelineProgress.style.height = `${scrollPercentage}%`;
    }

    // Check each timeline entry
    timelineEntries.forEach(entry => {
      if (isInViewport(entry)) {
        entry.classList.add('visible');
      }
    });
  };

  // Initial check
  updateTimelineProgress();

  // Listen for scroll events
  window.addEventListener('scroll', updateTimelineProgress);

  // Add hover effects for timeline entries
  timelineEntries.forEach(entry => {
    entry.addEventListener('mouseenter', () => {
      const year = entry.getAttribute('data-year');
      const marker = entry.querySelector('.entry-marker');

      marker.style.transform = 'scale(1.3)';
      marker.style.boxShadow = '0 0 15px rgba(var(--accent-rgb), 0.6)';
    });

    entry.addEventListener('mouseleave', () => {
      const marker = entry.querySelector('.entry-marker');

      marker.style.transform = 'scale(1)';
      marker.style.boxShadow = 'none';
    });
  });
});
