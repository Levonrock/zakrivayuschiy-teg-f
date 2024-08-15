const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');
const gulpPug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));

function moveDistToRoot() {
  return gulp.src('dist/**/*')
    .pipe(gulp.dest('docs'));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
   // logLevel: 'debug'
  });
}

function scss() {
  const plugins = [
      //autoprefixer(),
      mediaquery(),
      //cssnano()
  ]
  return gulp.src('src/layouts/default.scss')
        //.pipe(plumber())
        .pipe(sass())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function pug() {
  return gulp.src('src/pages/**/*.pug')
        .pipe(gulpPug({
          pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function html() {
  const options = {
	  removeComments: true,
	  removeRedundantAttributes: true,
	  removeScriptTypeAttributes: true,
	  removeStyleLinkTypeAttributes: true,
	  sortClassName: true,
	  useShortDoctype: true,
	  collapseWhitespace: true,
		minifyCSS: true,
		keepClosingSlash: true
	};
  return gulp.src('src/**/*.html')
        .pipe(gulp.plumber())
        .pipe(gulp.dest('dist/'))
        .on('data', function(file) {
		      const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
		      return file.contents = buferFile
		    })
        .pipe(browserSync.reload({stream: true}))
}

function css() {
  const plugins = [
      autoprefixer(),
      mediaquery(),
      cssnano()
  ]
  return gulp.src('src/components/**/*.css')
        .pipe(gulp.plumber())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}))
}

function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}', {encoding: false})
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({stream: true}));
}

function fonts() {
  return gulp.src('src/fonts/**/*.{woff,woff2}', {encoding: false})
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.reload({stream: true}));
}

function svg() {
  return gulp.src('src/svg/**/*', {encoding: false})
    .pipe(gulp.dest('dist/svg'))
    .pipe(browserSync.reload({stream: true}));
}

function js() {
  return gulp.src('src/scripts/**/*.js', {encoding: false})
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/pages/**/*.pug'], pug);
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/**/*.scss'], scss);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/fonts/**/*.{woff,woff2}'], fonts);
  gulp.watch(['src/svg/**/*'], svg);
  gulp.watch(['src/scripts/**/*.js'], js);
}

const build = gulp.series(clean, gulp.parallel(pug, scss, images, fonts, svg, js), moveDistToRoot);
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.pug = pug;
exports.css = css;
exports.scss = scss;
exports.images = images;
exports.fonts = fonts;
exports.svg = svg;
exports.js = js;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;