/* cube.js, (c) 2017 mawentao */
define(function(require){
	var dc = require('datacube');   //!< cube组件工厂
	var ChartView=require('chartview/main');   //!< cube视图组件
	var cubemap = {};		//!< cube详情
	var cubicmap = {};		//!< cubic详情
    var cubicViewMap = {};

	var o = {};

	// 设置cube
	o.setCube=function(cubeid,cubeInfo){
		cubemap[cubeid]=cubeInfo;
	};

	// 获取cube详情
	o.getCube=function(cubeid) {
		if (!cubemap[cubeid]) {
			ajax.post('cubeschema&action=get_info',{cubeid:cubeid},function(res){
				if (res.retcode!=0) {
					cubemap[cubeid] = res.retmsg;
				} else {
					cubemap[cubeid] = res.data;
				}
			},true);
		}
		return cubemap[cubeid];
	};

	// 获取cubic详情
	o.getCubic=function(cubicid) {
		if (!cubicmap[cubicid]) {
			ajax.post('t_datacube_board_cubic&action=get_info',{cubicid:cubicid},function(res){
				if (res.retcode!=0) {
					cubicmap[cubicid] = res.retmsg;
				} else {
					cubicmap[cubicid] = res.data;
				}
			},true);
		}
		return cubicmap[cubicid];
	};

	// 在box中显示cube
	o.showInBox=function(boxdomid,cubeid,cubicid){
		var cubeInfo = o.getCube(cubeid);
		// 未获取到cube详情
		if (!cubeInfo.cubename) {
			jQuery('#'+boxdomid).html('<span class="empty">cube不存在或已删除</span>');
			return;
		}
		// 创建cube可视化组件
		cubeInfo.cubicid = cubicid;
		//////////////////////////////////////////
		// cvid从cube移到cubic
		if (cubicid!=0) {
			var cubicInfo = o.getCubic(cubicid);
			if (cubicInfo && cubicInfo.cvid!='') {
				cubeInfo.cvid = cubicInfo.cvid;
			}
		}
		//////////////////////////////////////////
		//dc.create(boxdomid,cubeInfo);

		// 重构后的视图组件
		cubeInfo.render = boxdomid;
		var cv = new ChartView(cubeInfo);
        cubicViewMap[cubicid] = cv;
        cv.init();
        cv.on('change', function(e){
            var data = e.changeData;
            for(var index in cubicViewMap){
            	cubicViewMap[index].filterAssoc(data);
			}
        });
	};

	return o;
});
