define(function(require){
    var o = {};
	o.execute = function(report) {
        ajax.post('report&action=pv', {r : report.report_id}, function (res) {
            if (res.retcode != 0){
            	console.log('pv fail');
            }
        });
	};
    return o;
});
