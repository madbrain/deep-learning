var gulp        = require('gulp');
var ts          = require('gulp-typescript');
var sourcemaps  = require('gulp-sourcemaps');
var util        = require('gulp-util');
var bs          = require("browser-sync");
var runSequence = require('run-sequence');
var Builder     = require('systemjs-builder');
var del         = require('del');
var useref      = require('gulp-useref');
var gulpif      = require('gulp-if');
var rev         = require('gulp-rev');
var revReplace  = require('gulp-rev-replace');
var uglify      = require('gulp-uglify');
var cssnano     = require('gulp-cssnano');
var flatten     = require('gulp-flatten');

function startBrowsersync (config) {
    bsIns = bs.create();
    bsIns.init(config);
    bsIns.reload();
}

gulp.task('serve', function() {
    runSequence(
        [/*'sass',*/ 'tsc'],
        /*['html', 'css'],
        ['watch-sass', 'watch-ts', 'watch-html', 'watch-css'],*/ function() {
        startBrowsersync({
            port: 3000,
            open: false,
            injectChanges: false,
            server: {
                baseDir: './src/',
                //middleware: [historyApiFallback()],
                routes: {
                    "/node_modules": "node_modules",
                    "/src": "src",
                    "/tmp": "tmp"
                },
                files: [
                    "src/index.html",
                    "src/systemjs.conf.js",
                    //assetsPath.styles + "main.css",
                    "tmp/app/**/*.js"
                ]
            }
        })
    });
});

gulp.task('tsc', function() {
    var tsProject = ts.createProject('tsconfig.json');
    var res = gulp.src([
            "src/app/**/!(*.spec)+(.ts)",
            "typings/**.d.ts"
        ], {
            base: 'src',
            outDir: 'tmp'
        })
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        // .on('error', function () {
        //     process.exit(1);
        // })
        ;
    return res.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('tmp'));
});

gulp.task('build', function (done) {
    runSequence(/*'test',*/ 'build-systemjs', 'build-assets', done);
});
 
gulp.task('build-systemjs', ['tsc'], function (done) {
    var builder = new Builder();
    builder.loadConfig('./src/systemjs.conf.js')
    .then(function() {
        return builder
            .buildStatic(
                'tmp/app',
                'tmp/app/bundle.js', {
                normalize: true,
                //minify: true,
                //mangle: true,
                runtime: false/*,
                globalDefs: {
                    DEBUG: false,
                    ENV: 'production'
                }*/
            });
    })
    .then(function() {
        util.log('Build complete');
        done();
    })
    .catch(function (ex) {
        util.log('Build failed', ex);
        done('Build failed.');
    });
});

gulp.task('build-assets', function (done) {
    runSequence('clean-build'/*, ['sass', 'fonts']*/, function () {
        gulp.src('src/views/**/*.html')
            //.pipe(flatten())
            .pipe(gulp.dest("build/views"));

        gulp.src('src/app/**/*.css')
            .pipe(cssnano({zindex: false}))
            .pipe(flatten())
            .pipe(gulp.dest("build"));

        gulp.src('src/data/**/*.*')
            .pipe(gulp.dest('build/data'));

        gulp.src("src/index.html")
            .pipe(useref())
            //.pipe(gulpif('vendor.js', uglify()))
            .pipe(gulpif('*.css', cssnano()))
            .pipe(gulpif('!*.html', rev()))
            .pipe(revReplace())
            .pipe(gulp.dest("build"))
            .on('finish', done);
    });
});

gulp.task('clean-build', function () {
    return del(["build"]);
});