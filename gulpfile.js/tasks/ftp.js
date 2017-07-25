var gulp = require( 'gulp' ),
    sftp = require( 'gulp-sftp' );
 
function ftpTask() {
 
  /*  globs = [
        './server/build/libs/cw2-0.0.1-SNAPSHOT.jar',
        './server/src/main/resources/application-aws.properties'
    ];
    */
 
    return gulp.src( './server/build/libs/cw2-0.0.1-SNAPSHOT.jar' )
        .pipe( sftp( {
            host:     ('52.35.164.74'),
            user:     'ubuntu',
            key:	  'C:/users/matthew/ssh-keys/Ubuntu-8G-Oregon-1.pem',
            parallel: 10
        } ) );
 
}

gulp.task('ftp', ftpTask );
module.exports = ftpTask;