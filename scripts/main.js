import * as enums from './enums_original.js';
import {
  BasicMeta,
  Construction,
  EyeCandyAnimation,
  PlatformsComponent,
  PortfolioItemsComponent,
  Preloader,
  SectionExperience,
  SectionFooter,
  SectionPrimaryAbout,
  SectionSpecialisation
} from './sections_original.js';
import { docReady, helloWorld, isInViewport, readFile } from './utils_original.js';
import { setupEnhancedNavigation } from "./nav_enhancement.js";

// Register custom elements
customElements.define('basic-meta-component', BasicMeta);
customElements.define('primary-about-component', SectionPrimaryAbout);
customElements.define('specialisation-component', SectionSpecialisation);
customElements.define('experience-component', SectionExperience);
customElements.define('preloader-component', Preloader);
customElements.define('construction-component', Construction);
customElements.define('footer-component', SectionFooter);
customElements.define('eye-candy-component', EyeCandyAnimation);
customElements.define('portfolio-items-component', PortfolioItemsComponent);
customElements.define('platforms-component', PlatformsComponent);

// Main document ready function
docReady(() => {
  // Initialize preloader
  const preloader = document.querySelector('.preloader');
  setTimeout(() => {
    preloader.classList.add('loaded');
    document.querySelector('.preloader-container').classList.add('loaded');
  }, 1500);

  // Initialize navigation
  setupEnhancedNavigation();

  // Initialize scroll events
  window.addEventListener('scroll', handleScrollEvents);

  // Initialize other components
  initializeComponents();
});
