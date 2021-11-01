//渲染模块功能：图片信息，音乐信息，是否喜欢

//前面加分号是防止多个模块在压缩的时候，前面模块可能没有结束符号；，导致两个模块年连在一起，执行出错
(function (root) {
  //渲染图片
  function renderImg(src) {
    root.blurImg(src); //给body添加背景图片
    var img = document.querySelector(".songImg img");
    img.src = src;
  }
  //渲染音乐信息
  function renderInfo(data) {
    var songInfoChildren = document.querySelector(".songInfo").children;
    songInfoChildren[0].innerHTML = data.name;
    songInfoChildren[1].innerHTML = data.singer;
    songInfoChildren[2].innerHTML = data.album;
  }

  //渲染是否喜欢
  function renderIsLike(isLike) {
    var lis = document.querySelectorAll(".control li");
    lis[0].className = isLike ? "liking" : "";
  }

  /**
   *导出接口
   * @param {*} data  data为请求过来的数据，必须要给
   * 当用户使用这个方法的时候，三个渲染都调用一下
   */
  root.render = function (data) {
    renderImg(data.image);
    renderIsLike(data.isLike);
    renderInfo(data);
  };
})(window.player || (window.player = {}));

//把window当作参数传进去然后在里面定义参数的属性为这个函数的方法，而不是直接放在函数里面定义window的属性的意义在于，我每次执行这个函数时，我只需要在参数里面找参数的属性，而不需要在window里找属性，window里的属性实在太多了，这样子能优化性能，提高效率
//当window.player有的时候就是window.player,没有的额话就是一个空对象
