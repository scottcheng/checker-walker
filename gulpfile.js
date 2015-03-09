var fs = require('fs');
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require("babelify");
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
    .pipe(fs.createWriteStream(paths.dist + 'scripts/index.js'));
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
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy', function() {
  gulp.src([
      paths.app + 'styles/*.css',
      paths.app + 'styles/fonts/*.{eot,svg,ttf,woff}',
    ], { base: paths.app })
    .pipe(gulp.dest(paths.dist));
});

gulp.task('webserver', function() {
  gulp.src(paths.dist)
    .pipe(webserver({
      livereload: true,
      open: true,
    }));
});

gulp.task('serve', ['scripts', 'styles', 'jade', 'copy', 'webserver'], function() {
  gulp.watch(paths.app + 'index.jade', ['jade']);
  gulp.watch(paths.app + 'styles/**/*.styl', ['styles']);
  gulp.watch(paths.app + 'scripts/**/*.js', ['scripts']);
});
