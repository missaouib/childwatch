var gulp = require('gulp'),
    del = require('del'),
    cleanFileList = ['./dist', './dist.zip'];

function cleanTask() {
  return del( cleanFileList );
}

gulp.task('clean', cleanTask);

module.exports = cleanTask;