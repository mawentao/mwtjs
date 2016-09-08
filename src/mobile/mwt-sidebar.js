/* 侧边栏, (c) 2016 mawentao */
MWT.SideBar = function(opt)
{
    this.listeners = {};
	var render = "";
    var coverid = '';
    var pagebody = "";
    var bodyStyle=null;
    var position = "left";   //!< left or right
    var width = '80%';

    if (opt) {
        render = opt.render;
        if (opt.pagebody) pagebody=opt.pagebody;
        if (opt.bodyStyle) bodyStyle=opt.bodyStyle;
        if (opt.position) position=opt.position;
        if (opt.width) width=opt.width;
    }

    // 创建
    this.create=function(){
        MWT.create_div(render);
        coverid = render+"-cover";
        var code = '<div id="'+coverid+'" class="sidebar-cover"></div>';

        // body
        var style = 'width:'+width+';';
        style += position=='left' ? "left:0;" : "right:0;";
        if (bodyStyle) style+=bodyStyle;
        code += "<div class='sidebar' style='"+style+"'>"+pagebody+"</div>";
        
        // animate
        var animate = position=='left' ? 'slideLeft' : 'slideRight';
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
        var am = position=='left' ? 'slideLeftOut' : 'slideRightOut';
		jQuery("#"+render+">div").addClass(am).on('animationend', function () {
            jQuery("#"+render).remove();
        }).on('webkitAnimationEnd', function () {
            jQuery("#"+render).remove();
        });
    };
};

MWT.extends(MWT.SideBar, MWT.Event);
