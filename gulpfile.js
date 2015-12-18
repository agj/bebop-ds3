
// To simplify debugging:
// require('superstack');
// require('clarify');

var R = require('ramda');
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var argv = require('yargs').argv;
var gutil = require('gulp-util');



var watch = !!argv.watch;

var browserifyOpts = {
	entries: 'public/main.js',
	debug: true,
};

var b = !watch ? browserify(browserifyOpts) : watchify(browserify(R.merge(watchify.args, browserifyOpts)));
if (watch) {
	b.on('update', bundle);
}
b.on('log', gutil.log);


gulp.task('default', ['browserify']);


// gulp.task('browserify', function () {
// 	return browserify({
// 			entries: 'public/main.js',
// 			debug: true,
// 		})
// 		.bundle()
// 		.pipe(source('bundle.js'))
// 		.pipe(gulp.dest('public/'));
// });


gulp.task('browserify', bundle);

function bundle() {
	return b.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('public/'));
}


