/* 滚动工具条 */
MWT.ScrollBar=function(opt)
{
	this.listeners={};
	var render=null;
	var items=[];
	var myswiper;
	var container,aname;
	if(opt){
        if(opt.render)render=opt.render;
        if(opt.items)items=opt.items;
        if(opt.style)style=opt.style;
		if(opt.cls)cls=opt.cls;
		aname=render+'-a';
		container=render+'-container';
    }

	// 创建
	this.create=function(){
		var thiso=this;
		var list = [];
		for (var i=0;i<items.length;++i) {
			var item=items[i];
			var width = item.width ? item.width : 50;
			var im = '<a class="swiper-slide mwt-scrollbar-a" href="javascript:;" name="'+aname+'" data-idx="'+i+'" '+
				'style="width:'+width+'px;">'+item.label+'</a>';
			list.push(im);
		}
		var code = '<div id="'+container+'" class="swiper-container" style="width:100%;">'+
				'<div class="swiper-wrapper">'+
				list.join('')+'</div></div>';
		jQuery("#"+render).html(code);
		jQuery('[name='+aname+']').click(function(){
			var idx = jQuery(this).data('idx');
			thiso.active(idx);
		});
		myswiper = new Swiper('#'+container,{
			slidesPerView: 'auto',
			spaceBetween: 0
		});
		//if (items.length>0) thiso.active(0);
	};

	// 
	this.active=function(idx) {
		//1. 滚动工具条,让当前项尽可能居中
		var si = idx-3;
		if (si<0) si=0;
		myswiper.slideTo(si);
		//2. active css
		jQuery('[name='+aname+']').removeClass('active');
		jQuery('[name='+aname+']:eq('+idx+')').addClass('active');
		//2. do handler
		var item = items[idx];
		if (item.handler) {
			item.handler(idx);
		}
	};
};
MWT.extends(MWT.ScrollBar,MWT.Event);
