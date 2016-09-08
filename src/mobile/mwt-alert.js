/* mwt-alert.js, (c) 2016 mawentao */

/**
 * 替换window.confirm
 * opt的数据结构:
 * {
 *      top: 100,
 *      msg: '请确认',
 *      animate: 动画效果: bounceInDown, zoomIn, flipInX, rubberBand
 * }
 * callback: 回调函数     
 **/
MWT.confirm=function(opt,callback){
	var top = opt.top ? opt.top : 180;
	var msg = opt.msg ? opt.msg : opt;
	var animate = opt.animate ? opt.animate : 'zoomIn';
	var dialog = new MWT.H5Dialog({
		render: 'mwt-h5-confirm-div',
		top: top,
		animate: animate,
		body : msg,
		bodyStyle: 'padding:20px 10px 0;',
		buttons: [
            {label:"确定",cls:'primary',handler:function(){
				dialog.close();
				if (callback) {
					callback();
				}
			}},
			{label:"取消",type:'close'}
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
		animate: animate,
		body : code,
		bodyStyle: 'padding:20px 10px 0;',
		buttons: [
            {label:"确定",cls:'primary',handler:function(){
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

MWT.alert = function(opt,callback)
{
    if (!opt.msg) {opt = {msg:opt}; }
    var msgdiv = MWT.create_div('mwt-alert-div');
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
};

MWT.show_loading = function(opt) {
    if (!opt) opt = {msg:'数据加载中'};
    if (!opt.msg) {opt = {msg:opt}; }
    var code = '<div class="weui_loading_toast">'+
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
            '<p class="weui_toast_content">'+opt.msg+'</p>'+
        '</div>'+
      '</div>';
    var divid = MWT.create_div('loading-div');
    jQuery('#'+divid).html(code).fadeIn('fast');
};

MWT.hide_loading = function()
{
    jQuery('#loading-div').fadeOut('fast');
};
