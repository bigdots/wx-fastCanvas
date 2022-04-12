const { src, dest } = require('gulp')
// const babel = require('gulp-babel');
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')

exports.default = function () {
  return (
    tsProject
      .src()
      .pipe(tsProject())
      // .pipe(uglify())
      // .pipe(rename({ extname: '.min.js' }))
      .js.pipe(dest('dist'))
  )
}
