define(function(require){
	/* cube_query.js, (c) 2017 mawentao */
	var chartutil = require('chartview/util');
	var tableid,jLoading,jBody,jFoot;
	var cubeInfo,store,pagebar;


	// 显示表格
	function showTable(data) 
	{/*{{{*/
		var headmap = data.annex.headmap;

		// head
		var dims = [];
		var dimCols = [];
		var metrics = [];
		var metricCols = []
		for (var k in headmap) {
			var im = headmap[k];
			if (im.dimkey) {
				dims.push(im);
				dimCols.push('<th align="left">'+im.dimname+help.get(im.dimdesc)+'</th>');
			} else {
				metrics.push(im);
				metricCols.push('<th align="right">'+im.mname+help.get(im.mdesc)+'</th>');
			}
		}
		var dimcol = dimCols.length==0 ? '' : '<th colspan="'+dimCols.length+'" class="tip">维度</th>';
		var metcol = metricCols.length==0 ? '' : '<th colspan="'+metricCols.length+'" class="tip">指标</th>';

		// body
		var cubeid = cubeInfo.cubeid;
		var trs = [];
		for (var i=0;i<data.root.length;++i) {
			var row = data.root[i];
			var tds = [];
			// 维度
			for (var k=0;k<dims.length;++k) {
				var dimInfo = dims[k];
				var dimkey = dimInfo.dimkey;
				var v = row[dimkey];
				if (dimInfo.dimtable=='date') {	//!< 日期维度
					v = '<label>'+v+'</label>';
				} else {
					v = chartutil.dimid2name(cubeid,dimkey,v);  //!< 维度ID转名称
				}
				tds.push('<td>'+v+'</td>');
			}
			// 指标
			for (var k=0;k<metrics.length;++k) {
				var metricInfo = metrics[k];
				var mkey = metricInfo.mkey;
				var v = metric_format(row[mkey],metricInfo.mformat);
				tds.push('<td align="right">'+v+'</td>');
			}
			trs.push('<tr>'+tds.join('')+'</tr>');
		}
		if (trs.length==0) {
			var n = dimCols.length+metricCols.length;
			trs.push('<tr><th colspan="'+n+'" align="center" height="100" style="color:gray;background:#fff;">查询结果为空</th></tr>');
		}

		var code = '<table class="cubetab" id="'+tableid+'">'+
			'<thead>'+
				'<tr>'+dimcol+metcol+'</tr>'+
				'<tr>'+dimCols.join('')+metricCols.join('')+'</tr>'+
			'</thead>'+
			'<tbody>'+trs.join('')+'</tbody>'+
		'</table>';
		jBody.html(code);
		mwt.popinit();
	}/*}}}*/


	var o={};
	o.init=function(domid,_cubeInfo) {
		cubeInfo=_cubeInfo;
		jLoading = jQuery('#loading-'+domid);
		jBody = jQuery('#tbbody-'+domid);
		jFoot = jQuery('#tbfoot-'+domid);
		tableid = 'table-'+domid;
		store = new MWT.Store({
      		url: ajax.getAjaxUrl('cubeapi&action=query_data'),
			beforeLoad: function(){jLoading.show();},
			afterLoad: function(){jLoading.hide();}
  		});
		pagebar = new MWT.Pagebar({
     		store  : store,
      		render : 'tbfoot-'+domid,
			pageSizeList: [20,50,100,500,1000],
			pageSize: 100
  		});
		store.on("load", function(){
            //异常处理
            var res = store.loadres;
            if (res.retcode!=0) {
		  		mwt.notify(res.retmsg,1500,'danger');
				return;
          	} 
          	showTable(res.data);
      	});
	};
	o.query=function(params) {
		store.baseParams = params;
		jLoading.show();
		setTimeout(function(){
			pagebar.changePage(1);
			
			/*
			ajax.post('cubeapi&action=query_data',params,function(res){
				jLoading.hide();
				if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
				else {
					showTable(res.data);
				}
			});*/
		},1000);
	};
	return o;
});
