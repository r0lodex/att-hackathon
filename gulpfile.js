/* jshint ignore:start */
// DEPENDENCIES
// ========================================
var gulp     = require('gulp'),
    sass     = require('gulp-sass'),
    prefix   = require('gulp-autoprefixer'),
    uglify   = require('gulp-uglify'),
    rename   = require('gulp-rename'),
    concat   = require('gulp-concat'),
    notify   = require('gulp-notify'),
    include  = require('gulp-include'),
    gutil    = require('gulp-util');

gulp.task('minify-js', consolidateJSFiles);
gulp.task('minify-css', minifycss);

gulp.task('minify-dash-js', dashboardCompileJS);
gulp.task('minify-dash-css', minifyDashboardCss);

gulp.task('corejs', concatJS);

gulp.task('default', function() {
    gulp.start(
        'minify-js',
        'minify-css',
        'minify-dash-js',
        'minify-dash-css',

        'corejs'
    )
});

gulp.task('watch', function() {
    gulp.watch('./app/**/**/*.js', ['minify-js']);
    gulp.watch('./app/**/**/*.scss', ['minify-css']);
    gulp.watch('./dashboard/**/**/*.js', ['minify-dash-js']);
    gulp.watch('./dashboard/**/**/*.scss', ['minify-dash-css']);
    
    gulp.watch('./core.js', ['corejs']);
});

function minifycss() {
    return gulp.src('./app/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(concat('rr.css'))
        .pipe(prefix())
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify({ message: 'CSS minified.' }))
}

function concatJS() {
    return gulp.src('./core.js')
        .pipe(include())
        .pipe(concat('core.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify({ message: 'Core minified' }))
}

function consolidateJSFiles() {
    return gulp.src('./app/**/*.js')
        .pipe(concat('app.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify({ message: 'App JS minified' }))
}

function dashboardCompileJS() {
    return gulp.src('./dashboard/**/*.js')
        .pipe(concat('dashboard.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/dashboard'))
        .pipe(notify({ message: 'Dashboard JS minified' }))
}

function minifyDashboardCss() {
    return gulp.src('./dashboard/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(concat('dashboard.css'))
        .pipe(prefix())
        .pipe(gulp.dest('./dist/dashboard'))
        .pipe(notify({ message: 'Dashboard CSS minified.' }))
}