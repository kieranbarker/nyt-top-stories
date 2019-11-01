var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
 
function minify() {
  gulp.src("./js/app.js")
    .pipe(rename("app.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./js"));
  return Promise.resolve("minified");
}

exports.default = minify;