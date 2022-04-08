const { src, dest } = require('gulp')
// const babel = require('gulp-babel');
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')

exports.default = function () {
  return (
    src('src/*.ts')
      // .pipe(babel())
      // .pipe(src('vendor/*.js'))
      // .pipe(
      //   ts({
      //     declaration: true,
      //   })
      // )
      .pipe(uglify())
      .pipe(rename({ extname: '.min.js' }))
      .pipe(dest('dist/'))
  )
}
