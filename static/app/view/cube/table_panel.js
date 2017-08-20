define(function(require){
	/* 以通用报表格式显示Cube */
	var cubeInfo;
	var o={};

	o.init=function(domid,_cubeInfo) {
		cubeInfo=_cubeInfo;



		var code = '指标';
/*            '<div id="dt-bar-div"></div>'+
            '<div class="mwt-bar" style="background:#fff;border:none;padding:0px 10px;" id="filter-div"><table><tr>'+
              '<td valign="top"><label class="didi-label" style="margin:6px 1px;">维度:</label></td>'+
              '<td width="100%"><div id="filterlist-div" style="background:#f2f2f2;width:100%;padding:0px;"></div></td>'+
            '</tr></table></div>'+
            '<div id="btn-bar-div"></div>'+
            '<div id="grid-div" class="mwt-grid" style="margin-top:10px;border-width:0 1px;"></div>'+
            '<div id="page-bar-div"></div>';*/
		jQuery('#'+domid).html(code);
	};

	return o;
});
