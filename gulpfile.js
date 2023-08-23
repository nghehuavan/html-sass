require('dotenv').config();
var gulp = require('gulp');
var htmlMinify = require('gulp-htmlmin');
const jsMinify = require('gulp-uglify');
var url = require('url');
var proxy = require('proxy-middleware');
var nodemon = require('gulp-nodemon');

const fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));

const paths = {
  src: './',
  dist: './dist/',
};
// Static Server
gulp.task('fontend', async function () {
  var frontendPort = process.env.FRONTEND_PORT || 3000;
  var backendPort = process.env.BACKEND_PORT || 8000;
  var backendPath = process.env.BACKEND_PATH || '/api';
  var proxyOptions = url.parse(`http://localhost:${backendPort}/api`);
  proxyOptions.route = backendPath;
  browserSync.init({
    server: paths.dist,
    port: frontendPort,
    middleware: [proxy(proxyOptions)],
  });

  const ansiYellowColor = '\x1b[33m%s\x1b[0m';
  console.log(ansiYellowColor, `[Browsersync] proxy from http://localhost:${frontendPort}${backendPath} => http://localhost:${backendPort}${backendPath}`);

  // Watch for build
  gulp.watch(['./**/*.html', '!' + paths.dist + '**/*'], gulp.series('include-html'));
  gulp.watch(['./sass/**/*.scss'], gulp.series('compile-sass'));
  gulp.watch(['./images/**/*'], gulp.series('copy-images'));
  gulp.watch(['./js/**/*'], gulp.series('copy-js'));
  // Watch for reload page
  gulp.watch(paths.dist + '**/*').on('change', browserSync.reload);
});

gulp.task('backend', async function () {
  return nodemon({
    script: 'server.js',
  });
});

// compile sass into css
gulp.task('compile-sass', function () {
  return gulp
    .src('./sass/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest(paths.dist + 'css'))
    .pipe(browserSync.stream());
});

// include-html
gulp.task('include-html', function () {
  return gulp
    .src(['*.html'])
    .pipe(fileinclude({ prefix: '@@', basepath: '@file' }))
    .pipe(gulp.dest(paths.dist));
});
gulp.task('include-html-min', function () {
  return gulp
    .src(['*.html'])
    .pipe(fileinclude({ prefix: '@@', basepath: '@file' }))
    .pipe(
      htmlMinify({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(gulp.dest(paths.dist));
});

// copy to images and js
gulp.task('copy-images', function () {
  return gulp.src(['./images/**/*']).pipe(gulp.dest(paths.dist + 'images'));
});
gulp.task('copy-js', function () {
  return gulp.src(['./js/**/*']).pipe(gulp.dest(paths.dist + 'js'));
});
gulp.task('copy-js-min', function () {
  return gulp
    .src(['./js/**/*'])
    .pipe(jsMinify())
    .pipe(gulp.dest(paths.dist + 'js'));
});

gulp.task('default', gulp.parallel('backend', gulp.series('include-html', 'compile-sass', 'copy-images', 'copy-js', 'fontend')));
gulp.task('build', gulp.series('include-html-min', 'compile-sass', 'copy-images', 'copy-js-min'));
