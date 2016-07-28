/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp'),
autoprefixer = require('gulp-autoprefixer'),
cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
	ngAnnotate = require('gulp-ng-annotate'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    del = require('del'),
	htmlmin = require('gulp-htmlmin');


gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'html', 'watch');
});

gulp.task('clean', function() {
    return del(['public/assets/css', 'public/assets/js', 'public/assets/img']);
});

gulp.task('html', function() {
  return gulp.src('assets/html/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public'))
	.pipe(notify({ message: 'Html task complete' }));
});

// Styles
gulp.task('styles', function() {
  return gulp.src('assets/styles/main.css')
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('public/assets/css/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('public/assets/css/'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function () {
  return gulp.src('assets/scripts/*.js')
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(rename({suffix: '.min'}))
	.pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('watch', function() {
  gulp.watch('assets/styles/*.css', ['styles']);
  gulp.watch('assets/scripts/*.js', ['scripts']);
  gulp.watch('assets/html/*.html', ['html']);
  //gulp.watch('src/images/**/*', ['images']);

});


// gulp.task('images', function() {
//   return gulp.src('src/images/**/*')
//     .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
//     .pipe(gulp.dest('dist/assets/img'))
//     .pipe(notify({ message: 'Images task complete' }));
// });
