/**
 * 弹出层
 **/

require('./pop.css');

/**
 * 显示一个弹出层
 * anchor: 触发弹出的元素id
 * targetid: 弹出层domid
 * width: 弹出层宽度
 * height: 弹出层高度
 * popBackFun: 弹出后的回调函数
 **/
mwt.showPop=function(anchor,targetid,width,height,popBackFun)
{/*{{{*/
    if (!mwt.$(targetid)) {
        mwt.createDiv(targetid);
        var dom = mwt.$(targetid);
        dom.className = 'mwt-pop';
        dom.style.width = width+'px';
        dom.style.height = height+'px';
        // 弹出层截获点击事件
        jQuery('#'+targetid).unbind('click').click(function(event){
            event.stopPropagation();
        });
        // 点击非弹出区域,弹出层消失
        jQuery(document).on("click",function(){
            jQuery('#'+targetid).hide();
        });
    }
    var jPop = jQuery('#'+targetid);
    // locate
    // 获取触发dom的位置
    var andom = jQuery('#'+anchor);
    var anpos = andom.offset();
    var a = {
        x: anpos.left,      y:anpos.top,
        w: andom.width(),   h:andom.height()
    };
    var x=a.x;
    var y=a.y+a.h+2;
    // 越界判断
    var bodyWidth = document.documentElement.clientWidth;
    //var bodyHeight = document.documentElement.clientHeight;  //!< 可见区域高度
    var bodyHeight = document.documentElement.scrollHeight;    //!< 全文高度
    var style = {'top':y,'left':x};
    if (x+width>bodyWidth) {
        delete(style.left);
        style['right']=2;
    }
    if (y+height>bodyHeight) {
//console.log('y+height='+(y+height)+'; bodyHeight='+bodyHeight);
        style.top = (a.y-height-2);
    }
    // 显示
    jPop.css(style).show();
    event.stopPropagation();
    if (popBackFun)popBackFun(targetid);
}/*}}}*/

