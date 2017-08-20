define(function(require){
	/* cubic */
	var cubedata = require('view/cube');
	var ChartView = require('chartview/main');
	var cubicViewMap = {};

	var o={};

	// 初始化
	o.init=function() {
		cubicViewMap = {};
	};

	// 获取cubic视图实例
	o.getCubicView=function(cubicid) {return cubicViewMap[cubicid]};

	// 在box中显示cubic
	o.showInBox=function(boxdomid,cubeid,cubicid,reload){
		if (!cubicViewMap[cubicid] || reload) {
			var opts = {
				render  : boxdomid,
				cubeid  : cubeid,
				cubicid : cubicid,
				cvid    : 'ChartTable'
			};
			var cubicInfo = cubedata.getCubic(cubicid);
			if (cubicInfo && cubicInfo.cvid!='') {
				opts.cvid = cubicInfo.cvid;
			}
			var cv = new ChartView(opts);
			cubicViewMap[cubicid] = cv;
			cv.init();
            cv.on('change', function(e){
                var data = e.changeData;
                for(var index in cubicViewMap){
                    cubicViewMap[index].filterAssoc(data);
                }
            });
		} else {
			//!< 只重新渲染数据显示
			cubicViewMap[cubicid].showTitle();
			cubicViewMap[cubicid].showData();
		}
	};


	return o;
});
