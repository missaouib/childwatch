var gulp = require('gulp');

function distTask() {
  return gulp.src(['client/index.html','client/error.html', 'client/favicon.ico'])
    .pipe(gulp.dest('dist/'));
}

function css(){
    return gulp.src( ['client/css/**/*'])
    .pipe(gulp.dest('dist/css') );
}

function js(){
    return gulp.src( ['client/js/**/*'])
    .pipe(gulp.dest('dist/js') );
}

function img(){
    return gulp.src( ['client/img/**/*'])
    .pipe(gulp.dest('dist/img') );
}

function angularNodeModules(){
    return gulp.src( ['node_modules/angular/**/*'])
    .pipe(gulp.dest('dist/js/angular') );
}

function angularUINodeModules(){
    return gulp.src( ['node_modules/angular-ui-router/release/**/*'])
    .pipe(gulp.dest('dist/js/angular-ui-router') );
}

function requirejsNodeModules(){
    return gulp.src( ['node_modules/requirejs/**/*'])
    .pipe(gulp.dest('dist/js/requirejs') );
}



gulp.task('dist', distTask );
gulp.task( 'dist-img', img );
gulp.task( 'dist-js', js );
gulp.task( 'dist-css', css );
gulp.task('dist-angular', angularNodeModules );
gulp.task('dist-angular-ui-router', angularUINodeModules );
gulp.task('dist-requirejs', requirejsNodeModules );

module.exports = distTask;