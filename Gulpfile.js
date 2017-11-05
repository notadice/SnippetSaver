var gulp = require('gulp');
var url = require("url");
var fs = require("fs");
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cleanCss = require('gulp-clean-css');
var rev = require('gulp-rev');
var path = require('path');
var gutil = require('gulp-util');
var ngAnnotate = require('gulp-ng-annotate');
var clean = require('gulp-clean');
var less = require('gulp-less');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
var templateCache = require('gulp-angular-templatecache');
 
gulp.task('templates', ['clean'], function () {
  return gulp.src('app/client/**/*.html')
    .pipe(templateCache({root:'client/'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('serve', ['usemin', 'templates', 'favicons'], function(){

  var defaultFile = "index.html"
  browserSync.init({
    //proxy:'snippetsaver.dev',
    server: {
      baseDir:"dist/",
      middleware: function(req, res, next) {
          var fileName = url.parse(req.url);
          fileName = fileName.href.split(fileName.search).join("");
          var fileExists = fs.existsSync(__dirname + fileName);
          if (!fileExists && fileName.indexOf("browser-sync-client") < 0 &&
              fileName.indexOf("templates") < 0 &&
              fileName.indexOf("jsconcat") < 0 &&
              fileName.indexOf("json") < 0 &&
              fileName.indexOf("favicons") < 0) {
              req.url = "/" + defaultFile;
          }
          return next();
      }
    }
  });

  gulp.watch("app/client/**/*.less", ['usemin', 'templates', 'reload']);
  gulp.watch("app/*.html", ['usemin', 'templates', 'reload']);
  gulp.watch("app/client/**/*.html", ['templates', 'reload']);
  gulp.watch("app/client/**/*.js", ['usemin', 'templates', 'reload']);
});

gulp.task('reload', ['usemin'],function(){
  browserSync.reload();
});

gulp.task('clean', function(){
  return gulp.src('dist/', {read:false})
    .pipe(clean());
});

gulp.task('favicons', ['clean'], function(){
  return gulp.src([
      'app/favicons/*.*',
      'app/*.json'
    ],
    { base:'app' })
    .pipe(gulp.dest('dist'))
})

gulp.task('usemin', ['clean'], function() {
  return gulp.src('app/*.html')
    .pipe(usemin({
      css: [ less(), rev() ],
      html: [ htmlmin({ collapseWhitespace: true }) ],
      //jsconcat: [ 'concat' ],
      jsconcat: [ 'concat', uglify() ],
      js: [ babel({presets:["latest"]}), ngAnnotate(), uglify().on('error', gutil.log), rev() ],
      inlinejs: [ babel({presets:["latest"]}), ngAnnotate() ],
      inlinecss: [ less(), cleanCss(), 'concat' ]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('staging', ['usemin', 'favicons'], function(){
  return gulp.src('dist/**/*', {base:'dist'})
    .pipe(gulp.dest('/var/www/staging/snippet-saver/'));
});

gulp.task('production', ['usemin', 'favicons'], function(){
  return gulp.src('dist/**/*', {base:'dist'})
    .pipe(gulp.dest('/var/www/snippet-saver/'));
});

gulp.task('default', ['usemin']);