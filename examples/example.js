document.write('<link rel="stylesheet" type="text/css" href="../static/highlight/styles/atelier-estuary-light.css"/>');
document.write('<script language="javascript" src="../static/highlight/highlight.min.js"><\/script>');

// 渲染code
function initCode()
{
    jQuery("code").each(function(){
        var c = jQuery(this).html();
        c = c.trim();
        c = c.replace(/</g,'&lt;');
        c = c.replace(/>/g,'&gt;');
        c = c.replace(/ /g,'&nbsp;');
        c = c.replace(/\n/g,'<br>');
        jQuery(this).html(c);
    });
    hljs.initHighlightingOnLoad();

    backTop();
}

// 回到顶部
function backTop()
{
    var backid = "backtop-div";
    mwt.showFloatDiv(backid,-10,-10,40,40,true,'mwt-btn mwt-btn-default radius');
    var code = '<i class="icon icon-insert"></i>';
    jQuery('#'+backid).html(code).unbind('click').click(function(){
        scroll(0,0);
    });
}

// 获取供demo演示的内存数据代理
function getDemoMemoryProxy()
{
    var list = [];
    var proxy = new mwt.HttpProxy({
        url    : "../data/list.txt",
        method : 'GET',
        async  : false,  //!< 同步请求
    });
    proxy.load({},function(data){
        list = data;
    });
    var memoryProxy = new mwt.MemoryProxy({
        data: list
    });
    return memoryProxy;
}
