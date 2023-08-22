var gulp = require('gulp');
const fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));

const paths = {
  src: './',
  dist: './dist/',
};

// Static Server
gulp.task('serve', function () {
  browserSync.init({
    server: paths.dist,
  });

  // Watch for build
  gulp.watch(['./**/*.html', '!dist/**/*'], gulp.series('include-html'));
  gulp.watch(['./sass/**/*.scss'], gulp.series('compile-sass'));
  gulp.watch(['./images/**/*'], gulp.series('copy-images'));
  gulp.watch(['./js/**/*'], gulp.series('copy-js'));

  // Watch for reload page
  gulp.watch(paths.dist + '**/*').on('change', browserSync.reload);
});

gulp.task('include-html', function () {
  return gulp
    .src(['*.html'])
    .pipe(fileinclude({ prefix: '@@', basepath: '@file' }))
    .pipe(gulp.dest(paths.dist));
});

// copy to dist
gulp.task('copy-images', function () {
  return gulp.src(['./images/**/*']).pipe(gulp.dest(paths.dist + 'images'));
});
gulp.task('copy-js', function () {
  return gulp.src(['./js/**/*']).pipe(gulp.dest(paths.dist + 'js'));
});
gulp.task('copy-to-dist', gulp.series(gulp.parallel('copy-images', 'copy-js')));

// compile sass into css
gulp.task('compile-sass', function () {
  return gulp
    .src('./sass/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest(paths.dist + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('build', gulp.series('include-html', 'compile-sass', 'copy-to-dist'));
gulp.task('default', gulp.series('include-html', 'compile-sass', 'copy-to-dist', 'serve'));
