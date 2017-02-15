/********************
 * PLUGINS
 *******************/

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var webpack = require('gulp-webpack');
var del = require('del');
var browsersync = require('browser-sync');
var karma = require('karma');
var coveralls = require('gulp-coveralls');

/********************
 * TASKS
 *******************/

gulp.task('eslint', function() {
    return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', function(done){
    new karma.Server({
        configFile: [__dirname, '/karma.conf.js'].join(''),
        singleRun: true
    }, done).start();
});

gulp.task('coveralls', function(){
    gulp.src('test/lcov.info')
    .pipe(coveralls());
});

gulp.task('clean', function(){
    return del('dist/**/*', { force: true });
});

gulp.task('build', ['eslint', 'test', 'clean'], function(){
    return gulp.src('src/main.js')
    .pipe(webpack({
        output: {
            filename: 'dist.js',
            libraryTarget: 'umd',
            library: 'NewtonAdapter'
        }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('serve', ['build'], function(){
    browsersync({
        startPath: '/examples/',
        server: {}
    });
    gulp.watch(['src/**/*.js', 'test/**/*.test.js'], ['build', browsersync.reload]);
});

gulp.task('servetest', ['test'], function(){
    browsersync({
        startPath: '/test/lcov-report',
        server: {
            baseDir: '.'
        }
    });
    gulp.watch(['src/**/*.js', 'test/**/*.test.js', 'karma.conf.js', browsersync.reload], ['test']);
});

