define(function(require){
	var tableInfo;

    var o = {};
	o.execute = function(domid,tid) {
		//1. 获取数据集信息
		ajax.post('t_datacube_table&action=get_info',{tid:tid},function(res){
			if (res.retcode!=0) {
				mwt.notify(res.retmsg,1500,'danger');
				window.location = '#/db/dataset';
			} else {
				tableInfo=res.data;
			}
		},true);
		if (!tableInfo) return;

		//2. 初始化
		var code = '<div id="info-'+domid+'"></div>'+
					'<div id="grid-'+domid+'"></div>';
		jQuery("#"+domid).html(code);

		require('./info_panel').init('info-'+domid,tableInfo);
		require('./columns_define').init('grid-'+domid,tableInfo);
	};
    return o;
});
