define(function(require){
    var o = {};
	o.execute = function(cube) {
        ajax.post('t_datacube_cube&action=pv', {cubeid : cube.cubeid}, function (res) {
            if (res.retcode != 0){
            	console.log('pv fail');
            }
        });
	};
    return o;
});
