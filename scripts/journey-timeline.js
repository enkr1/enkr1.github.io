document.addEventListener("DOMContentLoaded", () => {
  const timelineEntries = document.querySelectorAll(".timeline-entry");
  const timelineProgress = document.querySelector(".timeline-progress");
  const journeySection = document.querySelector(".journey-section");
  const timelineLine = document.querySelector(".timeline-line");

  // ADJUSTABLE SETTINGS - Customize these values
  const SETTINGS = {
    fullscreenPadding: 10, // Percentage padding when expanded (adjustable: 5-25)
    transitionDuration: 800, // Animation duration in ms (adjustable: 400-1200)
    activationThreshold: 0.6, // How much of viewport entry needs to fill (adjustable: 0.4-0.8)
    easing: "cubic-bezier(0.25, 0.1, 0.25, 1)", // CSS easing function
    blurAmount: 8, // Background blur when entry is expanded (adjustable: 4-15)
    scaleDownRatio: 0.85, // How much to scale down non-active entries (adjustable: 0.7-0.9)
  };

  let currentActiveIndex = -1;
  let isAnimating = false;
  let entries = [];

  // Initialize entry data
  const initializeEntries = () => {
    timelineEntries.forEach((entry, index) => {
      const rect = entry.getBoundingClientRect();
      const content = entry.querySelector(".entry-content");

      entries[index] = {
        element: entry,
        content: content,
        originalRect: {
          top: entry.offsetTop,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        isExpanded: false,
        targetState: "normal", // 'normal', 'expanding', 'expanded', 'shrinking'
      };

      // Set initial styles
      entry.style.transition = `all ${SETTINGS.transitionDuration}ms ${SETTINGS.easing}`;
      entry.style.transformOrigin = "center center";
      entry.style.position = "relative";
      entry.style.zIndex = "10";

      if (content) {
        content.style.transition = `all ${SETTINGS.transitionDuration}ms ${SETTINGS.easing}`;
      }
    });
  };

  // Create overlay for expanded entries
  const createOverlay = () => {
    if (document.querySelector(".timeline-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "timeline-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(${SETTINGS.blurAmount}px);
      z-index: 999;
      opacity: 0;
      pointer-events: none;
      transition: all ${SETTINGS.transitionDuration}ms ${SETTINGS.easing};
    `;
    document.body.appendChild(overlay);
  };

  // Expand entry to fullscreen
  const expandEntry = (index) => {
    if (isAnimating || entries[index].isExpanded) return;

    isAnimating = true;
    const entry = entries[index];
    const overlay = document.querySelector(".timeline-overlay");

    // Update states
    entry.targetState = "expanding";
    entry.isExpanded = true;

    // Show overlay
    if (overlay) {
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
    }

    // Calculate fullscreen dimensions with padding
    const paddingVw = SETTINGS.fullscreenPadding;
    const paddingVh = SETTINGS.fullscreenPadding;

    // Set expanded styles
    entry.element.style.position = "fixed";
    entry.element.style.top = `${paddingVh}vh`;
    entry.element.style.left = `${paddingVw}vw`;
    entry.element.style.width = `${100 - paddingVw * 2}vw`;
    entry.element.style.height = `${100 - paddingVh * 2}vh`;
    entry.element.style.zIndex = "1000";
    entry.element.style.transform = "scale(1)";

    // Style the content for fullscreen view
    if (entry.content) {
      entry.content.style.width = "100%";
      entry.content.style.height = "100%";
      entry.content.style.padding = "3rem";
      entry.content.style.overflow = "auto";
      entry.content.style.display = "flex";
      entry.content.style.flexDirection = "column";
      entry.content.style.justifyContent = "flex-start";

      // Enhance text for fullscreen reading
      const title = entry.content.querySelector(".entry-title");
      const description = entry.content.querySelector(".entry-description");
      const image = entry.content.querySelector(".entry-image");

      if (title) {
        title.style.fontSize = "2.5rem";
        title.style.marginBottom = "2rem";
        title.style.textAlign = "center";
      }

      if (description) {
        description.style.fontSize = "1.2rem";
        description.style.lineHeight = "1.8";
        description.style.marginBottom = "2rem";
        description.style.textAlign = "justify";
      }

      if (image) {
        image.style.maxWidth = "60%";
        image.style.margin = "2rem auto";
        image.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
      }
    }

    // Scale down other entries
    entries.forEach((otherEntry, otherIndex) => {
      if (otherIndex !== index && !otherEntry.isExpanded) {
        otherEntry.element.style.transform = `scale(${SETTINGS.scaleDownRatio})`;
        otherEntry.element.style.opacity = "0.4";
        otherEntry.element.style.filter = `blur(3px)`;
      }
    });

    setTimeout(() => {
      entry.targetState = "expanded";
      isAnimating = false;
    }, SETTINGS.transitionDuration);
  };

  // Shrink entry back to normal
  const shrinkEntry = (index) => {
    if (isAnimating || !entries[index].isExpanded) return;

    isAnimating = true;
    const entry = entries[index];
    const overlay = document.querySelector(".timeline-overlay");

    // Update states
    entry.targetState = "shrinking";
    entry.isExpanded = false;

    // Hide overlay
    if (overlay) {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
    }

    // Reset to original position and size
    entry.element.style.position = "relative";
    entry.element.style.top = "auto";
    entry.element.style.left = "auto";
    entry.element.style.width = "auto";
    entry.element.style.height = "auto";
    entry.element.style.zIndex = "10";
    entry.element.style.transform = "scale(1)";

    // Reset content styles
    if (entry.content) {
      entry.content.style.width = "";
      entry.content.style.height = "";
      entry.content.style.padding = "2rem";
      entry.content.style.overflow = "";
      entry.content.style.display = "";
      entry.content.style.flexDirection = "";
      entry.content.style.justifyContent = "";

      // Reset text styles
      const title = entry.content.querySelector(".entry-title");
      const description = entry.content.querySelector(".entry-description");
      const image = entry.content.querySelector(".entry-image");

      if (title) {
        title.style.fontSize = "";
        title.style.marginBottom = "";
        title.style.textAlign = "";
      }

      if (description) {
        description.style.fontSize = "";
        description.style.lineHeight = "";
        description.style.marginBottom = "";
        description.style.textAlign = "";
      }

      if (image) {
        image.style.maxWidth = "";
        image.style.margin = "";
        image.style.boxShadow = "";
      }
    }

    // Reset other entries
    entries.forEach((otherEntry, otherIndex) => {
      if (otherIndex !== index) {
        otherEntry.element.style.transform = "scale(1)";
        otherEntry.element.style.opacity = "1";
        otherEntry.element.style.filter = "none";
      }
    });

    setTimeout(() => {
      entry.targetState = "normal";
      isAnimating = false;
    }, SETTINGS.transitionDuration);
  };

  // Calculate which entry should be active based on scroll
  const calculateActiveEntry = () => {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * SETTINGS.activationThreshold;

    let newActiveIndex = -1;
    let closestDistance = Infinity;

    entries.forEach((entry, index) => {
      const rect = entry.element.getBoundingClientRect();
      const entryCenter = rect.top + rect.height / 2;
      const distanceFromTrigger = Math.abs(entryCenter - triggerPoint);

      // Check if entry is in the activation zone
      if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
        if (distanceFromTrigger < closestDistance) {
          closestDistance = distanceFromTrigger;
          newActiveIndex = index;
        }
      }
    });

    return newActiveIndex;
  };

  // Main scroll handler
  const handleScroll = () => {
    if (isAnimating) return;

    const newActiveIndex = calculateActiveEntry();

    if (newActiveIndex !== currentActiveIndex) {
      // Shrink previously active entry
      if (currentActiveIndex >= 0 && entries[currentActiveIndex].isExpanded) {
        shrinkEntry(currentActiveIndex);
      }

      // Expand new active entry
      if (newActiveIndex >= 0) {
        setTimeout(
          () => {
            expandEntry(newActiveIndex);
          },
          currentActiveIndex >= 0 ? SETTINGS.transitionDuration / 2 : 0
        );
      }

      currentActiveIndex = newActiveIndex;
    }

    // Update timeline progress
    updateTimelineProgress();
  };

  // Update timeline progress line
  const updateTimelineProgress = () => {
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

    // Update scroll dot
    const scrollDot = document.querySelector(".timeline-scroll-dot");
    if (scrollDot) {
      scrollDot.style.top = `${scrollProgress * 100}%`;
    }
  };

  // Create scroll dot
  const createScrollDot = () => {
    if (!timelineLine || document.querySelector(".timeline-scroll-dot")) return;

    const dot = document.createElement("div");
    dot.className = "timeline-scroll-dot";
    timelineLine.appendChild(dot);
  };

  // Add keyboard navigation
  const addKeyboardNavigation = () => {
    document.addEventListener("keydown", (e) => {
      if (currentActiveIndex < 0) return;

      if (e.key === "Escape" && entries[currentActiveIndex].isExpanded) {
        shrinkEntry(currentActiveIndex);
        currentActiveIndex = -1;
      }
    });
  };

  // Initialize everything
  const init = () => {
    if (!journeySection || timelineEntries.length === 0) return;

    initializeEntries();
    createOverlay();
    createScrollDot();
    addKeyboardNavigation();

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    // Handle resize
    window.addEventListener(
      "resize",
      () => {
        setTimeout(() => {
          initializeEntries();
          handleScroll();
        }, 100);
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
  console.log("Customize with: window.TimelineSettings.fullscreenPadding = 15");
});
