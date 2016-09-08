/* H5Page的topbar or bottom bar （导航菜单） */
MWT.H5Navbar = function(opt)
{
    this.listeners = {};
	var render;
    var cls='';
    var style='';
    var items=[];
    var position='top';
    var height = 50;
	var bar;

    if (opt) {
        if (opt.render) render=opt.render;
        if (opt.style) style=opt.style;
        if (opt.position) position=opt.position;
        if (opt.height) height=opt.height;
        if (opt.cls) cls=opt.cls;
        if (opt.items) items=opt.items;
    }

    // 选中nav（idx从0开始）
    this.active = function(idx) {bar.active(idx);};

    // 获取bar的高度
    this.getHeight=function(){return height;}

    // 创建
    this.create=function(domid){
		if (domid) render = domid;
		if (!render) render = MWT.gen_domid('h5navbar-');
		MWT.create_div(render);
		jQuery("#"+render).addClass('mwt-h5bar')
                          .css(position,0)
                          .css({height:height});
		bar = new MWT.H5Bar({
			render: render,
			cls: cls,
			style: style,
			items: items
		});
		bar.create();
    };
};

MWT.extends(MWT.H5Navbar, MWT.Event);
