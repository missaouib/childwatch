var gulp = require('gulp');
var runSequence = require('run-sequence');

function buildTask(callback) {
  return runSequence(
    ['clean'],
    ['dist', 'dist-img', 'dist-js', 'dist-css'],
    ['dist-angular', 'dist-angular-ui-router', 'dist-requirejs'],
    callback
  );
}

gulp.task('build', buildTask );
module.exports = buildTask;