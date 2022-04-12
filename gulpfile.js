const { src, dest } = require('gulp')
// const babel = require('gulp-babel');
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const ts = require('gulp-typescript')
const cleanDir = require('gulp-clean-dir')
const tsProject = ts.createProject('tsconfig.json')

exports.default = function () {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(cleanDir('./dist'))
    .pipe(dest('dist'))
}
