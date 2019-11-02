var gulp   = require("gulp"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename");
 
function minify() {
  return gulp.src("./js/app.js")
    .pipe(rename("app.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./js"));
}

exports.default = minify;