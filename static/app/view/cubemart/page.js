/* Cube集市 */
define(function(require){
	var MartGrid=require('./grid');
	var gridmap = {};

	var o={};
	o.execute=function(domid,clkfun) {

		var code = '<div class="fill-layout" style="bottom:auto;height:40px;border-bottom:solid 1px #ccc;">'+
			'<ul class="mwt-nav mwt-nav-pills">'+
				'<li class="mwt-active"><a href="javascript:void(0);" data-idx="0">Cube集市</a></li>'+
	//			'<li><a href="javascript:void(0);" data-idx="1">我的Cube</a></li>'+
				'<li style="float:right;"><div class="mwt-text-search " style="margin-top:5px;">'+
					'<input id="so-key-grid-'+domid+'" type="text" style="width:250px;" value="" placeholder="搜索Cube">'+
						'<i id="sobtn-grid-'+domid+'" class="fa fa-search"></i></div>'+
				'</li>'+
			'</ul>'+
		'</div>'+
		'<div id="grid-'+domid+'" class="fill-layout" style="top:40px;bottom:36px;background:#fff;overflow-y:auto;"></div>'+
		'<div id="footbar-'+domid+'" class="fill-layout mwt-grid-foot" style="top:auto;height:36px;"></div>';
		jQuery('#'+domid).html(code);

		if (!gridmap[domid]) {
			gridmap[domid] = new MartGrid('grid-'+domid,'footbar-'+domid,clkfun);
		}
		gridmap[domid].init();
	};
	return o;
});
