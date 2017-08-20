/* slice.js, (c) 2017 mawentao */
define(function(require){
	var dc=require('datacube');
	var ChartView = require('chartview/main');
	var domid,slice;

	// slice标题
	function get_title()
	{
		var code = '<div class="slice-title">'+slice.title+
			'<img src="source/plugin/datacube/template/static/logo.png">'+
		'</div>';
		return code;
	}

	// slice正文
	function get_content()
	{
		var content = slice.content ? '<div id="slice-content-'+domid+'">'+slice.content+'</div>' : '';
		var code = '<div class="slice-content">'+content+
			'<div id="slice-cube-'+domid+'" class="slice-cube"></div>'+
		'</div>';
		return code;
	}

	// cube
	function show_cube()
	{
		if (!slice.cube) {
			return;
		}
		var cubedomid = 'slice-cube-'+domid;
		//1. 调整位置
		var cubetop = jQuery('#slice-content-'+domid).height();
		if (!cubetop) cubetop=0;
		cubetop+=10;
		jQuery('#'+cubedomid).css({'top':cubetop+'px'});
		//2. show
		//////////////////////////////////////////
		// 老的报告兼容
		if (slice.cube.data.annex.y) {
			dc.create(cubedomid,slice.cube);
			return;
		}
		//////////////////////////////////////////
		var opts = slice.cube;
        opts['render']  = cubedomid;
        opts['cubeid']  = 0; 
        opts['cubicid'] = 0; 
        var cv = new ChartView(opts);
		cv.init();
	}

	var o={};

	o.init=function(_domid,_slice) {
		domid=_domid;
		slice=_slice;
		var code = get_title()+get_content();
		jQuery('#'+domid).html(code);
		show_cube();
	};

	return o;
});
