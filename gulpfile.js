'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var watchify = require('watchify');
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var ghpages = require('gulp-gh-pages');
var cachebust = require('gulp-cache-bust');

var paths = {
    pages: ['src/*.html'],
    styles: ['src/styles.css'],
    vendor: ['src/vendor/**'],
    assets: ['src/assets/**'],
};

const DEV_BUILD_PATH = '.tmp';
const PROD_BUILD_PATH = 'dist';
const VENDOR_PATH = '/vendor';
const ASSETS_PATH = '/assets';
const ROOT_FILE = 'src/app/main.ts';

const browserifyOptions = {
    basedir: '.',
    debug: true,
    entries: [ROOT_FILE],
    cache: {},
    packageCache: {}
};

var nonWatchedBrowserify = browserify(browserifyOptions).plugin(tsify);
var watchedBrowserify = watchify(nonWatchedBrowserify);

function bundle() {
    return watchedBrowserify
        .transform('babelify')
        .bundle()
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(DEV_BUILD_PATH))
        .pipe(browserSync.stream({once: true}));
}

gulp.task('copy-html-dist', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(PROD_BUILD_PATH));
});

gulp.task('copy-css-dist', function () {
    return gulp.src(paths.styles)
        .pipe(gulp.dest(PROD_BUILD_PATH));
});

gulp.task('copy-vendor-dist', function () {
    return gulp.src(paths.vendor)
        .pipe(gulp.dest(PROD_BUILD_PATH + VENDOR_PATH));
});

gulp.task('copy-assets-dist', function () {
    return gulp.src(paths.assets)
        .pipe(gulp.dest(PROD_BUILD_PATH + ASSETS_PATH));
});

gulp.task('default', ['run'], bundle);

gulp.task('run', function () {
    bundle();
    browserSync.init({
        server: ['src', DEV_BUILD_PATH]
    });

    watchedBrowserify.on('update', bundle);
    watchedBrowserify.on('log', gutil.log);

    gulp.watch('src/**/*.{html,css}').on('change', browserSync.reload);
});

gulp.task('dist', function (callback) {
    runSequence(
        'clean-dist',
        [
            'build-dist',
            'copy-html-dist',
            'copy-css-dist',
            'copy-vendor-dist',
            'copy-assets-dist'
        ],
        'cache-bust-dist',
        callback);
});

gulp.task('build-dist', function () {
    return browserify(browserifyOptions)
    .plugin(tsify)
    .transform('babelify')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(PROD_BUILD_PATH));
});

gulp.task('cache-bust-dist', function () {
    gulp.src(PROD_BUILD_PATH + '/index.html')
    .pipe(cachebust({
        type: 'timestamp'
    }))
    .pipe(gulp.dest(PROD_BUILD_PATH));
});

gulp.task('clean-dist', function () {
    return gulp.src(PROD_BUILD_PATH, {read: false})
        .pipe(clean());
});

gulp.task('deploy', ['dist'], function () {
    return gulp.src('dist/**/*')
        .pipe(ghpages());
});
