document.addEventListener("DOMContentLoaded", function () {
  const timelineEntries = document.querySelectorAll(".timeline-entry");
  const timelineProgress = document.querySelector(".timeline-progress");
  const journeySection = document.querySelector(".journey-section");
  const timelineLine = document.querySelector(".timeline-line");

  // ADJUSTABLE SETTINGS - Customize these values
  const SETTINGS = {
    transitionDuration: 300, // Faster transitions for pixel-responsive animation
    activationZone: window.innerHeight * 0.8, // Larger zone for gradual transitions
    blurAmount: 6, // Maximum blur amount
    opacityMin: 0.3, // Minimum opacity for distant entries
    opacityMax: 1.0, // Maximum opacity for active entry
    scaleMin: 0.92, // Minimum scale for distant entries
    scaleMax: 1.05, // Maximum scale for active entry
    cardWidth: '60vw', // Make cards 60% of viewport width
    pixelSensitivity: 2, // How many pixels of scroll affect the animation
  };

  let currentActiveIndex = -1;

  // Initialize timeline entries
  const initializeEntries = () => {
    timelineEntries.forEach((entry, index) => {
      // Set initial styles with smooth transitions
      entry.style.transition = `all ${SETTINGS.transitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      entry.style.transformOrigin = "center center";
      entry.style.position = "relative";
      entry.style.zIndex = "20";

      // Make cards larger (60% of viewport width)
      const entryContent = entry.querySelector('.entry-content');
      if (entryContent) {
        entryContent.style.width = SETTINGS.cardWidth;
        entryContent.style.maxWidth = '800px'; // Reasonable max width
        entryContent.style.transition = `all ${SETTINGS.transitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      }

      // Initialize as inactive
      entry.style.filter = `blur(${SETTINGS.blurAmount}px)`;
      entry.style.opacity = SETTINGS.opacityInactive;
      entry.style.transform = `scale(${SETTINGS.scaleInactive})`;
    });
  };

  // Calculate pixel-responsive animation values based on distance from viewport center
  const calculateAnimationValues = (entry) => {
    const rect = entry.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const entryCenter = rect.top + rect.height / 2;
    const distanceFromCenter = Math.abs(entryCenter - viewportCenter);

    // Calculate activation progress (0 = far away, 1 = at center)
    const maxDistance = SETTINGS.activationZone;
    const progress = Math.max(0, Math.min(1, 1 - (distanceFromCenter / maxDistance)));

    // Smooth easing function for more natural animation
    const easedProgress = progress * progress * (3 - 2 * progress); // smoothstep

    // Calculate values based on progress
    const blur = SETTINGS.blurAmount * (1 - easedProgress);
    const opacity = SETTINGS.opacityMin + (SETTINGS.opacityMax - SETTINGS.opacityMin) * easedProgress;
    const scale = SETTINGS.scaleMin + (SETTINGS.scaleMax - SETTINGS.scaleMin) * easedProgress;

    return { blur, opacity, scale, progress: easedProgress };
  };

  // Update entry visual state with pixel-responsive values
  const updateEntryState = (entry, index) => {
    const { blur, opacity, scale, progress } = calculateAnimationValues(entry);

    // Apply smooth transitions
    entry.style.filter = `blur(${blur.toFixed(2)}px)`;
    entry.style.opacity = opacity.toFixed(3);
    entry.style.transform = `scale(${scale.toFixed(4)})`;

    // Z-index based on activation level
    const zIndex = 20 + Math.floor(progress * 5);
    entry.style.zIndex = zIndex.toString();

    // Add/remove active class based on threshold
    if (progress > 0.7) {
      entry.classList.add("active");
    } else {
      entry.classList.remove("active");
    }

    return progress;
  };

  // Calculate which entry is most active based on scroll position
  const calculateMostActiveEntry = () => {
    let mostActiveIndex = -1;
    let highestProgress = 0;

    timelineEntries.forEach((entry, index) => {
      const { progress } = calculateAnimationValues(entry);

      if (progress > highestProgress) {
        highestProgress = progress;
        mostActiveIndex = index;
      }
    });

    return { index: mostActiveIndex, progress: highestProgress };
  };

  // Main scroll handler with pixel-responsive animation
  const handleScroll = () => {
    const { index: mostActiveIndex, progress: highestProgress } = calculateMostActiveEntry();

    // Update all entries with pixel-responsive values
    const entryProgresses = [];
    timelineEntries.forEach((entry, index) => {
      const progress = updateEntryState(entry, index);
      entryProgresses.push(progress);
    });

    // Update current active index only if there's a significant change
    if (highestProgress > 0.5) {
      currentActiveIndex = mostActiveIndex;
    }

    // Update timeline progress
    updateTimelineProgress(entryProgresses);
  };

  // Update timeline progress line and dot position with pixel precision
  const updateTimelineProgress = (entryProgresses = []) => {
    if (!timelineProgress || !journeySection) return;

    const scrollTop = window.pageYOffset;
    const journeyTop = journeySection.offsetTop;
    const journeyHeight = journeySection.offsetHeight;
    const windowHeight = window.innerHeight;

    const sectionStart = journeyTop - windowHeight * 0.5;
    const sectionEnd = journeyTop + journeyHeight - windowHeight * 0.5;
    const scrollProgress = Math.max(
      0,
      Math.min(1, (scrollTop - sectionStart) / (sectionEnd - sectionStart))
    );

    timelineProgress.style.transform = `scaleY(${scrollProgress})`;

    // Update scroll dot with pixel-precise positioning
    const scrollDot = document.querySelector(".timeline-scroll-dot");
    if (scrollDot) {
      if (currentActiveIndex >= 0 && timelineEntries[currentActiveIndex]) {
        const activeEntry = timelineEntries[currentActiveIndex];
        const entryRect = activeEntry.getBoundingClientRect();
        const journeyRect = journeySection.getBoundingClientRect();

        // Calculate precise position based on entry's current position
        const entryCenter = entryRect.top + entryRect.height / 2;
        const journeyCenterRelative = entryCenter - journeyRect.top;
        const dotPosition = (journeyCenterRelative / journeyRect.height) * 100;

        // Smooth interpolation for dot movement
        const clampedPosition = Math.max(0, Math.min(100, dotPosition));
        scrollDot.style.top = `${clampedPosition}%`;

        // Faster transition for more responsive feel
        scrollDot.style.transition = `top ${SETTINGS.transitionDuration * 0.6}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      } else {
        // Fallback to scroll progress with smooth interpolation
        scrollDot.style.top = `${scrollProgress * 100}%`;
      }
    }
  };

  // Create scroll dot
  const createScrollDot = () => {
    if (!timelineLine || document.querySelector(".timeline-scroll-dot")) return;

    const dot = document.createElement("div");
    dot.className = "timeline-scroll-dot";
    timelineLine.appendChild(dot);
  };

  // Initialize everything
  const init = () => {
    if (!journeySection || timelineEntries.length === 0) return;

    initializeEntries();
    createScrollDot();

    // High-frequency scroll listener for pixel-responsive animation
    let ticking = false;
    let lastScrollY = window.pageYOffset;

    window.addEventListener(
      "scroll",
      () => {
        const currentScrollY = window.pageYOffset;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);

        // Only update if scroll delta is significant enough or if not already ticking
        if (!ticking || scrollDelta >= SETTINGS.pixelSensitivity) {
          if (ticking) {
            // Cancel previous frame if new scroll is significant
            cancelAnimationFrame(ticking);
          }

          ticking = requestAnimationFrame(() => {
            handleScroll();
            lastScrollY = currentScrollY;
            ticking = false;
          });
        }
      },
      { passive: true }
    );

    // Handle resize with immediate response
    let resizeTimeout;
    window.addEventListener(
      "resize",
      () => {
        // Clear previous timeout
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }

        // Immediate update for responsive feel
        handleScroll();

        // Delayed re-initialization for performance
        resizeTimeout = setTimeout(() => {
          initializeEntries();
          handleScroll();
        }, 150);
      },
      { passive: true }
    );

    // Initial check
    setTimeout(handleScroll, 100);
  };

  // Start the system
  init();

  // Expose settings for easy customization
  window.TimelineSettings = SETTINGS;
  console.log("Timeline Settings:", SETTINGS);
  console.log("Customize blur with: window.TimelineSettings.blurAmount = 5");
});
