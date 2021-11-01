const {series ,src ,dest ,watch}=require('gulp');
const htmlClean=require('gulp-htmlclean')
const less=require('gulp-less');
const cleanCss = require("gulp-clean-css");
const stripDebug=require('gulp-strip-debug'); //debugger用的
const uglify=require('gulp-uglify');
const imageMin=require('gulp-imagemin');
const connect=require('gulp-connect');
const folder={
 src:'src/',
 dist:'dist/'
}

function html() {

 return src (folder.src+'html/*')
 .pipe(htmlClean())
 .pipe(dest(folder.dist+'html/'))
 .pipe(connect.reload())//connect上有一个方法，reload，重新加载，在这里执行实现热更新
}

function css() {
  return src(folder.src + "css/*")
    .pipe(less())
    .pipe(cleanCss())
    .pipe(dest(folder.dist + "css/"))
    .pipe(connect.reload()); //connect上有一个方法，reload，重新加载，在这里执行实现热更新
}

function js() {
  return src(folder.src + "js/*")
    // .pipe(stripDebug())
    // .pipe(uglify())
    .pipe(dest(folder.dist + "js/"))
    .pipe(connect.reload()); //connect上有一个方法，reload，重新加载，在这里执行实现热更新
}

function image() {
 return src(folder.src + "images/*")
    .pipe(imageMin())
    .pipe(dest(folder.dist + "images/"))

}
function server(cb) {  //开启服务器，这是自己弄的一个服务器
 connect.server({
  port:'1573',
  livereload:true,
 });
 cb();
 
}
watch(folder.src+'html/*',function (cb) {
 html();
 cb();
})
watch(folder.src + "css/*", function (cb) {
  css();
  cb();
});
watch(folder.src + "js/*", function (cb) {
  js();
  cb();  //需要有cb()表示结束，否则自己识别不出来什么时候结束
});

exports.default=series(html,css,js,image,server);