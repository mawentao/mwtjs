define("er/router",function(require){
	function e(e){
		for(var r=require("./URL").parse(e.url),o=r.getPath(),i=0;i<t.length;i++){
			var a=t[i];
			if(a.rule instanceof RegExp&&a.rule.test(o)||a.rule===o)return a.handler.call(null,r),void 0
		}
		n&&n.call(null,r),require("./events").fire("route",{url:r})
	}
	var t=[],n=null,r={add:function(e,n){t.push({rule:e,handler:n})},setBackup:function(e){n=e},
	start:function(){require("./locator").on("redirect",e)}};
	return r
});