const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const { exec } = require('child_process');



gulp.task('styles', () => {
  return gulp.src('scss/**/*.scss') // Source SCSS
    .pipe(sass().on('error', sass.logError)) // Compile SCSS
    // .pipe(postcss([autoprefixer()])) // Add vendor prefixes
    .pipe(postcss([postcssPresetEnv({ overrideBrowserslist: ['> 0.5%', 'last 2 versions', 'IE 10'] })]))
    .pipe(gulp.dest('./css')); // Destination for compiled CSS
});



gulp.task('obfuscate', function (cb) {
  exec('node ./scripts/o.js', function (err, stdout, stderr) {
    if (err) {
      console.log(stderr);
    } else {
      console.log(stdout);
    }
    cb();
  });
});



gulp.task('watch', () => {
  gulp.watch('scss/**/*.scss', gulp.series('styles')); // Watch for changes
  gulp.watch('scripts/main_original.js', gulp.series('obfuscate')); // Watch for changes in main_original.js
});
