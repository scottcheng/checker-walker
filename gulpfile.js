var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var nib = require('nib');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var webserver = require('gulp-webserver');
var plumber = require('gulp-plumber');

var paths = {
  app: './src/',
  dist: './dist/',
};

gulp.task('scripts', function() {
  return browserify({ debug: true })
    .transform(babelify.configure({ experimental: true }))
    .require(paths.app + 'scripts/index.js', { entry: true })
    .bundle()
    .on('error', function(err) {
      console.log('Browserify error:', err.message);
      this.emit('end');
    })
    .pipe(source('index.js'))
    .pipe(gulp.dest(paths.dist + 'scripts'));
});

gulp.task('styles', function() {
  gulp.src(paths.app + 'styles/index.styl')
    .pipe(plumber())
    .pipe(stylus({ use: nib() }))
    .pipe(gulp.dest(paths.dist + 'styles'));
});

gulp.task('jade', function() {
  gulp.src(paths.app + 'index.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy', function() {
  gulp.src([
      paths.app + 'styles/*.css',
      paths.app + 'styles/fonts/*.{eot,svg,ttf,woff}',
      paths.app + 'sounds/**/*.{mp3,wav}',
    ], { base: paths.app })
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function() {
  gulp.watch(paths.app + 'index.jade', ['jade']);
  gulp.watch(paths.app + 'styles/**/*.styl', ['styles']);
  gulp.watch(paths.app + 'scripts/**/*.js', ['scripts']);
});

gulp.task('build', ['scripts', 'styles', 'jade', 'copy']);

gulp.task('serve', ['scripts', 'styles', 'jade', 'copy', 'watch'], function() {
  gulp.src(paths.dist)
    .pipe(webserver({
      livereload: true,
      open: true,
    }));
});

gulp.task('default', ['build']);
