define("er/main",function(require){
	var e={
		version:"3.0.3",
		start:function(){
			require("./controller").start(),
			require("./router").start(),
			require("./locator").start()
		}
	};
	return e
}),

define("er",["er/main"],function(e){return e});