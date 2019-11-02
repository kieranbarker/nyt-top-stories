var gulp   = require("gulp"),
    terser = require("gulp-terser"),
    rename = require("gulp-rename");
 
function minify() {
  return gulp.src("./js/app.js")
    .pipe(rename("app.min.js"))
    .pipe(terser())
    .pipe(gulp.dest("./js"));
}

exports.default = minify;