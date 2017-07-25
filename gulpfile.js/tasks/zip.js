var gulp = require('gulp'),
  zip = require('gulp-zip'),
  srcFilesList = ['dist/**/*'],
  zipFile = 'dist.zip',
  dest = './';

function zipTask() {
  return gulp.src(srcFilesList)
    .pipe(zip(zipFile))
    .pipe(gulp.dest(dest));
}

gulp.task('zip', zipTask);
module.exports = zipTask;