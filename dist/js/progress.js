(function (root) {
  //进度条
  class Progress {
    constructor() {
      this.durTime = 0; //存储总时间
      this.frameId = null; //关键帧定时器
      this.starTime = 0; //记录进度条起始时间
      this.lastPer = 0; //暂停时已经走了的百分比
      this.init();
    }
    //初始化
    init() {
      this.getDom();
    }
    //获取Dom节点
    getDom() {
      this.curTime = document.querySelector(".curTime");
      this.circle = document.querySelector(".circle");
      this.frontBg = document.querySelector(".frontBg");
      this.totalTime = document.querySelector(".totalTime");
    }
    //处理请求获取到的时间
    renderAllTime(time) {
      this.durTime = time;
      time = this.formatTime(time);
      this.totalTime.innerHTML = time;
    }
    //转换请求得到的时间
    formatTime(time) {
      time = Math.round(time); //四舍五入
      var m = Math.floor(time / 60); //得到分钟
      var s = time % 60; //获得的总秒数除以60得到分钟剩余的秒钟

      m = m < 10 ? "0" + m : m; //整理数字
      s = s < 10 ? "0" + s : s;

      return m + ":" + s;
    }

    //移动进度条
    move(per) {
      cancelAnimationFrame(this.frameId);
      var This = this;
      this.startTime = new Date().getTime(); //记录此时播放的时间戳
      This.lastPer = per === undefined ? This.lastPer : per;

      function frame() {
        //this指向改变，使用This
        var curTime = new Date().getTime();
        var per = This.lastPer + (curTime - This.startTime) / (This.durTime * 1000); //将durTime转成毫秒数，得到百分比,再加上暂停时的百分比
        if (per <= 1) {
          This.update(per);
        } else {
          //歌曲播放完毕,关掉定时器
          cancelAnimationFrame(This.frameId);
        }

        This.frameId = requestAnimationFrame(frame);
        //html5的关键帧动画，浏览器刷新一下，这个关键帧就调用一下，实现原理是递归，自己调用自己
      }

      frame(); //关键帧动画要调用一下
    }

    //更新进度条
    update(per) {
      //更新时间
      var time = this.formatTime(per * this.durTime);
      this.curTime.innerHTML = time;
      //更新白条
      this.frontBg.style.width = per * 100 + "%";
      //更新原点位置
      var l = per * this.circle.parentNode.offsetWidth;
      this.circle.style.transform = `translateX(${l}px)`;
    }

    //停止进度条
    stop() {
      cancelAnimationFrame(this.frameId);
      var stopTime = new Date().getTime();
      this.lastPer += (stopTime - this.startTime) / (this.durTime * 1000); //要把所有的点击暂停时刻的百分比加起来才行,如果不加等于，会漏掉一次播放的时长
    }
  }

  //拖拽白条
  class Drag {
    constructor(obj) {
      this.obj = obj; //要拖拽的Dom元素
      this.startPointX = 0; //拖拽时，原来的位置
      this.startLeft = 0; //拖拽已经走过的距离
      this.percent = 0; //
    }

    //初始化
    init() {
      var This = this;
      this.obj.style.transform = `translateX(0px)`;
      this.obj.addEventListener("touchstart", function (ev) {
        //changeTouches触发当前事件的手指列表
        This.startPointX = ev.changedTouches[0].pageX; //取手指列表中的最新一个的pageX值
        This.startLeft = parseFloat(this.style.transform.split("(")[1]); //获取进度条和圆点的translate属性值，获得的是字符串，要转换成数字
        This.start && This.start(); //对外暴露方法
      });

      //推拽开始
      this.obj.addEventListener("touchmove", function (ev) {
        This.disPointX = ev.changedTouches[0].pageX - This.startPointX; //推拽距离
        var l = This.startLeft + This.disPointX; //原点要走的距离；

        if (l < 0) {
          l = 0;
        } else if (l > this.offsetParent.offsetWidth) {
          l = this.offsetParent.offsetWidth;
        }
        this.style.transform = `translateX(${l}px)`;

        //计算走的百分比
        This.percent = l / this.offsetParent.offsetWidth;
        This.move && This.move(This.percent);
        //当存在This.move方法时，执行This，move(This.percent),当This.move不存在时，不执行This.move(This.percent)
        console.log(ev);
        ev.preventDefault();
        //event.preventDefault();方法用于取消默认事件，但是不兼容IE，在IE下，要用event.returnValue=false;来处理。
      });

      //拖拽结束
      this.obj.addEventListener("touchend", function (ve) {
        This.end && This.end(This.percent);
      });
    }
  }

  //实例Progress方法
  function instanceProgress() {
    return new Progress();
  }
  //实例Drag方法
  function instanceDrag(obj) {
    return new Drag(obj);
  }

  //暴露接口
  root.progress = {
    pro: instanceProgress,
    drag: instanceDrag,
  };
})(window.player || (window.pageXOffsetlayer = {}));
