/**
 * 全局水印
 **/

require('./watermark.css');

// 显示全局水印
mwt.showWaterMark=function(text)
{/*{{{*/
    var domid = mwt.createDiv('watermark');
    var rows = Math.ceil(screen.height/150);
    var cols = Math.ceil(screen.width/250);
    var xgap = 250;
    var ygap = 150;
    var ls = []; 
    for (var i=0;i<rows;++i) {
        for (var j=0;j<cols;++j) {
            var x = 20 + j*xgap;
            var y = 20 + i*ygap;
            ls.push('<span style="left:'+x+'px;top:'+y+'px;">'+text+'</span>');
        }   
    }   
    jQuery('#'+domid).html(ls.join(''));
}/*}}}*/

