
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload');


gulp.task ('default' , function (){
livereload.listen();
gulp.watch ('./public/sass/*.sass' , function (){
   return gulp.src ('./public/sass/*.sass')
  .pipe(sass())
  .pipe(gulp.dest('./public/css'))
  .pipe(livereload());
  })

})
