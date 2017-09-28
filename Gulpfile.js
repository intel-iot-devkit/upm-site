/**
 * @file
 *
 * Gulp tasks for the Savas Labs website.
 *
 * Table of contents:
 *   1: Styles
 *   2: Scripts
 *   3: Images
 *   4: Content
 *   5: Jekyll
 *   6: Misc.
 */

// Define variables.
var appendPrepend  = require('gulp-append-prepend');
var autoprefixer   = require('autoprefixer');
var babel          = require('gulp-babel');
var browserSync    = require('browser-sync').create();
var cache          = require('gulp-cache');
var cleancss       = require('gulp-clean-css');
var concat         = require('gulp-concat');
var del            = require('del');
var deploy         = require('gulp-gh-pages');
var file           = require('gulp-file');
var fs             = require('fs');
var gulp           = require('gulp');
var gutil          = require('gulp-util');
var imagemin       = require('gulp-imagemin');
var jpegRecompress = require('imagemin-jpeg-recompress');
var jsonminify     = require('gulp-jsonminify');
var notify         = require('gulp-notify');
var path           = require('path');
var postcss        = require('gulp-postcss');
var rename         = require('gulp-rename');
var run            = require('gulp-run');
var runSequence    = require('run-sequence');
var sass           = require('gulp-ruby-sass');
var uglify         = require('gulp-uglify');

// Include paths.
var paths          = require('./_assets/gulp_config/paths');

// -----------------------------------------------------------------------------
//   1: Styles
// -----------------------------------------------------------------------------

/**
 * Task: build:styles:scss
 *
 * Uses Sass compiler to process styles, adds vendor prefixes, minifies, then
 * outputs file to the appropriate location.
 */
gulp.task('build:styles:scss', function() {
    return sass(paths.sassFiles + '/style.scss', {
        style: 'compressed',
        trace: true,
        loadPath: [paths.sassFiles]
    })
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(cleancss())
        .pipe(appendPrepend.prependFile('./_assets/gulp_config/front-matter.txt'))
        .pipe(gulp.dest(paths.jekyllCssFiles))
        .pipe(gulp.dest(paths.siteCssFiles))
        .pipe(browserSync.stream())
        .on('error', gutil.log);
});

/**
 * Task: build:styles:css
 *
 * Copies any other Plugin CSS files to the assets directory, to be used by pages/posts
 * that specify custom CSS files.
 */
gulp.task('build:styles:css', function() {
    return gulp.src([paths.sassFiles + '/*.css'])
      .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
      .pipe(cleancss())
      .pipe(gulp.dest(paths.jekyllCssFiles))
      .pipe(gulp.dest(paths.siteCssFiles))
      .on('error', gutil.log);
});

/**
 * Task: build:styles
 *
 * Builds all site styles.
 */
gulp.task('build:styles', [
    'build:styles:scss',
    'build:styles:css'
]);

/**
 * Task: clean:styles
 *
 * Deletes all processed site styles.
 */
gulp.task('clean:styles', function(callback) {
    del([paths.jekyllCssFiles, paths.siteCssFiles]);
    callback();
});

// -----------------------------------------------------------------------------
//   2: Scripts
// -----------------------------------------------------------------------------

/**
 * Task: build:scripts
 *
 * Concatenates and uglifies global JS files and outputs result to the
 * appropriate location.
 */
gulp.task('build:scripts', function() {
    return gulp.src([
        paths.jsFiles + paths.jsPattern
    ])
    .pipe(babel({
        presets: ['es2015'],
        ignore: 'library/*.js'
    }))
    .pipe(uglify())
    .pipe(appendPrepend.prependFile('./_assets/gulp_config/front-matter.txt'))
    .pipe(gulp.dest(paths.jekyllJsFiles))
    .pipe(gulp.dest(paths.siteJsFiles))
    .on('error', gutil.log);
});

/**
 * Task: clean:scripts
 *
 * Deletes all processed scripts.
 */
gulp.task('clean:scripts', function(callback) {
    del([paths.jekyllJsFiles, paths.siteJsFiles]);
    callback();
});

// -----------------------------------------------------------------------------
//   3: Images
// -----------------------------------------------------------------------------

/**
 * Task: build:images
 *
 * Optimizes and copies image files.
 *
 * We're including imagemin options because we're overriding the default JPEG
 * optimization plugin.
 */
gulp.task('build:images', function() {
    return gulp.src(paths.imageFilesGlob)
        .pipe(cache(imagemin([
            imagemin.gifsicle(),
            jpegRecompress(),
            imagemin.optipng(),
            imagemin.svgo()
        ])))
        .pipe(gulp.dest(paths.jekyllImageFiles))
        .pipe(gulp.dest(paths.siteImageFiles));
});

/**
 * Task: clean:images
 * Deletes all processed images.
 */
gulp.task('clean:images', function(callback) {
    del([paths.jekyllImageFiles, paths.siteImageFiles]);
    callback();
});

// -----------------------------------------------------------------------------
//   4: Content
// -----------------------------------------------------------------------------

function bindapi(value){
    var examplesArray = [];
    for(i in value) {
        examplesArray.push(i);
    }
    return examplesArray;
}


function compareStrings(a, b) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return (a < b) ? -1 : (a > b) ? 1 : 0;
}

gulp.task('build:content', function() {
      return gulp.src([
          paths.contentFiles + paths.jsonPattern
      ])
      .pipe(jsonminify())
      .pipe(gulp.dest(paths.jekyllContentFiles))
      .pipe(gulp.dest(paths.siteContentFiles));
});

/**
 * Task: build:sesordata
 *
 * First set UPM src directory in _assets/gulp_config/paths.js. This task generates the array of all sensor JSONs.
 */
gulp.task('build:sensordata', function() {
    if (!paths.sensorDataSrc) {
        throw new Error('UPM src directory not found: set `paths.sensorDataSrc` or `UPM_SRC_DIR`');
    }

    let contents = fs.readdirSync(paths.sensorDataSrc);
    if (!contents.includes('upm.i')) {
        throw new Error('UPM src directory does not contain upm.i');
    }

    let dirs = contents.filter(file => {
        let filePath = path.join(paths.sensorDataSrc, file);
        return fs.statSync(filePath).isDirectory();
    });

    let jsonFilePaths = dirs.reduce((memo, dir) => {
        let dirPath = path.join(paths.sensorDataSrc, dir);
        let contents = fs.readdirSync(dirPath);

        let jsonFiles = contents.filter(file => file.endsWith('.json'));
        let jsonFilePaths = jsonFiles.map(jsonFile => path.join(paths.sensorDataSrc, dir, jsonFile));
        return memo.concat(jsonFilePaths);
    }, []);

    let sensorData = jsonFilePaths.reduce((memo, jsonFilePath) => {
        let obj = require(jsonFilePath);
        let sensor = Object.keys(obj['Sensor Class']).map(key =>
            Object.assign({ id: key }, obj['Sensor Class'][key]));

        return memo.concat(sensor);
    }, []);

    let sensorDataJson = JSON.stringify(sensorData, null, 2);

    let sensorDataPath = path.join('.', paths.contentFiles, paths.sensorDataFile);
    fs.writeFileSync(sensorDataPath, sensorDataJson, 'utf8');
});

/**
 * Task: clean:content
 *
 * Deletes all processed content.
 */
gulp.task('clean:content', function(callback) {
    del([paths.jekyllContentFiles, paths.siteContentFiles]);
    del(['assets']);
    callback();
});

// -----------------------------------------------------------------------------
//   5: Jekyll
// -----------------------------------------------------------------------------

/**
 * Task: build:jekyll
 * Runs the jekyll build command.
 */
gulp.task('build:jekyll', function() {
    var shellCommand = 'bundle exec jekyll build --config _config.yml';

    return gulp.src('')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});

/**
 * Task: build:jekyll:local
 * Runs the jekyll build command using the dev config files.
 */
gulp.task('build:jekyll:local', function() {
    var shellCommand = 'bundle exec jekyll build --future --config _config.yml,_config_dev.yml';

    return gulp.src('')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});

/**
 * Task: build
 * Build the site anew.
 */
gulp.task('build', function(callback) {
    runSequence('clean',
        ['build:images'], ['build:styles'], ['build:scripts'], ['build:content'],
        'build:jekyll',
        callback);
});

/**
 * Task: build:test
 * Builds the site anew using test and local config.
 */
gulp.task('build:local', function(callback) {
    runSequence('clean',
        ['build:images'], ['build:styles'], ['build:scripts'], ['build:content'],
        ['build:jekyll:local'], callback);
});

/**
 * Task: clean:jekyll
 * Deletes the entire _site directory.
 */
gulp.task('clean:jekyll', function(callback) {
    del(['_site']);
    callback();
});

/**
 * Task: clean
 * Runs all the clean commands.
 */
gulp.task('clean', ['clean:jekyll', 'clean:images', 'clean:scripts', 'clean:styles', 'clean:content' ]);

/**
 * Task: default
 * Builds the site anew.
 */
gulp.task('default', ['build']);

/**
 * Task: build:jekyll:watch
 * Special task for building the site then reloading via BrowserSync.
 */
gulp.task('build:jekyll:watch', ['build:jekyll:local'], function(callback) {
    browserSync.reload();
    callback();
});

/**
 * Task: build:scripts:watch
 * Special task for building scripts then reloading via BrowserSync.
 */
gulp.task('build:scripts:watch', ['build:scripts'], function(callback) {
    runSequence('build:jekyll:local');
    browserSync.reload();
    callback();
});

/**
 * Task: serve
 *
 * Static Server + watching files.
 *
 * Note: passing anything besides hard-coded literal paths with globs doesn't
 * seem to work with gulp.watch().
 */
gulp.task('serve', ['build:local'], function() {

    browserSync.init({
        server: paths.siteDir,
        port: 1234,
        ghostMode: false, // Toggle to mirror clicks, reloads etc. (performance)
        logFileChanges: true,
        logLevel: 'debug',
        open: false
    });

    // Watch site settings.
    gulp.watch(['_config*.yml'], ['build:jekyll:watch']);

    // Watch .scss files; changes are piped to browserSync.
    // Ignore style guide SCSS.
    // Rebuild the style guide to catch updates to component markup.
    gulp.watch(
      ['_assets/css/*.scss'],
      ['build:jekyll:watch']
    );

    // Watch .js files.
    gulp.watch('_assets/js/**/*.js', ['build:scripts:watch']);

    // Watch image files
    gulp.watch('_assets/images/**/*', ['build:images']);

    // Watch HTML and markdown files.
    gulp.watch(
      ['_includes/*.html', '_includes/*/*.html' ,'_layouts/*.html'],
      ['build:jekyll:watch']);

    // Watch RSS feed XML files.
    gulp.watch('**.xml', ['build:jekyll:watch']);

    // Watch data files.
    gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll:watch']);

    // Watch favicon.png.
    gulp.watch('favicon.png', ['build:jekyll:watch']);

});
// -----------------------------------------------------------------------------
//   6: Misc.
// -----------------------------------------------------------------------------

/**
 * Task: update:gems
 *
 * Updates Ruby gems.
 */
gulp.task('update:gems', function() {
    return gulp.src('')
        .pipe(run('bundle install'))
        .pipe(run('bundle update'))
        .pipe(notify({ message: 'Bundle Update Complete' }))
        .on('error', gutil.log);
});

gulp.task('deploy',['build:jekyll'], function () {return gulp.src("./_site/**/*").pipe(deploy()) });
