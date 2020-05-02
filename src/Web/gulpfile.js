"use strict";

const fileinclude = require("gulp-file-include");
const gulp = require("gulp");
const del = require("del");
const sass = require("gulp-sass");
const htmlOutputPath = "./dist/";
const cssOutputPath = "./dist/css";
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
  return del(["dist/*.html", "dist/css", "dist/vendor"]);
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
}

const build = gulp.series(clean, vendor, gulp.parallel(css, html));
const watch = gulp.series(build, browserSyncInit, watchFiles);

exports.build = build;
exports.watch = watch;