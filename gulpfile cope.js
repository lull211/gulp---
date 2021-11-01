// function defaultTask(cb) {
//   // place code for your default task here
//   console.log("lvjing");
//   cb();
// }

// exports.default = defaultTask;
// const {series,parallel}=require("gulp");
// function fn1(cb) {

// }

const { src, dest } = require("gulp");
const uglify = require("gulp-uglify");
const rename=require('gulp-rename')
exports.default = function () {
  return src("src/js/*.js")
    .pipe(uglify())//压缩index.js文件
    .pipe(rename({extname:'.min.js'}))//重命名压缩后的文件，extname是后缀的名字
    .pipe(dest("dist/js")); //中间不能有一个;
};


//文件监控：
const {watch}=require('gulp');
watch ('src/css/*',{},function (cb) {
 console.log('文件被修改了');
 cb()
}) 