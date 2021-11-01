//索引值控制模块 ,这里是面向过程
(function (root) {
  function listControl(data, wrap) {
    var list = document.createElement("div");
    var dl = document.createElement("dl");
    var dt = document.createElement("dt");
    var close = document.createElement("div");
    musicList = []; //存储所有的歌曲对应的dom ，把这个数组暴露出去，就不需要再次获取了，外面可以直接用

    list.className = "list";
    close.className = "close";
    dt.innerHTML = "播放列表";
    close.innerHTML = "关闭";
    dl.appendChild(dt);

    data.forEach((item,index) => {
      var dd = document.createElement("dd");
      dd.innerHTML = item.name;
      dd.addEventListener('touchend',function () {
       changeSelect(index);
      })
      dl.appendChild(dd);
      musicList.push(dd);
    });

    list.appendChild(dl);
    list.appendChild(close);
    wrap.appendChild(list);

    var disY = list.offsetHeight;
    list.style.transform = `translateY(${disY}px)`;
    changeSelect();

    //展开
    function slideUp() {
      list.style.transition = ".2s";
      list.style.transform = "translateY(0)";
    }
    //收缩
    function slideDown() {
      list.style.transition = ".2s";
      list.style.transform = `translateY(${disY}px)`;
    }
    //关闭按钮
    close.addEventListener("touchend", slideDown);

    //切换选中元素
    function changeSelect(index=0) {
      for (let i = 0; i < musicList.length; i++) {
        musicList[i].className = "";
      }
      musicList[index].className = "active";
    }

    return {
      dom: list,
      musicList: musicList, //往外面暴露musicList
      slideUp: slideUp,
      slideDown: slideDown,
      changeSelect:changeSelect
    };
  }

  root.listControl = listControl; //把构造函数暴露出去，因为实例对象需要传参，所以实例对象不能暴露出去
})(window.player || (window.player = {}));


//能让模块自己干的事，就让模块自己干，尽量不要暴露太多方法给外面用，
//比如我要切歌，这个列表切歌模块自己就可以完成点击列表时切换index功能，不需要让index.js实现列表切歌将index传进来