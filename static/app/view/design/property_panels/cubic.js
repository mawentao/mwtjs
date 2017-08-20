/*仪表板-属性面板-cubic配置*/
define(function(require){
	var data = require('../data');
	var cube = require('../../cube');
	var cubeid,cubeinfo;
	var cubicid,cubicinfo;

	function active_item(idx) {
		jQuery('[name="property-nav-item"]').removeClass("active");
		jQuery('[name="property-nav-item"]').eq(idx).addClass("active");
		jQuery('[name="property-tab-body"]').hide();
		jQuery('[name="property-tab-body"]').eq(idx).show();
	}

	var o={};
	// 加载某个控件的属性面板
	o.load=function(headid,bodyid,_cubeid,_cubicid){
		//1. head
		var code = '<ul class="mwt-nav mwt-nav-tabs mwt-nav-justify property-head-ul">'+
			'<li><a name="property-nav-item" href="javascript:;" data-idx="0">数据</a></li>'+
			'<li><a name="property-nav-item" href="javascript:;" data-idx="1">样式</a></li>'+
		'</ul>';
		jQuery('#'+headid).html(code);
		//2. body
		var code = '<div id="ptb0" name="property-tab-body" style="display:none;"></div>'+
			'<div id="ptb1" name="property-tab-body" style="display:none;"></div>';
		jQuery('#'+bodyid).html(code);
		//3. init sub panel
		require('./cubic-data').load('ptb0',_cubeid,_cubicid);
		require('./cubic-style').load('ptb1',_cubeid,_cubicid);
		//4. click event
		jQuery('[name="property-nav-item"]').unbind('click').click(function(){
			var idx=jQuery(this).data('idx');
			active_item(idx);
		});
		// 默认选中第一个tab
		active_item(0);
	};

	return o;
});
