var gulp = require('gulp'),
    s3 = require('vinyl-s3'),
    through2 = require('through2'),
    vinylFilterSince = require('vinyl-filter-since');

gulp.task('s3-upload', () =>
    gulp.src(['./client/dist/**/*'] , {buffer: false} )
    .pipe(s3.dest('s3://childwatch2.com'))
);
