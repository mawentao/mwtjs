/* 边栏, (c) 2016 mawentao */
MWT.SideBar = function(opt)
{
    this.listeners = {};
	var render = "";
    var coverid = '';
    var pagebody = "";
    var bodyStyle=null;
    var position = "left";   //!< left, right, top, bottom
    var width = '80%';
	var height = '100%';
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
        MWT.create_div(render);
		// cover
		coverid = render+"-cover";
		var background = cover ? 'rgba(0,0,0,0.5)' : 'none';
		var code = '<div id="'+coverid+'" class="sidebar-cover" style="background:'+background+'"></div>';
        // body
        var style='';
		var animate='';
		switch(position) {
			case 'left': style+='width:'+width+';'; animate='slideLeft'; break;
			case 'right': style+='width:'+width+';'; animate='slideRight'; break;
			case 'top': style+='height:'+height+';'; animate='slideTop'; break;
			case 'bottom': style+='height:'+height+';'; animate='slideBottom'; break;
		}
		if (position=='left' || position=='right') {
			style+='width:'+width+';';
		} else {
			style+='height:'+height+';';
		}
        if (bodyStyle) style+=bodyStyle;
        code += "<div class='sidebar "+position+"' style='"+style+"'>"+pagebody+"</div>";
		var $html = jQuery(code).addClass(animate);
		jQuery("#"+render).html($html);

        // event
        jQuery("#"+coverid).click(this.close);
    };

    // 打开
    this.open = function() {
        this.create();
        jQuery("#"+coverid).show();
        this.fire('open');
    };

    // 关闭
    this.close = function() {
        jQuery("#"+coverid).hide();
		var am = '';
		switch(position) {
			case 'left': am='slideLeftOut'; break;
			case 'right': am='slideRightOut'; break;
			case 'top': am='slideTopOut'; break;
			case 'bottom': am='slideBottomOut'; break;
		};
		jQuery("#"+render+">div").addClass(am).on('animationend', function () {
            jQuery("#"+render).remove();
        }).on('webkitAnimationEnd', function () {
            jQuery("#"+render).remove();
        });
    };
};

MWT.extends(MWT.SideBar, MWT.Event);
