
require('./sidebar.css');

/* 边栏, (c) 2016 mawentao */
MWT.SideBar = function(opt)
{
    this.listeners = {};
	var render = "";
    var coverid = '';
    var bodyid = '';
    var pagebody = "";
    var bodyStyle=null;
    var position = "left";   //!< left, right, top, bottom
    var width = '80%';
	var height = '100%';
    var animateIn = '';
    var animateOut = '';
    var cover = false;

    if (opt) {
        render = opt.render;
        if (opt.pagebody) pagebody=opt.pagebody;
        if (opt.bodyStyle) bodyStyle=opt.bodyStyle;
        if (opt.position) position=opt.position;
        if (opt.width) width=opt.width;
        if (opt.height) height=opt.height;
		if (opt.cover) cover=opt.cover;
    }

    // 创建
    this.create=function(){
        MWT.createDiv(render);
		// cover
		coverid = render+"-cover";
        bodyid = render+"-body";
		var code = '<div id="'+coverid+'" class="sidebar-cover"></div>';
        // body
        var style='';
		switch(position) {
			case 'left': style+='width:'+width+';'; animateIn='slideLeft'; animateOut="slideLeftOut"; break;
			case 'right': style+='width:'+width+';'; animateIn='slideRight'; animateOut="slideRightOut"; break;
			case 'top': style+='height:'+height+';'; animateIn='slideTop'; animateOut="slideTopOut"; break;
			case 'bottom': style+='height:'+height+';'; animateIn='slideBottom'; animateOut="slideBottomOut"; break;
		}
		if (position=='left' || position=='right') {
			style+='width:'+width+';';
		} else {
			style+='height:'+height+';';
		}
        if (bodyStyle) style+=bodyStyle;
        code += "<div id='"+bodyid+"' class='sidebar "+position+"' style='"+style+"'>"+pagebody+"</div>";
		var $html = code; //jQuery(code).addClass(animate);
		jQuery("#"+render).html($html);

        // event
        jQuery("#"+coverid).click(this.close);
        jQuery('#'+bodyid).on('animationend', function() {
            var jts = jQuery(this);
            if (jts.hasClass(animateOut)) jts.hide();
        });
    };

    // 打开
    this.open = function() {
        jQuery("#"+coverid).show();
        jQuery('#'+bodyid).removeClass(animateOut).addClass(animateIn).show();
        this.fire('open');
    };

    // 关闭
    this.close = function() {
        jQuery("#"+coverid).hide();
//        jQuery("#"+bodyid).fadeOut();
        jQuery('#'+bodyid).removeClass(animateIn).addClass(animateOut);
    };
};

MWT.extends(MWT.SideBar, MWT.Event);
