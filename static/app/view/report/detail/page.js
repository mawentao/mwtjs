define(function(require){
    var o = {};
	o.execute = function(domid,report) {
		var adminbtn = '';
		if (dz.uid==report.uid) {
		//	adminbtn = '<a style="margin-left:16px;" class="adminbtn" href="#/design~b='+report.report_id+'">[编辑]</a>';
		}

		var code = '<div class="dashboard-title">'+
				'<i class="sicon sicon-book-open"></i>'+report.report_title+adminbtn+
            	'<span id="fav"></span>'+
				'<span class="dashboard-author">作者：'+report.username+'<img src="'+avatar(report.uid)+'"/></span>'+
            	'<span class="dashboard-view"><i class="icon icon-preview"></i>'+report.views+'</span>'+
			'</div>'+
			'<div id="canvas-'+domid+'" class="fill-layout" style="top:50px"></div>';
		jQuery('#'+domid).html(code);
        require('view/fav/page').button('fav', 3, report.report_id, 'link');
		require('./swiper').init('canvas-'+domid,report);
        require('view/report/pv').execute(report);
	};
    return o;
});
