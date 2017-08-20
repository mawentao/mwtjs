define(function(require){
	var canvas=require('./canvas_panel');
	var data = require('./data');
	var property_panel = require('./property_panel');

	// 左边控件面板
	function init_left(domid){}
	// 右边控件面板
	function init_right(domid) {}
	// 中间主面板
	function init_center(domid) {
		var code = '<div class="head" id="design-head-bar"></div>'+
			'<div class="body" id="design-body" style="background:url('+dz.watermask_url+')">'+
			  '<div id="design-body-canvas" class="dashboard-canvas"></div>'+
			'</div>';
		jQuery('#'+domid).html(code);
		jQuery('#design-body').click(function(){
			require('./property_panel').load('board');
		});
		jQuery('#design-body-canvas').unbind('click').click(function(e){
			e.stopPropagation();	//!< 阻止事件穿透
		});
	}

    var o = {};
	o.execute = function(board) {
		data.set(board);
		//1. 初始化布局
		init_left('design_left');
		init_center('design_center');
		init_right('design_right');
		//2. 初始化顶部工具栏
		require('./top_panel').init('design-head-bar',board);
		data.setTitle(board.board_title);
		//3. 初始化设计器画布
		canvas.init(board);
		canvas.show_boxes(board.options);
		//4. 初始化属性面板
		property_panel.init();
	};
    return o;
});
