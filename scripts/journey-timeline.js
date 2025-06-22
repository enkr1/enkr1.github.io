document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const journeyStories = document.querySelectorAll(".journey-story");
  const trackProgress = document.querySelector(".track-progress");
  const journeySection = document.querySelector(".journey-section");
  const yearBadges = document.querySelectorAll(".year-badge");
  const journeyTrack = document.querySelector(".journey-track");

  // Settings
  const SETTINGS = {
    activationZone: window.innerHeight * 0.6,
    blurAmount: 4,
    opacityMin: 0.6,
    opacityMax: 1.0,
    scaleMin: 0.95,
    scaleMax: 1.0,
    transitionDuration: 400,
    pixelSensitivity: 10,
    cardWidth: "60vw",
    progressEasing: 0.1,
    yearGlowIntensity: 0.3,
    parallaxFactor: 0.05,
  };

  // State variables
  let currentActiveStory = null;
  let currentActiveYear = null;
  let lastScrollY = window.pageYOffset;
  let animationFrame = null;
  let currentProgress = 0;
  let targetProgress = 0;

  // Initialize stories with proper z-index management
  const initializeStories = () => {
    journeyStories.forEach((story, index) => {
      const storyContent = story.querySelector(".story-content");
      if (storyContent) {
        storyContent.style.width = SETTINGS.cardWidth;
        storyContent.style.maxWidth = "800px";
        // Set proper z-index hierarchy
        storyContent.style.zIndex = "5";
      }

      // Set initial styles with proper z-index
      story.style.transition = `all ${SETTINGS.transitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      story.style.zIndex = "5";

      // Set story marker z-index
      const storyMarker = story.querySelector(".story-marker");
      if (storyMarker) {
        storyMarker.style.zIndex = "6";
      }
    });
  };

  // Initialize years with proper z-index
  const initializeYears = () => {
    yearBadges.forEach((badge) => {
      badge.style.transition = `all ${SETTINGS.transitionDuration}ms ease`;
      badge.style.zIndex = "10"; // Higher than stories but lower than active states
    });
  };

  // Calculate animation values (unchanged)
  const calculateAnimationValues = (element) => {
    const rect = element.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const elementCenter = rect.top + rect.height / 2;
    const distance = Math.abs(elementCenter - viewportCenter);
    const progress = 1 - Math.min(1, distance / SETTINGS.activationZone);

    // Enhanced smoothstep easing
    const easedProgress =
      progress *
      progress *
      progress *
      (10 - 15 * progress + 6 * progress * progress);

    // Parallax effect
    const parallaxOffset =
      (elementCenter - viewportCenter) * SETTINGS.parallaxFactor;

    return {
      blur: SETTINGS.blurAmount * (1 - easedProgress),
      opacity:
        SETTINGS.opacityMin +
        (SETTINGS.opacityMax - SETTINGS.opacityMin) * easedProgress,
      scale:
        SETTINGS.scaleMin +
        (SETTINGS.scaleMax - SETTINGS.scaleMin) * easedProgress,
      progress: easedProgress,
      parallax: parallaxOffset,
    };
  };

  // Update story state with proper z-index management
  const updateStoryState = (story, values) => {
    const storyContent = story.querySelector(".story-content");

    story.style.filter = `blur(${values.blur}px)`;
    story.style.opacity = values.opacity;
    story.style.transform = `scale(${values.scale}) translateY(${values.parallax}px)`;

    const isActive = values.progress > 0.7;
    story.classList.toggle("active", isActive);

    // Manage z-index for active states
    if (isActive && storyContent) {
      storyContent.style.zIndex = "15"; // Bring active story to front
    } else if (storyContent) {
      storyContent.style.zIndex = "5"; // Reset non-active stories
    }

    return { isActive, progress: values.progress };
  };

  // Update year state with proper z-index
  const updateYearState = (year, values) => {
    const glowSize = values.progress * 20;
    const glowOpacity = values.progress * SETTINGS.yearGlowIntensity;

    year.style.boxShadow = `0 0 ${glowSize}px rgba(var(--accent-rgb), ${glowOpacity})`;
    year.style.transform = `scale(${1 + values.progress * 0.1})`;

    // Manage z-index for active year badges
    const isActive = values.progress > 0.5;
    if (isActive) {
      year.style.zIndex = "20"; // Bring active year to front
    } else {
      year.style.zIndex = "10"; // Reset non-active years
    }

    return values.progress;
  };

  // Find active elements
  const findActiveElements = () => {
    let maxStoryProgress = 0;
    let activeStory = null;
    let maxYearProgress = 0;
    let activeYear = null;

    // Process stories
    journeyStories.forEach((story) => {
      const values = calculateAnimationValues(story);
      const { isActive, progress } = updateStoryState(story, values);

      if (progress > maxStoryProgress) {
        maxStoryProgress = progress;
        activeStory = story;
      }
    });

    // Process year badges
    yearBadges.forEach((year) => {
      const values = calculateAnimationValues(year);
      const progress = updateYearState(year, values);

      if (progress > maxYearProgress) {
        maxYearProgress = progress;
        activeYear = year;
      }
    });

    return { activeStory, activeYear };
  };

  // Update timeline progress (unchanged)
  const updateTimelineProgress = () => {
    if (!trackProgress || !journeySection) return;

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
    trackProgress.style.height = `${currentProgress * 100}%`;
  };

  // Main animation loop
  const animate = () => {
    const { activeStory, activeYear } = findActiveElements();

    // Update active elements with proper highlighting
    if (activeStory !== currentActiveStory) {
      // Remove highlight from previous
      if (currentActiveStory) {
        currentActiveStory.classList.remove("highlight");
        const prevContent = currentActiveStory.querySelector(".story-content");
        if (prevContent) prevContent.style.zIndex = "5";
      }

      // Add highlight to current
      if (activeStory) {
        activeStory.classList.add("highlight");
        const currentContent = activeStory.querySelector(".story-content");
        if (currentContent) currentContent.style.zIndex = "15";
      }

      currentActiveStory = activeStory;
    }

    if (activeYear !== currentActiveYear) {
      // Remove highlight from previous
      if (currentActiveYear) {
        currentActiveYear.classList.remove("highlight");
        currentActiveYear.style.zIndex = "10";
      }

      // Add highlight to current
      if (activeYear) {
        activeYear.classList.add("highlight");
        activeYear.style.zIndex = "20";
      }

      currentActiveYear = activeYear;
    }

    updateTimelineProgress();
    animationFrame = requestAnimationFrame(animate);
  };

  // Handle scroll (unchanged)
  const handleScroll = () => {
    const currentScrollY = window.pageYOffset;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);

    if (scrollDelta >= SETTINGS.pixelSensitivity) {
      lastScrollY = currentScrollY;
    }
  };

  // Initialize timeline with proper z-index setup
  const initTimeline = () => {
    if (!journeySection || journeyStories.length === 0) return;

    // Set timeline track to lowest z-index
    if (journeyTrack) {
      journeyTrack.style.zIndex = "1";
    }

    // Set track progress z-index
    if (trackProgress) {
      trackProgress.style.zIndex = "2";
    }

    initializeStories();
    initializeYears();

    // Start animation loop
    animate();

    // Event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });

    window.addEventListener(
      "resize",
      () => {
        SETTINGS.activationZone = window.innerHeight * 0.6;
      },
      { passive: true }
    );
  };

  // Initialize
  initTimeline();
});
