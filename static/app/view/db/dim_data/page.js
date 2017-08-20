define(function(require){
    var o = {};
	o.execute = function(domid,dimInfo) {
		require('./grid').init(domid,dimInfo);
	};
    return o;
});
