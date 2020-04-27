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

gulp.task("clean", function () {
  return del(["dist/*.html", "dist/css/**/*.css", "dist/js/*.js"]);
});

gulp.task("generateHtml", function () {
  return gulp
    .src(["./src/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest(htmlOutputPath));
});

sass.compiler = require("node-sass");

gulp.task("generateSass", function () {
  return gulp
    .src("./src/sass/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      rename(function (file) {
        // this removes the last parent directory of the relative file path
        file.dirname = path.dirname(file.dirname);
      })
    )
    .pipe(gulp.dest(cssOutputPath))
    .pipe(browserSync.stream());
});

gulp.task("watch", function () {
  browserSync.init({
    server: {
      baseDir: "./dist",
      index: "/index.html",
    },
  });
  gulp.watch("src/sass/**/*.scss", gulp.series("generateSass"));
  gulp.watch("./*.html").on("change", browserSync.reload);
  gulp.watch("./js/**/*.js").on("change", browserSync.reload);
});
