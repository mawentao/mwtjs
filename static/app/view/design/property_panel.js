/*属性面板*/
define(function(require){
	var o={};
	o.init=function() {
		var code = '<div id="property-panel-head" class="head"></div>'+
			'<div id="property-panel-body" class="body">aa</div>';
		jQuery('#design_right').html(code);

		o.load('board');
	};
	// 加载某个控件的属性面板
	o.load=function(component){
		var headid = 'property-panel-head';
		var bodyid = 'property-panel-body';
		// 主面板
		if (component=='board') {
			jQuery('#'+headid).html('画布');
			require('./property_panels/board').load(bodyid);
		}
		// cubic配置面板
		if (component.cubicid) {
			require('./property_panels/cubic').load(headid,bodyid,component.cubeid,component.cubicid);
		}
	};
	return o;
});
