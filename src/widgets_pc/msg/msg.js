/**
 * 消息模块
 * author: mawentao 
 * create: 2013-07-12 15:33:14
 **/

require('./msg.css');

// 通知消息
mwt.notify=function(msg,timeout,cls)
{/*{{{*/
    var container=mwt.createDiv('mwt-notify-container');
    if(msg) {
        var divid=mwt.genId('mwt-notify-div-');
        if (!cls) cls='';
        var icon = '';
        switch(cls) {
            case 'info': icon='fa fa-info-circle';break;
            case 'warning': icon='fa fa-warning';break;
            case 'danger': icon='fa fa-times-circle';break;
            case 'success': icon='fa fa-check-circle';break;
            case 'loading': icon='fa fa-circle-o-notch fa-spin fa-3x fa-fw';break;
        }
        if(cls!='') icon = '<i class="'+icon+'"></i>';
        var code = '<div id="'+divid+'"><div class="mwt-notify '+cls+' zoomIn">'+icon+msg+'</div></div>';
        jQuery("#"+container).append(code);
        if (timeout>0) {
            setTimeout(function(){
                mwt.notify_destroy(divid);
            },timeout);
        }
        return divid;
    }
    return null;
};/*}}}*/

// 销毁消息
mwt.notify_destroy=function(divid) 
{/*{{{*/
    jQuery("#"+divid).fadeOut("slow");
    setTimeout(function(){
        mwt.destroy(divid);
    },2000);
};/*}}}*/


/* 警告消息(弹框) */
mwt.alert=function(msg,callback)
{/*{{{*/
    if (!msg) return;
    var msgdivid = MWT.createDiv('mwt-alert-msg-div');
    var msgct = msg.msg ? msg.msg : msg;
    var content = '<div style="padding:30px 40px;font-size:13px;">'+msgct+'</div>';
    jQuery("#"+msgdivid).html(content);
    var dialog = new mwt.Dialog({
        render  : 'mwt-alert-msg-div',
        title   : msg.title ? msg.title : "消息提示", 
        width   : 400,
        top     : msg.top ? msg.top : 50, 
        bodyStyle: 'max-height:450px',
        animate : msg.animate ? msg.animate : 'bounceInDown',
        buttons : [ 
            {"label":"确定",cls:'mwt-btn-primary',type:"close"}
        ]   
    }); 
    dialog.open();
    if (callback) dialog.on('close', callback);
};/*}}}*/

/* 确认框 */
mwt.confirm=function(msg,callfun)
{/*{{{*/
    if (!msg) return;
    var msgdivid = MWT.createDiv('mwt-confirm-msg-div');
    var msgct = msg.msg ? msg.msg : msg;
    var content = '<div style="padding:30px 40px;font-size:13px;font-family:\'microsoft yahei\';">'+msgct+'</div>';
    jQuery("#"+msgdivid).html(content);
    var dialog = new MWT.Dialog({
        render : 'mwt-confirm-msg-div',
        title  : msg.title ? msg.title : "请确认",
        width  : 400,
        top    : msg.top ? msg.top : 50, 
        bodyStyle: 'max-height:450px',
        animate : msg.animate ? msg.animate : 'bounceInDown',
        buttons  : [ 
            {"label":"取消",cls:'mwt-btn-default',handler:function(){dialog.close();callfun(false);}},
            {"label":"确认",cls:'mwt-btn-primary',handler:function(){dialog.close();callfun(true);}}
        ]   
    }); 
    dialog.open();
};/*}}}*/

/* 进度条 */
mwt.stop_progress = false;
mwt.progress_color = '#09C';
mwt.showProgress = function(progress)
{/*{{{*/
    var divid = MWT.createDiv('mwt-progress-div');
    var pid = 'loading-progress-span';
    if (!document.getElementById(pid)) {
        var code = "<span id='loading-progress-span' style='top:0;left:0px;width:0%;height:2px;position:fixed;z-index:999;border-radius:2px;background-color:"+mwt.progress_color+";'></span>";
        jQuery("#"+divid).html(code);
        jQuery("#"+divid).fadeIn('fast');
        MWT.stop_progress = false;
        progress = 0;
    } else {
        // 已经显示进度条了，再打开进度条直接过滤
        if (!progress) return;
    }
    // 进度条完成
    if (MWT.stop_progress) {
        jQuery('#'+divid).html('');
        return;
    }
    // 小于90模拟进度条加载
    if (progress<=90) {
        var p = Math.random()*100 % 6;
        progress += p;
        //var curwidth = jQuery('#loading-progress-span').css('width');
        var data = { width: progress+"%" };
        jQuery('#loading-progress-span').animate(data);
    }
    setTimeout(function(){
        MWT.showProgress(progress);
    }, 500);
};/*}}}*/
// 隐藏进度条
mwt.hideProgress = function()
{/*{{{*/
    var data = {width:"100%"};
    jQuery('#loading-progress-span').animate(data,function(){
        jQuery("#mwt-progress-div").hide();
        MWT.stop_progress = true;
    });
};/*}}}*/

