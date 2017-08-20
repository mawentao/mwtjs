define("er/locator",function(require){
	function e(){
		var e=location.href.indexOf("#"),t=-1===e?"":location.href.slice(e);
		return t
	}
	
	function t(){
		var t=e();
		i.redirect(t)
	}
	
	function n(e){
		window.addEventListener?window.addEventListener("hashchange",t,!1):"onhashchange"in window&&document.documentMode>7?window.attachEvent("onhashchange",t):s=setInterval(t,100),e&&(u=setTimeout(t,0))
	}
	
	function r(){
		s&&(clearInterval(s),s=null),u&&(clearTimeout(u),u=null),window.removeEventListener?window.removeEventListener("hashchange",t,!1):"onhashchange"in window&&document.documentMode>7&&window.detachEvent("onhashchange",t)
	}
	
	function o(t,o){
		var i=a!==t;
		return i&&e()!==t&&(o.silent?(r(),location.hash=t,n(!1)):location.hash=t),a=t,i
	}
	
	var i={},a="",s=0,u=1;
	
	return i.start=function(){
		n(!0)
	},
	
	i.stop=r,i.resolveURL=function(e){
		return e+="",0===e.indexOf("#")&&(e=e.slice(1)),e&&"/"!==e||(e=require("./config").indexURL),e
	},
	i.redirect=function(e,t){
		t=t||{},e=i.resolveURL(e);var n=a,r=o(e,t);(r||t.force)&&(t.silent||i.fire("redirect",{url:e,referrer:n}),require("./events").fire("redirect",{url:e,referrer:n}))
	},
	i.reload=function(){a&&i.redirect(a,{force:!0})},
	require("./Observable").enable(i),
	i
});