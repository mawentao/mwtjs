define(function(require){

/* 视图组件选择器 */
function CubicViewSelect(opt)
{
	var thiso=this;
	var render;
	var vsname;
	if (opt) {
		if (opt.render) render=opt.render;
		vsname = render+'-cvico';
	}

	

	// 初始化
	this.init=function() {
		var cubeviewmap = dict.get_cube_view_map();
		var list = [];
		for (var i in cubeviewmap) {
			var im = cubeviewmap[i];
			var cls = 'cvico';
			var help = im.cvname+'<br>'+im.cvdesc;  //!< 组件的帮助说明
			var code = '<li><i id="'+vsname+i+'" name="'+vsname+'" class="'+im.cvicon+' '+cls+'" data-cvid="'+im.cvid+'" '+
				'pop-title="'+help+'" pop-cls="mwt-popover-danger"></i></li>';
			list.push(code);
		}
		var code='<ul style="display:block;">'+list.join('')+'</ul>';
		jQuery('#'+render).html(code);
		mwt.popinit(); 
		// 视图组件选择按钮
		jQuery('[name='+vsname+']').unbind('click').click(function(){
			var cvid = jQuery(this).data('cvid');
			thiso.activeView(cvid);
			thiso.fire('change');
		});
	};

	// 禁用视图组件
	this.disableView=function(cvid) 
	{/*{{{*/
		var jom = jQuery('#'+vsname+cvid);
		if (jom.hasClass('cvico-disable')) return;
		jom.removeClass('cvico').removeClass('active').addClass('cvico-disable');
	}/*}}}*/

	// 启用视图组件
	this.enableView=function(cvid) 
	{/*{{{*/
		var jom = jQuery('#'+vsname+cvid);
		if (jom.hasClass('cvico')) return;
		jom.removeClass('cvico-disable').addClass('cvico');
	}/*}}}*/

	// 选中视图组件
	this.activeView=function(cvid) 
	{/*{{{*/
		var jom = jQuery('#'+vsname+cvid);
		if (jom.hasClass('active')) return;
		jQuery('[name='+vsname+']').removeClass('active');
		jom.addClass('active');
	}/*}}}*/

	// 获取选择的视图组件ID
	this.getActiveViewId=function() 
	{/*{{{*/
		var cvid='';
		jQuery('[name='+vsname+']').each(function(){
			var jom = jQuery(this);
			if (jom.hasClass('active') && !jom.hasClass('cvico-disable')) {
				cvid = jom.data('cvid');
			}
		});
		return cvid;
	};/*}}}*/
};

MWT.extends(CubicViewSelect, MWT.Event);

return CubicViewSelect;
});
