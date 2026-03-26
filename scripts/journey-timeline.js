document.addEventListener("DOMContentLoaded", () => {
  const scenes = document.querySelectorAll(".scene");
  if (!scenes.length) return;

  const sceneArray = Array.from(scenes);
  const journeySection = document.querySelector(".journey-section");

  // ---- Dot Nav (built before reduced-motion check so it always renders) ----

  const nav = document.createElement("nav");
  nav.className = "scene-nav";
  nav.setAttribute("role", "navigation");
  nav.setAttribute("aria-label", "Timeline navigation");

  const tooltip = document.createElement("div");
  tooltip.className = "scene-nav-tooltip";
  tooltip.innerHTML =
    '<span class="scene-nav-tooltip-year"></span>' +
    '<span class="scene-nav-tooltip-title"></span>';
  nav.appendChild(tooltip);

  const tooltipYear = tooltip.querySelector(".scene-nav-tooltip-year");
  const tooltipTitle = tooltip.querySelector(".scene-nav-tooltip-title");

  const dots = sceneArray.map((scene, i) => {
    const dot = document.createElement("button");
    dot.className = "scene-nav-dot";

    const year = scene.dataset.year || "";
    const title = scene.querySelector(".scene-title")?.textContent || "";
    const label = year ? "Jump to " + year + ": " + title : "Jump to: " + title;
    dot.setAttribute("aria-label", label);

    dot.addEventListener("click", () => {
      sceneArray[i].scrollIntoView({ behavior: "smooth" });
    });

    dot.addEventListener("mouseenter", () => {
      tooltipYear.textContent = year;
      tooltipYear.style.display = year ? "" : "none";
      tooltipTitle.textContent = title;

      const dotRect = dot.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      let tooltipTop = dotRect.top - navRect.top + dotRect.height / 2;

      // Clamp to keep tooltip within 8px of viewport edges
      const tooltipHeight = 50;
      const minTop = 8 - navRect.top + tooltipHeight / 2;
      const maxTop = window.innerHeight - 8 - navRect.top - tooltipHeight / 2;
      tooltipTop = Math.max(minTop, Math.min(maxTop, tooltipTop));

      tooltip.style.top = tooltipTop + "px";
      tooltip.style.transform = "translateY(-50%)";
      tooltip.classList.add("scene-nav-tooltip--visible");
    });

    dot.addEventListener("mouseleave", () => {
      tooltip.classList.remove("scene-nav-tooltip--visible");
    });

    nav.appendChild(dot);
    return dot;
  });

  if (journeySection) {
    journeySection.appendChild(nav);
  }

  // Dot nav visibility — show only when journey section is in viewport
  if (journeySection) {
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle("scene-nav--visible", entry.isIntersecting);
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(journeySection);
  }

  // Sync active dot with active scene
  const updateActiveDot = (activeIndex) => {
    dots.forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.classList.toggle("scene-nav-dot--active", isActive);
      if (isActive) {
        dot.setAttribute("aria-current", "step");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  };

  // ---- Reduced motion: show all scenes, skip animation observer ----

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    scenes.forEach((scene) => scene.classList.add("scene-active"));
    updateActiveDot(0);
    return;
  }

  // ---- Animation system (skipped for reduced motion) ----

  const willChangeTimers = new WeakMap();

  const addWillChange = (scene) => {
    if (scene.style.willChange !== "transform, opacity") {
      scene.style.willChange = "transform, opacity";
    }
    const timer = willChangeTimers.get(scene);
    if (timer) {
      clearTimeout(timer);
      willChangeTimers.delete(scene);
    }
  };

  const removeWillChange = (scene, delay) => {
    const timer = setTimeout(() => {
      scene.style.willChange = "auto";
      willChangeTimers.delete(scene);
    }, delay);
    willChangeTimers.set(scene, timer);
  };

  const activateMedia = (scene) => {
    const video = scene.querySelector("video");
    if (video) {
      video.play().catch(() => {});
    }
  };

  const deactivateMedia = (scene) => {
    const video = scene.querySelector("video");
    if (video) video.pause();
    const audio = scene.querySelector("audio");
    if (audio) audio.pause();
  };

  const getExpectedYear = (scene) => {
    const idx = sceneArray.indexOf(scene);
    if (idx <= 0) return null;
    return sceneArray[idx - 1].dataset.year || null;
  };

  const setActive = (scene) => {
    if (scene.classList.contains("scene-active")) return;

    scene.classList.remove("scene-partial");
    scene.classList.add("scene-active");
    addWillChange(scene);

    const year = scene.dataset.year;
    const prevYear = getExpectedYear(scene);
    if (year && year !== prevYear) {
      scene.classList.add("scene-year-changed");
    } else {
      scene.classList.remove("scene-year-changed");
    }

    activateMedia(scene);
    removeWillChange(scene, 2100);
    updateActiveDot(sceneArray.indexOf(scene));
  };

  const setPartial = (scene) => {
    const wasActive = scene.classList.contains("scene-active");
    scene.classList.remove("scene-active", "scene-year-changed");
    scene.classList.add("scene-partial");
    addWillChange(scene);

    if (wasActive) {
      deactivateMedia(scene);
    }
    removeWillChange(scene, 300);
  };

  const setInactive = (scene) => {
    const wasVisible =
      scene.classList.contains("scene-active") ||
      scene.classList.contains("scene-partial");
    scene.classList.remove("scene-active", "scene-partial", "scene-year-changed");

    if (wasVisible) {
      deactivateMedia(scene);
      removeWillChange(scene, 300);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const ratio = entry.intersectionRatio;
        const scene = entry.target;

        if (ratio >= 0.3) {
          setActive(scene);
        } else if (ratio >= 0.15) {
          setPartial(scene);
        } else {
          setInactive(scene);
        }
      });
    },
    { threshold: [0, 0.15, 0.3] }
  );

  scenes.forEach((scene) => observer.observe(scene));

  // Keyboard navigation — only when timeline is in viewport
  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    if (!journeySection) return;

    const rect = journeySection.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

    const activeScene = document.querySelector(".scene-active");
    if (!activeScene) return;

    const currentIndex = sceneArray.indexOf(activeScene);
    const targetIndex = e.key === "ArrowDown"
      ? Math.min(currentIndex + 1, sceneArray.length - 1)
      : Math.max(currentIndex - 1, 0);

    if (targetIndex !== currentIndex) {
      e.preventDefault();
      sceneArray[targetIndex].scrollIntoView({ behavior: "smooth" });
    }
  });
});
