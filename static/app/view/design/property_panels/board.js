/*仪表板-属性面板*/
define(function(require){
	var data = require('../data');
	var o={};
	// 加载某个控件的属性面板
	o.load=function(domid){
		var code = '<table class="property-tab">'+
			'<tr><th>标题</th></tr>'+
			'<tr><td><input type="text" class="form-control" id="title-'+domid+'" value="'+data.getTitle()+'"></td></tr>'+
			'<tr><td class="partition"><hr></td></tr>'+
		'</table>';
		jQuery('#'+domid).html(code);
		jQuery('#title-'+domid).unbind('input propertychange').bind('input propertychange',function(){
			var title = jQuery(this).val();
			data.setTitle(title);
			jQuery('#design-board-title').html('设计器 - '+title);
		});
	};
	return o;
});
