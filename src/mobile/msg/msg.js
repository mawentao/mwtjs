/* msg.js, (c) 2016 mawentao */

require('./msg.css');

mwt.alert = function(opt,callback)
{/*{{{*/
    if (!opt.msg) {opt = {msg:opt}; }
    var msgdiv = MWT.createDiv('mwt-alert-div');
    var time = opt.time ? opt.time : 1500;
    var code = '<div class="weui_mask_transparent"></div>'+
        '<div class="weui_toast">'+
            '<i class="fa fa-exclamation-circle" style="margin:15px 0 0;font-size:60px;"></i>'+
            '<p class="weui_toast_content">'+opt.msg+'</p>'+
        '</div>';
    jQuery("#"+msgdiv).html(code);
    jQuery("#"+msgdiv).fadeIn("fast");
    setTimeout(function(){ 
        jQuery("#"+msgdiv).fadeOut("fast");
        if (callback) callback();
    },time);
};/*}}}*/

// 通知消息
mwt.notify=function(msg,timeout,cls)
{/*{{{*/
    var container=mwt.createDiv('mwt-notify-container-ss');
    if(msg) {
        var divid=mwt.genId('mwt-notify-div-');
        if (!cls) cls='';
        var icon = '';
        switch(cls) {
            case 'info': icon='fa fa-info-circle';break;
            case 'warning': icon='fa fa-warning';break;
            case 'danger': icon='fa fa-times-circle';break;
            case 'success': icon='fa fa-check-circle';break;
        }
//        if(cls!='') icon = '<i class="'+icon+'"></i>';
//        var code = '<div id="'+divid+'"><div class="mwt-notify '+cls+' zoomIn">'+icon+msg+'</div></div>';
        var code = '<div id="'+divid+'">'+
            '<div class="weui_mask_transparent"></div>'+
            '<div class="weui_toast">'+
              '<i class="'+icon+'" style="margin:20px 0 0;font-size:60px;"></i>'+
              '<p class="weui_toast_content">'+msg+'</p>'+
            '</div>'+
        '</div>';

        if (cls=='loading') {
            code = '<div class="weui_loading_toast" id="'+divid+'">'+
                '<div class="weui_mask_transparent"></div>'+
                '<div class="weui_toast">'+
                  '<div class="weui_loading">'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_0"></div>'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_1"></div>'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_2"></div>'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_3"></div>'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_4"></div>'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_5"></div>'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_6"></div>'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_7"></div>'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_8"></div>'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_9"></div>'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_10"></div>'+ 
                    '<div class="weui_loading_leaf weui_loading_leaf_11"></div>'+
                  '</div>'+
                  '<p class="weui_toast_content">'+msg+'</p>'+
                '</div>'+
            '</div>';
        }

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

// 全屏信息
mwt.info = function(msg,callback)
{/*{{{*/
    if (!msg) return;
    var msgdivid = MWT.createDiv('mwt-info-msg-div');
    var msgct = msg.msg ? msg.msg : msg;
    var content = '<div style="padding:30px 40px;font-size:13px;">'+msgct+'</div>';
    jQuery("#"+msgdivid).html(content).css({'z-index':9999});
    var dialog = new mwt.Dialog({
        render  : 'mwt-info-msg-div',
        title   : msg.title ? msg.title : "消息提示", 
        fullscreen: true,
        animate : msg.animate ? msg.animate : 'bounceInDown'
    }); 
    dialog.open();
    if (callback) dialog.on('close', callback);
};/*}}}*/


/**
 * 替换window.confirm
 * opt的数据结构:
 * {
 *      msg: '请确认',
 * }
 * callback: 回调函数     
 **/
MWT.confirm=function(opt,callback){
	var msg = opt.msg ? opt.msg : opt;
	var dialog = new MWT.Dialog({
		render     : 'mwt-h5-confirm-div',
		animate    : 'zoomIn',
		title      : '<span style="font-size:15px;">请确认</span>',
		fullscreen : true,
		style      : 'left:20px;right:20px;top:30%;bottom:auto;',
		bodyStyle  : 'padding:20px 10px 0;',
		body       : msg,
		buttonStyle: 'mobile',
		buttons: [
            {label:"确定",style:'color:#0BB20C',handler:function(){dialog.close();callback(true);}},
			{label:"取消",handler:function(){dialog.close();callback(false);}}
		]
	});
	dialog.open();
};

/**
 * 替换window.prompt
 * opt的数据结构:
 * {
 *      top: 100,
 *      title: '标题',
 *      multiLine: true or false
 *      animate: 动画效果: bounceInDown, zoomIn, flipInX, rubberBand
 * }
 * callback: 回调函数     
 **/
MWT.prompt=function(opt,callback){
	var top = opt.top ? opt.top : 180;
	var title = opt.title ? opt.title : null;
	var multiLine = opt.multiLine ? true : false;
	var animate = opt.animate ? opt.animate : 'flipInX';
	var code = '<input id="mwt-h5-prompt-txt" type="text" class="form-control" style="width:100%;">';
	if (multiLine) {
		code = '<textarea id="mwt-h5-prompt-txt" class="form-control" style="width:100%;height:100px;"></textarea>';
	}
	var dialog = new MWT.H5Dialog({
		render: 'mwt-h5-prompt-div',
		top: top,
		title: title,
		style: 'left:20px;right:20px;',
		animate: animate,
		body : code,
		bodyStyle: 'padding:20px 10px 0;',
		buttons: [
            {label:"确定",cls:'mwt-btn mwt-btn-primary',handler:function(){
				var v=get_text_value("mwt-h5-prompt-txt");
				dialog.close();
				if (callback) {
					callback(v);
				}
			}},
			{label:"取消",type:'close'}
		]
	});
	dialog.on("open",function(){
		jQuery("#mwt-h5-prompt-txt").val('').focus();
	});
	dialog.open();
};


MWT.toast = function(opt,callback){
    if (!opt.msg) {opt = {msg:opt}; }
    var time = opt.time ? opt.time : 1500;
    var msgdiv = MWT.create_div('mwt-toast-div');
    var code = '<div class="weui_mask_transparent"></div>'+
        '<div class="weui_toast">'+
            '<i class="weui_icon_toast"></i>'+
            '<p class="weui_toast_content">'+opt.msg+'</p>'+
        '</div>';
    jQuery("#"+msgdiv).html(code);
    jQuery("#"+msgdiv).fadeIn("fast");
    setTimeout(function(){ 
        jQuery("#"+msgdiv).fadeOut("fast");
        if (callback) callback();
    },time);
};
