define(function(require){
	var tableInfo;

    var o = {};
	o.execute = function(domid,cubeInfo) {
		var code = '<div id="info-'+domid+'"></div>'+
			'<div id="grid-dims-'+domid+'"></div>'+
			'<div id="grid-metrics-'+domid+'"></div>';
		jQuery("#"+domid).html(code);
		require('./info_panel').init('info-'+domid,cubeInfo);
		require('./dim_grid').init('grid-dims-'+domid,cubeInfo);
		require('./metric_grid').init('grid-metrics-'+domid,cubeInfo);
	};
    return o;
});
