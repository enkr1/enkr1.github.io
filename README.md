# My Personal Website & Portfolio

This repository hosts my personal website and portfolio. The site is built with minimal external libraries and modern JavaScript techniques. It showcases work, projects, and passions spanning full-stack development, UI/UX, and beatboxing.

## Connect with Me
- **GitHub**: [@enkr1](https://github.com/enkr1)
- **Instagram**: [@enkr1](https://www.instagram.com/enkr1)

**Pang Jing Hui (ENKR) | 彭竞辉**

---

## Project Overview

- **Build & Tooling**: Gulp orchestrates SCSS compilation, JavaScript bundling (via Webpack + Babel), and asset watching. Node dependencies include Sass, PostCSS, and other build utilities.
- **Styling**: SCSS uses a modular structure with `@use` to pull in variables, mixins, core utilities, components, and section styles from `scss/main.scss`.
- **JavaScript Modules**: The entry `scripts/main.js` registers custom elements, manages navigation, cursor effects, and various scroll-triggered interactions. Some referenced modules (e.g., `enums_original.js`, `sections_original.js`, `utils_original.js`) are absent and require reconciliation.
- **Data-Driven Content**: JSON files under `data/` provide profile, platform, skill, and experience details that populate corresponding sections.

---

## Existing Features

- **Preloader & Loading Bar** – shows progress as images and API data are fetched.
- **Enhanced Navigation Bar** – header transforms and hides when scrolling past a threshold.
- **Custom Cursor** – dynamic cursor with link-hover and click effects plus an enable/disable toggle.
- **Scroll Effects Suite** – fade‑in reveals, parallax backgrounds, glitch animations, floating elements, typing effect, and a scroll progress bar.
- **Side Navigation Drawer** – animated slide‑in menu with overlay, dropdown support, and active‑section highlighting.
- **Journey Timeline** – scroll-driven timeline with blur/opacity/scale transitions and a progress indicator.
- **Data-Driven Components** – profile, platform, skill, and experience sections populated from JSON files.
- **Gulp & Webpack Build** – SCSS compilation, Babel transpilation, bundling, and autoprefixing.

---

## Setup

Run the following commands to install dependencies and start the development watcher:

```bash
npm install
gulp watch
```

If you need to install the Gulp CLI globally:

```bash
npm install -g gulp-cli
```

Make sure your local `sass` version is `1.79`.

---

## Key Files

- **gulpfile.js** – configuration for SCSS compilation and JS bundling
- **SCSS Source Folder** – `./scss/`
- **CSS Output Folder** – `./css/`

---

## Common Commands

- **Clear npm cache**
  ```bash
  npm cache clean --force
  ```
- **Obfuscate bundled JS**
  ```bash
  node scripts/o.js
  ```

---

## Potential Features & Improvements

- **Resolve missing module imports** – rename or create modules (`enums_original.js`, `sections_original.js`, `utils_original.js`) or update imports, then rebuild via Gulp/Webpack to ensure bundling succeeds.
- **Theme toggle** – add dark/light mode with a toggle button, storing preference in `localStorage` and defining CSS variable overrides.
- **Progressive Web App support** – implement a service worker and `manifest.json` to enable offline caching.
- **Lazy-load images** – use `loading="lazy"` and an IntersectionObserver to defer loading images until they enter the viewport.
- **Filterable portfolio section** – extend portfolio components with category tags and filtering UI, persisting the last selection.
- **Interactive contact form** – build a form with validation, spam prevention, and serverless submission.

---

## Future Development

This project is constantly evolving as I continue experimenting with modern, minimal JavaScript to create an engaging and interactive user experience.

### TODO
- [ ] Rework the design
- [ ] Lazy-load images and any non-essential assets to improve performance
- [ ] Defer and optimize JavaScript execution where possible
- [ ] Replace jQuery with vanilla JavaScript
- [ ] Consider replacing Swiper and AOS with custom solutions
- [ ] Add dynamic animations or interactivity to the landing section
- [ ] Incorporate progressive web app (PWA) features (optional)
- [ ] Rework eye-candy-component and preloader with pure CSS or JavaScript
- [ ] Refine SEO based on latest best practices

