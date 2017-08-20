/* jappengine.js, (c) 2016 mawentao */
/* 全局变量 */
var conf={loglevel:3};
var ajax,log,help,dict,btn,extmsg,copyright;

/* ---------------- store加载消息 ---------------- */
var loadingdivid;
function store_before_load(){loadingdivid=mwt.notify("数据加载中...",10000,'loading');
	jQuery('body').css('cursor','wait');
}
function store_after_load(){mwt.notify_destroy(loadingdivid);
	jQuery('body').css('cursor','');
}

/* JappEngine */
define(function(require){
	ajax=require('core/ajax');			//!< ajax
	log=require('core/log');			//!< log
	help=require('core/help');			//!< 帮助信息
/*	dict=require('common/dict');		//!< 字典
	btn=require('common/btn');			//!< 统一按钮
	extmsg=require('common/extmsg');	//!< 异常信息
	copyright=require('common/copyright'); //!< 底部版权信息
	require('design/design');     //!< 设计器画布*/

	var urlmap=require('core/urlmap');

	// 注册controller配置(所有controller必须在此配置)
	var controllerConfs = [
/*		require('controller/mart').conf,	//!< 集市
		require('controller/opus').conf,	//!< 作品
		require('controller/design').conf,	//!< 定制(设计器)
		require('controller/bi').conf,		//!< BI(仪表板视图)
		require('controller/db').conf,		//!< 数据
		require('controller/help').conf,*/
        
		require('controller/example').conf,	//!< example
		require('controller/index').conf
	];

	var o={};
	o.start=function(){
		urlmap.start();
		for (var i=0;i<controllerConfs.length;++i) {
			var conf=controllerConfs[i];
			//1. 添加urlmap
			if (conf.controller) {
				urlmap.addmap("/"+conf.controller+"/index");
			}
			if (conf.path && conf.path.length>0) {
				for (var k=0;k<conf.path.length;++k) {
					urlmap.addmap(conf.path[k]);
				}
			}
			//2. 在frame中添加controller配置
			require('frame').addcontroller(conf);
		}
	};
	return o;
});
