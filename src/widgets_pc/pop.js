/**
 * 对含pop-title属性的元素做pop初始化
 * id: 元素的domid,若为null,则初始化所有含pop-title属性的元素
 **/

require('./pop.css');

mwt.popinit=function(domid) {
	// 显示弹框(每次弹框都会重新定位)
	function popshow(anchor,popid) {
		var jom=jQuery('#'+popid);
		jom.css('display','block');
		// locate
		var andom = jQuery('#'+anchor);
        var anpos = andom.offset();
        var antop = anpos.top;
        var anleft = anpos.left;
        var anwidth = andom.outerWidth();
//        var anheight = andom.outerHeight();

        var width = jom.outerWidth();
        var height = jom.outerHeight()+11;
        var top= antop-height;
        var left= anleft+(0.5*(anwidth-width));
        jom.css({top:top,left:left});
	}
	// 初始化一个元素
	function popinit(jdm) {
		//1. 获取dom元素ID,如果没有设置,随机生成一个id
		if (!jdm.is('[id]')) {
			var id = mwt.genId('pop');
			jdm.attr('id',id);
		}
		var anchor = jdm.attr('id');
		//2. 创建popdiv
		var popdivid = anchor+'-popdiv';
		mwt.createDiv(popdivid);
		var dom=mwt.$(popdivid);
		var cls = "mwt-popover top";
		// 若设置了cls
		if (jdm.is('[pop-cls]')) { cls += ' '+jdm.attr('pop-cls'); }
		dom.className = cls;
		var code = '<div class="arrow"></div>'+
			'<div class="content">'+jdm.attr('pop-title')+'</div>';
		dom.innerHTML=code;
		//3. 绑定事件
		jdm.unbind('mouseover').mouseover(function(){
			popshow(anchor,popdivid);
		});
		jdm.unbind('mouseout').mouseout(function(){
			jQuery('#'+popdivid).hide();
		});
	}
	// 初始化一个或多个元素
	if (domid) popinit(jQuery('#'+domid));
	else {
		jQuery('[pop-title]').each(function(){
			popinit(jQuery(this));
		});
	}
};


/* 弹出框 */
MWT.Popover=function(opt)
{
    this.listeners={};
    var anchor;
    var html='';
    var cls='';
    var domid;
    var mode=0;
    if(opt){
        if(opt.anchor)anchor=opt.anchor;
        if(opt.html) html=opt.html;
        if(opt.cls) cls=opt.cls;
    }
    function create() {
        domid=MWT.genId(anchor+'-');
        MWT.createDiv(domid);
        var dom=MWT.$(domid);
        dom.className = "mwt-popover top "+cls;
        dom.innerHTML='<div class="arrow"></div><div class="content">'+html+'</div>';
    };
    this.setHtml = function(c) {
        jQuery("#"+domid+" .content").html(c);
    };
    this.toggle = function() {
        if(mode==0) this.pop();
        else this.hide();
    };
    this.pop = function() {
        if (!domid) create();
        var jom=jQuery('#'+domid);
        jom.show();
        locate();
        mode^=1;
    };
    this.hide = function() {
        jQuery('#'+domid).fadeOut('fast');
        mode^=1;
    };
    function locate() {
        var andom = jQuery('#'+anchor);
        var anpos = andom.offset();
        var antop = anpos.top;
        var anleft = anpos.left;
        var anwidth = andom.outerWidth();
        var anheight = andom.outerHeight();
        var dom = jQuery('#'+domid);
        var width = dom.outerWidth();
        var height = dom.outerHeight()+11;
        var top= antop-height;
        var left= anleft+(0.5*(anwidth-width));
        //if (top<0) top=antop+anheight;
        dom.css({top:top,left:left});
    };
};
MWT.extends(MWT.Popover, MWT.Event);


