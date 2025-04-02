document.addEventListener('DOMContentLoaded', () => {
  const timelineEntries = document.querySelectorAll('.timeline-entry');
  const timelineProgress = document.querySelector('.timeline-progress');
  const journeySection = document.querySelector('.journey-section');
  const sectionTitle = document.querySelector('.journey-section .section-title');

  // Set data-text attribute for the title effect
  if (sectionTitle) {
    sectionTitle.setAttribute('data-text', sectionTitle.textContent);
  }

  // Create audio elements for each timeline entry
  timelineEntries.forEach((entry, index) => {
    // Create unique audio for each entry
    const audio = document.createElement('audio');
    audio.id = `timeline-audio-${index}`;
    audio.loop = true;
    audio.volume = 0.2;

    // Different audio for different periods
    const year = entry.getAttribute('data-year');
    if (parseInt(year) < 2010) {
      audio.src = `assets/audio/timeline-early.mp3`;
    } else if (parseInt(year) < 2020) {
      audio.src = `assets/audio/timeline-middle.mp3`;
    } else {
      audio.src = `assets/audio/timeline-recent.mp3`;
    }

    document.body.appendChild(audio);

    // Add audio toggle button
    const audioToggle = document.createElement('div');
    audioToggle.className = 'audio-toggle';
    audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    audioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const audioEl = document.getElementById(`timeline-audio-${index}`);
      if (audioEl.paused) {
        // Stop all other audio first
        document.querySelectorAll('audio[id^="timeline-audio-"]').forEach(a => {
          if (a.id !== `timeline-audio-${index}`) {
            a.pause();
            const otherToggle = document.querySelector(`.timeline-entry:nth-child(${parseInt(a.id.split('-')[2]) + 1}) .audio-toggle i`);
            if (otherToggle) otherToggle.className = 'fas fa-volume-mute';
          }
        });

        audioEl.play();
        audioToggle.querySelector('i').className = 'fas fa-volume-up';
      } else {
        audioEl.pause();
        audioToggle.querySelector('i').className = 'fas fa-volume-mute';
      }
    });

    entry.querySelector('.entry-content').appendChild(audioToggle);

    // Add custom SVG illustrations based on the entry content
    const illustration = document.createElement('div');
    illustration.className = 'entry-illustration';

    // Different SVG for different types of events
    const title = entry.querySelector('.entry-title').textContent.toLowerCase();
    let svgContent = '';

    if (title.includes('university') || title.includes('education') || title.includes('school')) {
      svgContent = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10L10 30L50 50L90 30L50 10Z" fill="var(--accent)" />
        <path d="M30 40V70L50 80L70 70V40" fill="none" stroke="var(--accent)" stroke-width="2" />
        <rect x="40" y="60" width="20" height="30" fill="var(--accent)" />
      </svg>`;
    } else if (title.includes('job') || title.includes('work') || title.includes('career') || title.includes('internship')) {
      svgContent = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="30" width="60" height="40" rx="5" fill="var(--accent)" />
        <rect x="40" y="20" width="20" height="10" fill="var(--accent)" />
        <circle cx="50" cy="50" r="10" fill="white" />
        <path d="M45 50L50 55L55 45" stroke="var(--accent)" stroke-width="2" fill="none" />
      </svg>`;
    } else if (title.includes('award') || title.includes('achievement') || title.includes('recognition')) {
      svgContent = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="40" r="25" fill="var(--accent)" />
        <polygon points="50,70 40,90 30,70 20,90 40,65 60,65 80,90 70,70 60,90" fill="var(--accent)" />
        <circle cx="50" cy="40" r="15" fill="white" />
        <text x="50" y="45" text-anchor="middle" font-size="20" fill="var(--accent)">1</text>
      </svg>`;
    } else {
      svgContent = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="var(--accent)" />
        <circle cx="50" cy="50" r="30" fill="white" />
        <circle cx="50" cy="50" r="20" fill="var(--accent)" />
        <circle cx="50" cy="50" r="10" fill="white" />
      </svg>`;
    }

    illustration.innerHTML = svgContent;
    entry.appendChild(illustration);
  });

  // 3D parallax effect on mouse move
  if (window.innerWidth > 992) {
    journeySection.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = journeySection.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      gsap.to('.timeline-container', {
        rotationY: x * 5,
        rotationX: -y * 5,
        transformPerspective: 1000,
        ease: 'power1.out',
        duration: 0.4
      });

      // Move illustrations based on mouse position
      document.querySelectorAll('.entry-illustration').forEach(illus => {
        gsap.to(illus, {
          x: x * 30,
          y: y * 30,
          ease: 'power1.out',
          duration: 0.4
        });
      });
    });

    journeySection.addEventListener('mouseleave', () => {
      gsap.to('.timeline-container', {
        rotationY: 0,
        rotationX: 0,
        ease: 'power1.out',
        duration: 0.6
      });

      document.querySelectorAll('.entry-illustration').forEach(illus => {
        gsap.to(illus, {
          x: 0,
          y: 0,
          ease: 'power1.out',
          duration: 0.6
        });
      });
    });
  }

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
});
