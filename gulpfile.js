const { src, dest, series } = require('gulp')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const clean = require('gulp-clean')
const rollup = require('rollup')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')

function cleanDist() {
  return src('dist', { read: false, allowEmpty: true }).pipe(clean('dist'))
}

async function build() {
  const subTask = await rollup.rollup({
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'amd', //iife 运行与所有环境
      name: 'index',
    },
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
    ],
  })

  await subTask.write({
    file: 'dist/index.js',
    format: 'umd', //iife
    name: 'index',
  })
}

function uglifydist() {
  return src('dist/*.js')
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify(/* options */))
    .pipe(dest('dist/'))
}

exports.default = series(cleanDist, build, uglifydist)
