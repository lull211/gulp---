//加载音乐模块：加载音乐，暂停音乐，播放音乐

(function (root) {
  class AudioManage {
    constructor() {
      this.audio = new Audio(); //创建一个audio实例
      this.status = "pause"; //歌曲状态默认为暂停
    }

    //加载音乐
    load(src) {
      this.audio.src = src; //设置音乐路径
      this.audio.load(); //audio对象身上的方法load（）加载
    }
    //播放音乐
    play() {
      this.audio.play();
      this.status = "play";
    }
    //暂停音乐
    pause() {
      this.audio.pause();
      this.status = "pause";
    }

    //音乐播放完成事件
    end(fn) {
      this.audio.onended = fn;
    }
    //跳到音乐的某个时间点
    playTo(time) {
      this.audio.currentTime = time; //单位为秒；
    }
  }
  root.music = new AudioManage();   //把实例对象暴露出去，可以直接使用实例上面的方法
})(window.player || (window.player = {}));
