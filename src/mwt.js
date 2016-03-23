var MWT={};
MWT.create_div = function(msgdivid) {
    var msgdiv = document.getElementById(msgdivid);
    if(!msgdiv) {
        var onediv = document.createElement('div');
        onediv.id=msgdivid;
        document.body.appendChild(onediv);
    }
    return msgdivid;
};
MWT.stop_loading = false;
MWT.loading_color = '#09C';
MWT.show_loading = function(progress)
{
    var divid = MWT.create_div('loading-div');
    var pid = 'loading-progress-span';
    if (!document.getElementById(pid)) {
        var code = "<span id='loading-progress-span' "+
            "style='top:0;left:0px;width:0%;height:2px;position:absolute;z-index:999;border-radius:2px;background-color:"+MWT.loading_color+";'></span>";
        jQuery("#"+divid).html(code);
	    jQuery("#"+divid).fadeIn('fast');
        MWT.stop_loading = false;
        progress = 0;
    } else {
        // 已经显示进度条了，再打开进度条直接过滤
        if (!progress) return;
    }
    // 进度条完成
    if (MWT.stop_loading) {
        jQuery('#loading-div').html('');
        return;
    }
    // 小于90模拟进度条加载
    if (progress<=90) {
		var p = Math.random()*100 % 6;
		progress += p;
		var curwidth = jQuery('#loading-progress-span').css('width');
		var data = { width: progress+"%" };
	    jQuery('#loading-progress-span').animate(data);
    }
	setTimeout(function(){
		MWT.show_loading(progress);
	}, 500);
};
MWT.hide_loading = function()
{
    var data = {width:"100%"};
	jQuery('#loading-progress-span').animate(data,function(){
	    jQuery("#loading-div").hide();
        MWT.stop_loading = true;
    });
};
MWT.flash_msg = function(msg, cls) {
    if(!msg) return;
    var msgdivid = MWT.create_div('mwt-flash-msg-div');
    var code="<div class='"+cls+"'>"+msg+"</div>";
    jQuery("#"+msgdivid).html(code);
    jQuery("#"+msgdivid).fadeIn("fast");
    setTimeout(function(){
        jQuery("#"+msgdivid).fadeOut("slow");
    },1500);
};
MWT.flash_danger = function(msg){ MWT.flash_msg(msg,"danger"); }
MWT.flash_warning = function(msg){ MWT.flash_msg(msg,"warning"); }
MWT.flash_info = function(msg){ MWT.flash_msg(msg,"info"); }
MWT.flash_success = function(msg){ MWT.flash_msg(msg,"success"); }
