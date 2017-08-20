/**
 * 核心类,提供MWT全局函数
 **/

// 获取指定ID的dom元素
mwt.$=function(id){return document.getElementById(id);};

// 销毁指定ID的dom元素
mwt.destroy=function(id){
    var dom=mwt.$(id);
    if(dom)dom.remove();
};

// ID生成器(随机生成一个6位长度的id，且document中没有此id的dom元素)
mwt.genid=function(prefix) 
{/*{{{*/
	function randstr(n) {
        var x="0123456789qwertyuioplkjhgfdsazxcvbnmABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var tmp="";
        for(var i=0;i<n;i++)  {
            tmp += x.charAt(Math.ceil(Math.random()*100000000)%x.length);
        }   
        return tmp;
    }   
    var len = 6;
    while (true) {
        var id = prefix ? prefix+randstr(len) : randstr(len);
        if (!mwt.$(id)) {
            return id; 
        }   
    }
};/*}}}*/

// 创建一个DIV
mwt.createDiv=function(divid)
{/*{{{*/
    if (!mwt.$(divid)) {
        var onediv = document.createElement('div');
        onediv.id=divid;
        document.body.appendChild(onediv);
    }   
}/*}}}*/

// 显示浮层
mwt.showFloatDiv=function(divid,x,y,w,h,fixed)
{
    if (!mwt.$(divid)) {
        mwt.createDiv(divid);
    }
    var pos = fixed ? 'fixed' : 'absolute';
    var xn = x<0 ? 'right' : 'left';
    var yn = y<0 ? 'bottom' : 'top';
    x = Math.abs(x);
    y = Math.abs(y);
    jQuery('#'+divid).css({position:pos,'z-index':9527,width:w+'px',height:h+'px'})
                     .css(xn,x+'px').css(yn,y+'px');
};



