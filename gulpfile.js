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

var paths = {
    pages: ['src/*.html']
};

const DEV_BUILD_PATH = '.tmp';
const PROD_BUILD_PATH = 'dist';

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

function bundle() {
    return watchedBrowserify
        .transform('babelify')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(DEV_BUILD_PATH))
        .pipe(browserSync.stream({once: true}));
}

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(DEV_BUILD_PATH));
});

gulp.task('default', ['copy-html'], bundle);


gulp.task('run', ['watch'], function () {
    bundle();
    browserSync.init({
        server: ['src', DEV_BUILD_PATH]
    });

    gulp.watch('src/**/*.{html,css}').on('change', browserSync.reload);
});

gulp.task('watch', function () {
    watchedBrowserify.on('update', bundle);
    watchedBrowserify.on('log', gutil.log);
});


// 

// var browserify = require('browserify');
// 
// var source = require('vinyl-source-stream');

// 
// var del = require('del');
// var merge = require('merge-stream');


// var ghpages = require('gulp-gh-pages');



// //
// // browserify and js
// //

// var bundler = browserify([
//   './src/js/main.js'
// ]);

// var bundle = function ()  {
//   return bundler
//     .bundle()
//     .on('error', gutil.log)
//     .pipe(source('bundle.js'))
//     .pipe(gulp.dest('.tmp/js/'))
//     .pipe(browserSync.stream({once: true}));
// };


// gulp.task('browserify', bundle);

// // 3rd party libs that don't play nice with browserify
// gulp.task('libs', function () {
//   var dir = './node_modules/phaser/dist/';
//   return gulp.src(['phaser.min.js', 'phaser.map'], { cwd: dir, base: dir})
//     .pipe(gulp.dest('./.tmp/js/lib/'));
// });

// gulp.task('js', ['browserify', 'libs']);

// //
// // build and deploy
// //

// gulp.task('build', ['js']);

// gulp.task('dist', ['build'], function () {
//   var rawFiles = gulp.src([
//     'index.html', 'raw.html',
//     'styles.css',
//     'images/**/*', 'fonts/**/*', 'audio/**/*'
//   ], { cwd: './src', base: './src' })
//     .pipe(gulp.dest('./dist/'));

//   var builtFiles = gulp.src(['js/**/*'], { cwd: '.tmp', base: '.tmp' })
//     .pipe(gulp.dest('./dist/'));

//   return merge(rawFiles, builtFiles);
// });

// gulp.task('clean', function () {
//   return del(['.tmp', 'dist', '.publish']);
// });


// gulp.task('deploy:ghpages', ['dist'], function () {
//   return gulp.src('dist/**/*')
//     .pipe(ghpages());
// });


// gulp.task('deploy', ['deploy:ghpages'])

// //
// // dev tasks
// //

// gulp.task('watch', function () {
//   bundler = watchify(bundler, watchify.args);
//   bundler.on('update', bundle);
// });

// gulp.task('run', ['watch', 'build'], function () {
//   browserSync.init({
//     server: ['src', '.tmp']
//   });

//   gulp.watch('src/**/*.{html,css}').on('change', browserSync.reload);
// });

// //
// // default task
// //

// gulp.task('default', ['dist']);
