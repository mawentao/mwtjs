define(function(require){
	/* 顶部区域 */

	var o={};

	o.init=function(domid,cubeInfo) {
		var cubeid = cubeInfo.cubeid;
		// 编辑按钮
		var edita = '';
		if (cubeInfo.uid==dz.uid) {
			edita = '<a style="margin-left:16px;" class="adminbtn" href="#/db/cube_define~cubeid='+cubeid+'">[编辑]</a>';
		}
		// 初始化顶部区域
		var code = '<div class="tophead">'+
			'<i class="fa fa-cube gridi" style="padding-left:10px;color:#00BCD4;"></i> '+
			'<span style="font-size:13px;">'+cubeInfo.cubename+'</span>'+edita+
			'<span id="fav"></span>'+
			'<span class="dashboard-author" style="margin-right:10px;">'+
			  '作者：'+cubeInfo.username+'<img src="'+avatar(cubeInfo.uid)+'"/>'+
			'</span>'+
            '<span class="dashboard-view"><i class="icon icon-preview"></i>'+cubeInfo.views+'</span>'+
		'</div>';
		jQuery('#'+domid).html(code);
		// 收藏功能
		require('view/fav/page').button('fav', 1, cubeid, 'link');
	};

	return o;
});
