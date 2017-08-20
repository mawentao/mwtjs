define(function(require){
	/* 主区域 */
	var centerid,leftid,cubeInfo;	
	var tableid;
	var leftw = 210;


	function resizeLeftArea(width) {
		jQuery('#'+leftid).width(width);
		jQuery('#'+centerid).css({'left':width+'px'});
	};


	var o={};

	o.init=function(domid,_cubeInfo,_leftid){
		leftid = _leftid;
		centerid = domid;
		tableid = 'table-'+domid;
		cubeInfo = _cubeInfo;
		resizeLeftArea(leftw);  //!< 初始化左部区域宽度

		var code = '<div style="padding:5px 10px;height:35px;border-bottom:solid 1px #ccc;">'+
			'<div style="float:left;">'+
			  '<button id="cube-toggle-btn" class="mwt-btn mwt-btn-default mwt-btn-xs" style="padding:3px 5px 1px;">'+
				'<i class="icon icon-bar" style="padding:0;"></i>'+
			  '</button>'+'&nbsp;&nbsp;'+
			  '<button id="sobtn-'+domid+'" class="mwt-btn mwt-btn-primary mwt-btn-xs" style="padding:3px 10px 1px;">'+
				'<i class="sicon-magnifier"></i> 查询</button>'+
			'</div>'+
			'<div style="float:right;">'+
			  '<button id="expbtn-'+domid+'" class="mwt-btn mwt-btn-success mwt-btn-xs" style="padding:3px 10px 1px;">'+
				'<i class="sicon-cloud-download"></i> 导出到Excel</button>'+
			'</div>'+
		'</div>'+
		'<div id="tbbody-'+domid+'" class="fill" style="top:35px;bottom:31px;background:#eee;overflow:auto;border-top:solid 1px #aaa;border-bottom:1px solid #fff;border-left:solid 1px #aaa;"></div>'+
		'<div id="tbfoot-'+domid+'" class="fill" style="top:auto;height:30px;"></div>'+
		'<div id="loading-'+domid+'" class="box-loading" style="top:0"></div>';
		jQuery('#'+domid).html(code);

		// 折叠左部区域
		jQuery('#cube-toggle-btn').unbind('click').click(function(){
			var curw = jQuery('#'+leftid).width();
			var w = curw==0 ? leftw : 0;
			resizeLeftArea(w);
			if (w==0) jQuery('#'+leftid).hide();
			else jQuery('#'+leftid).show();
		});

		// 查询按钮
		jQuery('#sobtn-'+domid).unbind('click').click(function(){
			require('./area_left').query();
		});
		// 导出按钮
		jQuery('#expbtn-'+domid).unbind('click').click(function(){
			if (mwt.$(tableid)) {
				var fname = cubeInfo.cubename+'.xls';
				export_excel(tableid,fname);
			}
		});
	};

	
	return o;
});
