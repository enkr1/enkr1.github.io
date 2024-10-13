## My Personal Website & Portfolio

This is my personal website and portfolio, designed and developed entirely by me, with a focus on minimal libraries and modern JavaScript techniques. Explore my work, projects, and passions, including full-stack development, UI/UX, and beatboxing.

### Connect with Me:
- **GitHub**: [@enkr1](https://github.com/enkr1)
- **Instagram**: [@enkr1](https://www.instagram.com/enkr1)

**Pang Jing Hui (ENKR) | 彭竞辉**

---

### Setup Guide:

### Step 1: Install Node.js and Gulp CLI

#### 1. Install Node.js:
- If you don’t have Node.js installed, download and install it from [Node.js official site](https://nodejs.org/).
- Verify Node.js is installed by running:
   ```bash
   node -v
   ```

#### 2. Initialize the Project:
- If this is a fresh setup, initialise the project:
   ```bash
   npm init -y
   ```

#### 3. Install Gulp CLI Globally:
   ```bash
   npm install -g gulp-cli
   ```
   Verify Gulp CLI installation:
   ```bash
   gulp -v
   ```

#### 4. Install Gulp Locally (and other dependencies):
   ```bash
   npm install gulp gulp-sass gulp-postcss autoprefixer --save-dev
   ```

---

### Step 2: Start Gulp Watcher

Start the Gulp watcher to compile SCSS and add vendor prefixes automatically:

```bash
gulp watch
```

---

### Key Files:

- **gulpfile.js**: The configuration file for Gulp, handling SCSS compilation and autoprefixing.
  - Path: `./gulpfile.js`

- **SCSS Source Folder**: Where the source SCSS files are located.
  - Path: `./scss/`

- **CSS Output Folder**: Where the compiled CSS files will be output.
  - Path: `./css/`

---

### Common Commands

**Clear npm cache** (Useful for cleanup and troubleshooting):
```bash
npm cache clean --force
```

**Install Dependencies** (if starting on a new machine or after cleanup):
```bash
npm install
```

**Start Gulp Watcher**:
```bash
gulp watch
gulp watch &
```

kill port
```sh
ps aux | grep gulp
```

```sh
kill -9 <PID>
```

---

### Future Development

- This project is constantly evolving as I continue experimenting with modern, minimal JavaScript to create an engaging and interactive user experience.


### TODO
- [ ] Rework the design!
- [ ] Lazy-load images and any non-essential assets to improve performance.
- [ ] Defer and optimize the execution of JavaScript where possible, as you're already doing with the defer attribute.
- [ ] Replace jQuery with vanilla JavaScript. This will reduce dependency and streamline performance.
- [ ] Consider whether Swiper and AOS are necessary. If not, we could build custom solutions for carousels and scroll animations with vanilla JS and CSS.
- [ ] Add dynamic animations or interactivity to elements like the landing section using CSS animations or JavaScript, ensuring responsiveness.
- [ ] Incorporate progressive web app (PWA) features like offline mode, caching, and push notifications (optional).
- [ ] Rework the eye-candy-component and the preloader using pure CSS or JavaScript to make the experience smoother and lighter.
- [ ] Could refine these based on the latest SEO best practices to ensure maximum visibility.
