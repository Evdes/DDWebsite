"use strict";

const fileinclude = require("gulp-file-include");
const gulp = require("gulp");
const del = require("del");
const sass = require("gulp-sass");
const minify = require("gulp-minify");
const htmlOutputPath = "./dist/";
const cssOutputPath = "./dist/css";
const jsOutputPath = "./dist/js";
const rename = require("gulp-rename");
const path = require("path");
const browserSync = require("browser-sync").create();
const merge = require("merge-stream");

function browserSyncInit(done) {
  browserSync.init({
    server: {
      baseDir: "./dist/",
    },
    port: 3000,
  });
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function clean() {
  return del(["dist/*.html", "dist/css", "dist/vendor", "dist/img", "dist/js"]);
}

function html() {
  return gulp
    .src(["./src/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest(htmlOutputPath));
}

function images() {
  return gulp.src("./src/img/*").pipe(gulp.dest("./dist/img"));
}

function css() {
  sass.compiler = require("node-sass");

  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      rename(function (file) {
        // this removes the last parent directory of the relative file path
        file.dirname = path.dirname(file.dirname);
      })
    )
    .pipe(gulp.dest(cssOutputPath))
    .pipe(browserSync.stream());
}

function js(){
  return gulp
		.src(["./src/js/**/*.js", "!./src/js/cookies.js"])
		.pipe(
			minify({
				ext: {
					min: ".min.js",
				},
        noSource: true
			})
		)
		.pipe(gulp.dest(jsOutputPath));
}

function vendor() {
  // Bootstrap
  var bootstrap = gulp
    .src("./node_modules/bootstrap/dist/**/*")
    .pipe(gulp.dest("./dist/vendor/bootstrap"));
  // Font Awesome CSS
  var fontAwesomeCSS = gulp
    .src("./node_modules/@fortawesome/fontawesome-free/css/**/*")
    .pipe(gulp.dest("./dist/vendor/fontawesome-free/css"));
  // Font Awesome Webfonts
  var fontAwesomeWebfonts = gulp
    .src("./node_modules/@fortawesome/fontawesome-free/webfonts/**/*")
    .pipe(gulp.dest("./dist/vendor/fontawesome-free/webfonts"));
  // jQuery
  var jquery = gulp
    .src([
      "./node_modules/jquery/dist/*",
      "!./node_modules/jquery/dist/core.js",
    ])
    .pipe(gulp.dest("./dist/vendor/jquery"));

  return merge(bootstrap, fontAwesomeCSS, fontAwesomeWebfonts, jquery);
}

function watchFiles() {
  gulp.watch("./src/scss/**/*", gulp.series(css));
  gulp.watch("./src/**/*.html", gulp.series(html, browserSyncReload));
  gulp.watch("./src/js/**/*", gulp.series(js, browserSyncReload));
}

const build = gulp.series(clean, gulp.parallel(vendor, css, html, images, js));
const watch = gulp.series(build, browserSyncInit, watchFiles);

exports.build = build;
exports.watch = watch;