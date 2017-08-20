define(function(require){
    var o={};
	var control='index';

	o.conf = {
		controller: control,
		path: [
			'/'+control+'/index'
		]
	};

	// 默认action
	o.indexAction=function() {
        window.location = '#/example';
	};

	return o;
});
