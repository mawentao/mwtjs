/* info_panel.js, (c) 2017 mawentao */
define(function(require){ 
	var domid,tableInfo;
	var o={};

	o.init=function(_domid,_tableInfo){
		domid=_domid;
		tableInfo=_tableInfo;
		var code = '<table class="tb2">'+
            '<tr><td colspan="15" class="partition">数据表信息</td></tr>'+
            '<tr><td width="100">数据表</td>'+
              '<td width="350">'+
				'<input type="text" class="form-control" id="tname" readonly value="'+tableInfo.tname+'" style="background:#eee;"></td>'+
              '<td class="tips2">数据表名,此项不能修改</td></tr>'+
            '<tr><td>数据表名称</td>'+
              '<td><input type="text" id="tcomment-'+domid+'" class="form-control" value="'+tableInfo.tcomment+'"></td>'+
              '<td class="tips2">显示名称</td></tr>'+
            '<tr><td colspan="15" style="border-bottom:none;">'+
              '<button id="savebtn-'+domid+'" class="mwt-btn mwt-btn-xs mwt-btn-primary radius" style="padding: 2px 20px;">保存</td></tr>'+
          '</table>';
		jQuery("#"+domid).html(code);
		// 保存数据集基础信息
		jQuery('#savebtn-'+domid).unbind('click').click(save);
	};

	// 保存数据集基础信息
	function save() 
	{
		var params = {
			tid: tableInfo.tid,
			tcomment: dz_post_encode(jQuery('#tcomment-'+domid).val())
		};
		ajax.post('t_datacube_table&action=save_info',params,function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				mwt.notify('已保存',1500,'success');
			}
		});
	}

	return o;
});
