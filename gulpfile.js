// ====================================
// Gulp Settings
// ====================================
// Include gulp
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();
// Input Variables
var input_Base      = './app',
    input_Scr       = input_Base + '/src',
    input_Js        = input_Scr + '/scripts/*.js',
    input_Vendor    = input_Scr + '/scripts/vendor/**/*.js',
    input_Sass      = input_Scr + '/sass/**/*.+(scss|sass)',
    input_Images    = input_Scr + '/images/**/*',
    input_Templates = input_Base  + '/templates',
    input_Pages     = input_Base  + '/pages/**/*.+(html|nunjucks)',
    input_Data      = input_Base  + '/data.json';
// Output Variables
var output_Base     = './build',
    output_Js       = output_Base  + '/js',
    output_Css      = output_Base  + '/css',
    output_CssMaps  = './maps',
    output_Images   = output_Base  + '/img';
// Plugin options
var options = {
  sass: {
    errLogToConsole: true,
    outputStyle: 'expanded'
  }
};
// ====================================
// Gulp Tasks
// ====================================
// Concatenate & Minify JS
gulp.task('main-scripts', function() {
    return gulp.src(input_Js)
      .pipe(plugins.plumber())
      .pipe(plugins.concat('main.js'))
      .pipe(plugins.rename({suffix: '.min'}))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(output_Js));
});      
gulp.task('vendor-scripts', function() {      
    return gulp.src(input_Vendor)
      .pipe(plugins.plumber())
      .pipe(plugins.concat('vendor.js'))
      .pipe(plugins.rename({suffix: '.min'}))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(output_Js));
});
// Compile SASS & Create Sourcemaps
gulp.task('styles', function() {
    return gulp.src(input_Sass)
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass(options.sass).on('error', plugins.sass.logError))
        .pipe(plugins.csscomb())
        .pipe(plugins.autoprefixer())
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.sourcemaps.write(output_CssMaps))
        .pipe(gulp.dest(output_Css));
});
// Optimize images
gulp.task('images', function() {
  return gulp.src(input_Images)
    .pipe(plugins.plumber())
    .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(output_Images));
});
// Nunjucks templating
gulp.task('nunjucks', function() {
  plugins.nunjucksRender.nunjucks.configure([input_Templates]);  
  return gulp.src(input_Pages)
    .pipe(plugins.plumber())
    .pipe(plugins.data(function() {
      return require(input_Data)
    }))
    .pipe(plugins.nunjucksRender())
    .pipe(gulp.dest(output_Base));
});
// Watch for file changes
gulp.task('watch', function() {
  gulp.watch(input_Js, ['main-scripts']);
  gulp.watch(input_Vendor, ['vendor-scripts']);
  gulp.watch(input_Sass, ['styles']);
  gulp.watch(input_Images, ['images']);
  gulp.watch(input_Templates + '/**/*.+(html|nunjucks)', ['nunjucks']);
  gulp.watch(input_Pages, ['nunjucks']);
  gulp.watch(input_Data, ['nunjucks']); 
});
// ====================================
// Run Gulp
// ====================================
// Default
gulp.task('default', ['main-scripts', 'vendor-scripts', 'styles', 'images', 'nunjucks', 'watch']);