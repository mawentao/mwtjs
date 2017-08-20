define(function(require){
    /* Cube展示(按通用报表格式显示) */
	var o={};

	o.execute=function(domid,cubeid) {
		//1. 获取cube详情(忽略上架状态)
		var cubeInfo;
		ajax.post('cubeschema&action=get_info',{cubeid:cubeid},function(res){
			if (res.retcode!=0) {
				jQuery('#'+domid).html(res.retmsg);
			} else {
				cubeInfo=res.data;
			}
		},true);
		if (!cubeInfo) {
			var msg = extmsg.warning('该Cube不存在或已删除');
			jQuery('#'+domid).html(msg);
			return;
		}
		require('view/cube').setCube(cubeid,cubeInfo);

		//2. 初始化页面布局
		var code = '<div id="top-'+domid+'"></div>'+
		  	'<div class="fill" style="top:39px;border-top:solid 1px #fff;">'+
			  '<div id="left-'+domid+'" style="position:absolute;left:0;top:0;bottom:0;width:200px;overflow-y:auto;"></div>'+
			  '<div id="center-'+domid+'" class="fill" style="left:200px;border-left:solid 1px #ccc;"></div>'+
			'</div>'+
		'</div>';
		
		jQuery('#'+domid).html(code);

		//3. 初始化各方区域
		require('./area_top').init('top-'+domid,cubeInfo);	
		require('./area_left').init('left-'+domid,cubeInfo);	
		require('./area_center').init('center-'+domid,cubeInfo,'left-'+domid);	
		require('./cube_query').init('center-'+domid,cubeInfo);
		require('./area_left').query();

		//4. pv
		require('./pv').execute(cubeInfo);

/*
		var edita = '';
		if (cubeInfo.uid==dz.uid) {
			edita = '<a style="margin-left:16px;" class="adminbtn" href="#/db/cube_define~cubeid='+cubeid+'">[编辑]</a>';
		}
		var code = '<div class="tophead">'+
				'<i class="fa fa-cube gridi" style="padding-left:10px;color:#00BCD4;"></i> '+
				'<span style="font-size:13px;">'+cubeInfo.cubename+'</span>'+edita+
            	'<span id="fav"></span>'+
				'<span class="dashboard-author" style="margin-right:10px;">'+
				  '作者：'+cubeInfo.username+'<img src="'+avatar(cubeInfo.uid)+'"/>'+
				'</span>'+
			'</div>'+
			'<div id="mart_cube_body_div" class="fill" style="top:39px;;overflow:auto;border-top:solid 1px #fff;"></div>';
		jQuery('#'+domid).html(code);
        require('view/fav/page').button('fav', 1, cubeid, 'link');

		require('./table_panel').init('mart_cube_body_div',cubeInfo);
		//require('view/cube').showInBox("mart_cube_body_div",cubeid);
*/
	};
	return o;
});
