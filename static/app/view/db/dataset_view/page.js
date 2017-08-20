define(function (require) {
	var tableInfo;
	var tableid,jLoading;
	var store,pagebar;

	// 显示表格
	function showTable(data) 
	{/*{{{*/
		// 无数据
		if (data.root.length==0) {
			var code = '<span style="color:gray;background:#fff;">查询结果为空</span>';
			jQuery('#'+tableid).html(code);
			return;
		}
		// 有数据
		var ths = [];
		var trs = [];
		for (var i=0;i<data.root.length;++i) {
			var cols = data.root[i];
			var tds = [];
			for (col in cols) {
				if (i==0) {
					ths.push("<th align='left'>"+col+"</th>");
				}
				tds.push("<td>"+cols[col]+"</td>");
			}
			trs.push('<tr>'+tds.join('')+'</tr>');
		}
		var code = '<table class="cubetab" id="'+tableid+'" border="1">'+
			'<thead><tr>'+ths.join('')+'</tr></thead>'+
			'<tbody>'+trs.join('')+'</tbody>'+
		'</table>';
		jQuery('#'+tableid).html(code);
		//mwt.popinit();
	}/*}}}*/

    var o = {};

    o.execute = function (domid,_tableInfo) {
		tableInfo = _tableInfo;
		// 初始化布局
		tableid = 'body-'+domid;
		var code = '<div id="'+tableid+'" class="fill" style="bottom:30px;background:#eee;overflow:auto;border-bottom:1px solid #fff;"></div>'+
			'<div id="foot-'+domid+'" class="fill" style="top:auto;height:30px;"></div>'+
			'<div id="loading-'+domid+'" class="box-loading" style="top:0"></div>';
		jQuery('#'+domid).html(code);
		jLoading = jQuery('#loading-'+domid);
		
		// store
		store = new MWT.Store({
      		url: ajax.getAjaxUrl('table&action=query_data'),
			beforeLoad: function(){jLoading.show();},
			afterLoad: function(){jLoading.hide();}
  		});
		pagebar = new MWT.Pagebar({
     		store  : store,
      		render : 'foot-'+domid,
			pageSizeList: [20,50,100,500,1000,2000,5000],
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
		o.query();
    };

	o.query=function() {
		store.baseParams = {
			tid: tableInfo['tid']
		};
		jLoading.show();
		pagebar.changePage(1);
	};

    return o;
});
