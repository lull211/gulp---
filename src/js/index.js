(function ($, player) {
  //面向对象编程,class语法糖做一个构造函数
  class MusicPlayer {
    constructor(dom) {
      this.wrap = dom; //播放器的容器，（用于加载listControl模块）
      this.dataList = []; //存取请求得到的数据
      this.rotateTimer = null; //旋转唱片的额定时器
      this.indexObj = null; //索引值用于切歌
      this.curIndex = 0; //当前播放歌曲的索引值
      this.list = null; //列表切歌对象（在listPlay里赋值)
      this.progress = player.progress.pro(); //实例化进度条组件
    }

    init() {
      //初始化
      this.getDom(); //获取元素
      this.getData("../mock/data.json"); //请求数据
    }
    getDom() {
      this.record = document.querySelector(".songImg img"); //旋转图片
      this.controlBtns = document.querySelectorAll(".control li"); //底部导航按钮
    }
    getData(url) {
      var This = this; //绑定this指向为MusicPlayer对象实例,当发送请求之后，this指向会改变变为null
      $.ajax({
        url: url,
        method: "get",
        success: function (data) {
          This.dataList = data; //存储获取来的数据

          This.listPlay(); //列表切割，要放在加载音乐前面，因为loadMusic需要使用到listPaly里的方法

          This.indexObj = new player.controlIndex(data.length); //给索引值对象赋值

          This.loadMusic(This.indexObj.index); //加载音乐

          This.musicControl(); //音乐操作功能

          This.dragProgress(); //添加拖拽进度条功能
        },
        error: function () {
          console.log(stateText);
        },
      });
    }

    //加载音乐
    loadMusic(index) {
      
      player.render(this.dataList[index]); //渲染图片，歌曲信息...
      player.music.load(this.dataList[index].audioSrc);
      this.progress.renderAllTime(this.dataList[index].duration); //加载歌曲的总时间

      //切歌
      if (player.music.status == "play") {
        player.music.play();
        this.controlBtns[2].className = "playing"; //按钮状态变化
        this.imgRotate(0); //旋转图片
        this.progress.move(0);
      }
      this.curIndex = index; //存储当前歌曲的索引值
      this.list.changeSelect(index);
      var This=this;
      player.music.end(function () {
        This.loadMusic(This.indexObj.next()); //加载下一首音乐
        
      })
    }

    //播放音乐
    musicControl() {
      var This = this;
      //This指向 MusicPlayer（）对象

      //上一首
      //this指向<li></li>标签
      this.controlBtns[1].addEventListener("touchend", function () {
        player.music.status = "play";
        This.loadMusic(This.indexObj.prev()); //播放下一首歌
      });

      //播放，暂停
      //this指向<li></li>标签
      this.controlBtns[2].addEventListener("touchend", function () {
        if (player.music.status == "play") {
          //暂停
          //播放状态点击后变为暂停
          player.music.pause();
          This.imgStop();
          this.className = "";
          This.progress.stop();
        } else {
          //播放
          player.music.play(); //
          this.className = "playing";
          //获取唱片的自行定义属性dataset.rotate身上的deg ，旋转角度
          var deg = This.record.dataset.rotate || 0;
          This.imgRotate(deg); //旋转图片
          This.progress.move();
        }
      });

      //下一首
      //this指向<li></li>标签
      this.controlBtns[3].addEventListener("touchend", function () {
        player.music.status = "play";
        This.loadMusic(This.indexObj.next()); //加载下一首音乐
      });
    }

    //唱片旋转
    imgRotate(deg) {
      var This = this; //This指向dom对象，this指向MusicPlayer()构造对象

      clearInterval(this.rotateTimer);
      this.rotateTimer = setInterval(() => {
        deg = +deg + 0.2;
        This.record.style.transform = `rotate(${deg}deg)`;
        This.record.dataset.rotate = deg; //把旋转的角度放在自定义属性身上，方便暂停时取
      }, 1000 / 60); //1000/60保持跟电脑刷新频率一样
    }
    //唱片停止旋转
    imgStop(deg) {
      clearInterval(this.rotateTimer);
    }
    //列表切歌
    listPlay() {
      var This = this;
      This.list = player.listControl(this.dataList, this.wrap); //this.lsit赋值为一个listControl返回来的对象
      // console.log(this.dataList);

      //列表按钮添加点击事件
      this.controlBtns[4].addEventListener("touchend", function () {
        This.list.slideUp();
      });

      //列表歌曲播放事件
      This.list.musicList.forEach((item, index) => {
        item.addEventListener("touchend", function () {
          //如果点击的是当前播放的这首歌，无效
          if (This.curIndex == index) {
            return;
          }
          player.music.status = "play"; //歌曲要变成播放状态
          This.indexObj.index = index; //当前索引值要更新
          This.loadMusic(This.indexObj.index); //
          This.list.slideDown(); //列表消失
        });
      });
    }
    //推拽
    dragProgress() {
      var circle = player.progress.drag(document.querySelector(".circle"));
      circle.init();
      var This = this;
      //按下圆点开始
      circle.start = function () {
        This.progress.stop(); //进度条停止
      };;
      //拖拽圆点移动
      circle.move = function (per) {
        This.progress.update(per);
      };
      //拖拽圆点结束
      circle.end = function (per) {
        var curTime = per * This.dataList[This.indexObj.index].duration;
        player.music.playTo(curTime);
        player.music.play();
        This.progress.move(per); //进度条走
        This.controlBtns[2].className = "playing"; //按钮状态变化
        var deg = This.record.dataset.rotate || 0;
        This.imgRotate(deg); //旋转图片

        //拖拽到最后一秒的时候进行切歌
        if (curTime == This.dataList[This.indexObj.index].duration) {
          This.loadMusic(This.indexObj.next()); //加载下一首歌
        }
      };;;
    }
  }
  var musicPlayer = new MusicPlayer(document.getElementById("wrap"));
  musicPlayer.init();
})(window.Zepto, window.player);

//window.Zepto身上的Ajax请求和jquery身上的ajax请求是一样的，所以借用一下，因为这个包比jQuery的小
