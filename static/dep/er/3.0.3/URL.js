define("er/URL", function(require){
	function e(n,r,i){
		n=n||"/",r=r||"",i=i||"~",
		this.toString=function(){return r?n+i+r:n},
		this.getPath=function(){return n},
		this.getSearch=function(){return r};
		var o=null;
		this.getQuery=function(n){return o||(o=e.parseQuery(r)),n?o[n]:t.mix({},o)}
	}
	var t=require("./util");
	return e.parse=function(n,r){
		var i={querySeparator:"~"};r=t.mix(i,r);var o=n.indexOf(r.querySeparator);return o>=0?new e(n.slice(0,o),n.slice(o+1),r.querySeparator):new e(n,"",r.querySeparator)
	},
	e.withQuery=function(n,r,i){
		n+="";var o={querySeparator:"~"};i=t.mix(o,i);var s=n.indexOf(i.querySeparator)<0?i.querySeparator:"&",a=e.serialize(r),u=n+s+a;return e.parse(u,i)
	},
	e.parseQuery=function(e){
		for(var t=e.split("&"),n={},r=0;r<t.length;r++){var i=t[r];if(i){var o=i.indexOf("="),s=0>o?decodeURIComponent(i):decodeURIComponent(i.slice(0,o)),a=0>o?!0:decodeURIComponent(i.slice(o+1));n.hasOwnProperty(s)?a!==!0&&(n[s]=[].concat(n[s],a)):n[s]=a}}return n
	},
	e.serialize=function(e){
		if(!e)return"";var t="";for(var n in e)if(e.hasOwnProperty(n)){var r=e[n];t+="&"+encodeURIComponent(n)+"="+encodeURIComponent(r)}return t.slice(1)
	},
	e.empty=new e,
	e
});