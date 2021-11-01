#  Gulp知识点

gulp使用是管道思想（IO操作）：（流操作）：只有一个输入和一个输出，在所有的操作都完成之后才会返回结果

如果不按流操作，则每进行一个任务都输入输出一次，速度慢，效率低



- 每一个操作功能都称为任务，任务有公开任务和私有任务(导出的为公开任务，不导出的为私有任务)
- 每一个步骤都要用`.pipe`去完成，并且步骤之间不能用;，是
- gulp使用的模块规范是CommemJS
- series：依次执行每一个任务，中间有一个任务出错了就会停下来
- parallel：同时执行每一个任务，中间有任务出错了也不会停下来
- 

#### 插件：

- 压缩：gulp-uglify
-重命名文件名：gulp-rename ,产生一个新的文件，然后重命名

#### 文件监控：

监听指定的文件，当文件内容发生变化，会自动更新，类似于热更新





```js
const { src, dest } = require("gulp");//src：入口  dest：出口
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
```



