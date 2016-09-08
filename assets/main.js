define("main", function(require){
	require("jquery");
	require("demowin");
	require("conf/main");

	function init() {
		require("frame").init();
		create_demowin();

		var er = require("er");
		er.start();
		var actions = require("conf/er.config");
		var r=require("er/controller");
		for (var i=0; i<actions.length; ++i) 
			r.registerAction(actions[i]);
	}
	
	return {
		init: init
	};
});
