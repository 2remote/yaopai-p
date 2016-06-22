'use strict';

var gulp = require('gulp');
/* util */
var gutil = require('gulp-util');
var path = require('path');
var del = require('del');
var assign = require('lodash.assign');
var exit = require('gulp-exit');
var runSequence   = require('run-sequence');
/* browserify */
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
/* browserSync */
var browserSync = require('browser-sync');
var reload = browserSync.reload;

/* **************************************************************** */
// 参考：
// http://gulpjs.org/recipes/fast-browserify-builds-with-watchify.html
// https://github.com/babel/babelify#options
// http://gulpjs.org/recipes/server-with-livereload-and-css-injection.html
/* **************************************************************** */

/* environment variables */
var auto = process.env.YAOPAI_DISABLE_AUTO;
var production = process.env.NODE_ENV === 'production';
/* CONSTANTS */
var SRC_DIR = 'app';
var DIST_DIR = './dist';
var ENTRY_JS = path.resolve(SRC_DIR, 'scripts', 'app.js');

// add custom browserify options here
var customOpts = {
  entries: [ENTRY_JS],
  // debug为true的时候babelify会报错，草，据说是sourcemap的事？
  // https://github.com/babel/babelify#why-am-i-not-getting-source-maps
  debug: false
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);
b.transform(babelify, {presets: ["es2015", "react"]});

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'))
    .pipe(production ? exit() : gutil.noop());
}

gulp.task('copy-image', function() {
  return gulp.src(path.resolve(SRC_DIR, 'img', '*'))
    .pipe(gulp.dest(path.resolve(DIST_DIR, 'img')));
});

gulp.task('copy-vendor',function(){
  return gulp.src(path.resolve(SRC_DIR, 'vendor', '*'))
    .pipe(gulp.dest(path.resolve(DIST_DIR, 'vendor')));
});

gulp.task('copy-font', function() {
  return gulp.src(path.resolve(SRC_DIR, 'fonts', '*'))
    .pipe(gulp.dest(path.resolve(DIST_DIR, 'fonts')));
});

gulp.task('copy-misc', function() {
  return gulp.src([path.resolve(SRC_DIR, '*.txt'), path.resolve(SRC_DIR, '*.ico')])
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('copy-css', function() {
  return gulp.src(path.resolve(SRC_DIR, 'styles', '*'))
    .pipe(gulp.dest(path.resolve(DIST_DIR, 'styles')));
});

gulp.task('copy-html', function() {
  return gulp.src(path.resolve(SRC_DIR, 'index.html'))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('copy', ['copy-vendor', 'copy-font', 'copy-css', 'copy-image', 'copy-misc', 'copy-html']);

gulp.task('clean', function() {
  return del(DIST_DIR); // return the promise so that runSequnce won't break
});

gulp.task('serve', function() {
  browserSync({
    port: 8000,
    open: !auto, // env YAOPAI_DISABLE_AUTO sets this, default true
    server: {
      baseDir: DIST_DIR
    },
    ui: {
      port: 8001
    }
  });
  // could watch css as well
  gulp.watch([path.resolve(DIST_DIR, 'bundle.js')], reload);
});

gulp.task('dev', function() {
  production = false;
  return runSequence('clean', ['js', 'copy'], 'serve');
});

gulp.task('build', function() {
  production = true;
  return runSequence('clean', ['js', 'copy']);
});
