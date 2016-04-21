'use strict';

var gulp = require('gulp');
var traceur = require('gulp-traceur');
var traceurOptions = require('./config').traceur;
var connect = require('gulp-connect');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
// var debug = require('gulp-debug');
var rimraf = require('rimraf');
var mainBowerFiles = require('main-bower-files');

var path = {
  src: './src/**/*.js'
};

// Copy bower files to ./lib folder
gulp.task('bower-files', ['clean'], function(){
  return gulp.src(mainBowerFiles())
          // .pipe(debug({title: 'bower_files:'}))
          .pipe(concat('vendor.js'))
          .pipe(gulp.dest('compiled/lib'))
          ;

});

// clean the output directory
gulp.task('clean', function(cb){
    rimraf('compiled', cb);
});

// TRANSPILE ES6
gulp.task('build', ['bower-files'], function() {
  gulp.src(path.src)
      .pipe(traceur(traceurOptions))
      .on('error', swallowError)
      .pipe(gulp.dest('compiled/src'))
      .pipe(browserify())
      .on('error', swallowError)
      .pipe(filter('app.js'))
      .pipe(gulp.dest('compiled/combined'))
      .pipe(connect.reload());
});

// WATCH FILES FOR CHANGES
gulp.task('watch', function() {
  gulp.watch(path.src, ['build']);
});

// WEB SERVER
gulp.task('serve', function() {
  connect.server({
    root: [__dirname],
    port: 8000,
    livereload: true
  });
});

gulp.task('default', ['build', 'watch', 'serve']);

/*jslint latedef:false*/
function swallowError (error) {
  console.log(error.toString());
  /* jshint validthis: true */
  this.emit('end');
}
