const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const { exec } = require('child_process');

// Webpack configuration
const webpackConfig = require('./webpack.config.js');

// Task for compiling SCSS
gulp.task('styles', () => {
  return gulp.src('scss/**/*.scss') // Source SCSS
    .pipe(sass().on('error', sass.logError)) // Compile SCSS
    .pipe(postcss([autoprefixer()])) // Add vendor prefixes
    .pipe(postcss([postcssPresetEnv({ overrideBrowserslist: ['> 0.5%', 'last 2 versions', 'IE 10'] })]))
    .pipe(gulp.dest('./css')); // Destination for compiled CSS
});

// Task for bundling JavaScript using Webpack
gulp.task('bundle', () => {
  return gulp.src('scripts/main_original.js') // Entry file for Webpack
    .pipe(webpackStream(webpackConfig, webpack)) // Use Webpack to bundle
    .pipe(gulp.dest('./dist')); // Output the bundled file
});

// Task for obfuscating the bundled JavaScript
gulp.task('obfuscate', (cb) => {
  exec('npx javascript-obfuscator ./dist/bundle.js --output ./dist/bundle.obfuscated.js', function (err, stdout, stderr) {
    if (err) {
      console.log(stderr);
    } else {
      console.log(stdout);
    }
    cb();
  });
});

// Watch task: Watches for changes and triggers the appropriate tasks
gulp.task('watch', () => {
  gulp.watch('scss/**/*.scss', gulp.series('styles')); // Watch for changes in SCSS files
  gulp.watch('scripts/**/*.js', gulp.series('bundle', 'obfuscate')); // Watch for changes in JavaScript files, bundle and obfuscate
});

// Default task to run when you use `gulp`
gulp.task('default', gulp.series('styles', 'bundle', 'obfuscate', 'watch'));
