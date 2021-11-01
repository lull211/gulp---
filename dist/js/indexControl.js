//索引值控制模块
(function (root) {
 class Index {
  constructor(len) {
   this.index = 0;
   this.len = len;
   this.indexObj=null //索引值对象 
  }

  //取上一个索引
  prev() {
   return this.get(-1);
  }

  //取下一个索引
  next() {
   return this.get(1);
  }

  //get,参数为+1 ，或-1
  get(val) {
    this.index = (this.index + val + this.len) % this.len;
    //当index=0,val= -1,时左边超出，(this.index + val + this.len)=len-1 (len-1)%len =len-1
    //当index=len-1 ,val=+1,时，右边超出，(this.index + val + this.len)=len*2 ,(len*2)%len=0;

    return this.index;
  }
 }
 root.controlIndex=Index; //把构造函数暴露出去，因为实例对象需要传参，所以实例对象不能暴露出去
})(window.player || (window.player = {})); //括号提升优先级，等号优先级比||高
