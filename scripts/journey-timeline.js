document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const timelineEntries = document.querySelectorAll(".timeline-entry");
  const timelineProgress = document.querySelector(".timeline-progress");
  const journeySection = document.querySelector(".journey-section");

  // Settings with optimized values
  const SETTINGS = {
    activationZone: window.innerHeight * 0.6,
    blurAmount: 30,
    opacityMin: 0.3,
    opacityMax: 1.0,
    scaleMin: 0.8,
    scaleMax: 1.0,
    transitionDuration: 400,
    pixelSensitivity: 10,
    progressEasing: 0.1, // Smooth progress animation
  };

  // State variables
  let lastScrollY = window.pageYOffset;
  let currentProgress = 0;
  let targetProgress = 0;

  // Calculate animation values
  const calculateAnimationValues = (entry) => {
    const rect = entry.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const entryCenter = rect.top + rect.height / 2;
    const distance = Math.abs(entryCenter - viewportCenter);
    const progress = 1 - Math.min(1, distance / SETTINGS.activationZone);
    const easedProgress = progress * progress * (3 - 2 * progress); // smoothstep

    return {
      blur: SETTINGS.blurAmount * (1 - easedProgress),
      opacity:
        SETTINGS.opacityMin +
        (SETTINGS.opacityMax - SETTINGS.opacityMin) * easedProgress,
      scale:
        SETTINGS.scaleMin +
        (SETTINGS.scaleMax - SETTINGS.scaleMin) * easedProgress,
      progress: easedProgress,
    };
  };

  // Update entry state
  const updateEntryState = (entry, values) => {
    entry.style.filter = `blur(${values.blur}px)`;
    entry.style.opacity = values.opacity;
    entry.style.transform = `scale(${values.scale})`;
    entry.classList.toggle("active", values.progress > 0.7);
    return values.progress;
  };

  // Find most active entry
  const findMostActiveEntry = () => {
    let maxProgress = 0;
    let activeIndex = -1;

    timelineEntries.forEach((entry, index) => {
      const values = calculateAnimationValues(entry);
      const progress = updateEntryState(entry, values);

      if (progress > maxProgress) {
        maxProgress = progress;
        activeIndex = index;
      }
    });

    return activeIndex;
  };

  // Update timeline progress (smooth animation)
  const updateTimelineProgress = () => {
    if (!timelineProgress || !journeySection) return;

    const scrollTop = window.pageYOffset;
    const { offsetTop: sectionTop, offsetHeight: sectionHeight } =
      journeySection;
    const windowHeight = window.innerHeight;

    const start = sectionTop - windowHeight * 0.5;
    const end = sectionTop + sectionHeight - windowHeight * 0.5;
    const scrollRange = end - start;

    if (scrollRange > 0) {
      targetProgress = Math.max(
        0,
        Math.min(1, (scrollTop - start) / scrollRange)
      );
    }

    // Smooth progress animation
    currentProgress +=
      (targetProgress - currentProgress) * SETTINGS.progressEasing;
    timelineProgress.style.transform = `scaleY(${currentProgress})`;
  };

  // Main animation loop
  const animate = () => {
    currentActiveIndex = findMostActiveEntry();
    updateTimelineProgress();
    animationFrame = requestAnimationFrame(animate);
  };

  // Handle scroll with throttling
  const handleScroll = () => {
    const currentScrollY = window.pageYOffset;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);

    if (scrollDelta >= SETTINGS.pixelSensitivity) {
      lastScrollY = currentScrollY;
    }
  };

  // Initialize timeline
  const initTimeline = () => {
    if (!journeySection || timelineEntries.length === 0) return;

    // Start animation loop
    animate();

    // Event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });

    window.addEventListener(
      "resize",
      () => {
        SETTINGS.activationZone = window.innerHeight * 0.5;
      },
      { passive: true }
    );
  };

  // Initialize
  initTimeline();
});
