var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// gitコミット
gulp.task('git', function() {
  var comm = 'Commit from gulp.';
  for (var i=0 ; i<process.argv.length-1 ; i++) {
    if (process.argv[i] == '--m') {
      comm = process.argv[i+1];
    }
  }
  return gulp.src('.')
    .pipe($.git.add())
    .pipe($.git.commit(comm));
});

// 開発デプロイ
/*
gulp.task('dev', ['git'], function() {
  return gulp.src('./*')
    .pipe($.git.push('heroku', 'master',function (err) {
      if (err) throw err;
    }));
    //.pipe($.shell(['echo done']));
});
*/
/*
// ローカルで更新
gulp.task('local', ['git'], function() {
  $.shell.task(
    ['heroku local web']
  );
  /*
  browserSync({
    notify: false,
    logPrefix: 'BS',
    server: ['localhost:5000']
  });
  */
  /*
});
*/

gulp.task('default', ['git'], function() {
  console.log('--m Commit Message.');
  console.log('heroku local web');
  console.log('git push heroku master');
  console.log('heroku ps:scale web=1 && heroku open');
});
