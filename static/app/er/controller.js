define("er/controller",function(require){
	function e(e){
		if(!e)return!0;"string"==typeof e&&(e=e.split("|"));for(var t=require("./permission"),r=0;r<e.length;r++)if(t.isAllow(e[r]))return!0;return!1
	}
	function t(r){	
		var n=r.url.getPath(),o=l[n];if(o&&o.movedTo){y.fire("actionmoved",{url:r.url,config:o,movedTo:o.movedTo});var i=d.parse(o.movedTo);return r.originalURL=r.url,r.url=i,t(r)}if(o&&o.childActionOnly&&!r.isChildAction&&(o=null),!o)return y.fire("actionnotfound",g.mix({failType:"NotFound",reason:"Not found"},r)),r.originalURL=r.url,r.url=d.parse(v.notFoundLocation),l[r.url.getPath()]?t(r):null;var a=e(o.authority);if(!a){y.fire("permissiondenied",g.mix({failType:"PermissionDenied",reason:"Permission denied",config:o},r));var s=o.noAuthorityLocation||v.noAuthorityLocation;return r.originalURL=r.url,r.url=d.parse(s),t(r)}return o
	}
	function r(e){
		var r=t(e);if("function"==typeof w.resolveActionConfig&&(r=w.resolveActionConfig(r,e)),!r){var n=new h;return n.syncModeEnabled=!1,n.reject("no action configured for url "+e.url.getPath()),n.promise}if(e.title=r.title,r.args)for(var o in r.args)r.args.hasOwnProperty(o)&&!e.hasOwnProperty(o)&&(e[o]=r.args[o]);var i=new h;i.syncModeEnabled=!1;var a=i.promise,s=!1;return a.abort=function(){s||(s=!0,y.fire("actionabort",g.mix({},e)))},e.isChildAction||(f=e.url),window.require([r.type],function(t){if(!s){if(!t){var n="No action implement for "+acrtionConfig.type,o=g.mix({failType:"NoModule",config:r,reason:n},e);return y.fire("actionfail",o),y.notifyError(o),i.reject(n),void 0}if("function"==typeof t)return i.resolve(new t,e),void 0;var a=t;if("function"==typeof a.createRuntimeAction&&(a=a.createRuntimeAction(e),!a)){var n="Action factory returns non-action",o=g.mix({failType:"InvalidFactory",config:r,reason:n,action:a},e);return y.fire("actionfail",o),y.notifyError(o),i.reject(n),void 0}y.fire("actionloaded",{url:e.url,config:r,action:t}),i.resolve(a,e)}}),a
	}
	function n(e,t){
		if(!t.isChildAction){if(t.url!==f)return;p&&(y.fire("leaveaction",{action:p,to:g.mix({},t)}),"function"==typeof p.leave&&p.leave()),p=e,document.title=t.title||t.documentTitle||v.systemName}y.fire("enteraction",g.mix({action:e},t));var r=e.enter(t);return r.then(function(){y.fire("enteractioncomplete",g.mix({action:e},t))},function(e){var r="";e?e.message?(r=e.message,e.stack&&(r+="\n"+e.stack)):r=window.JSON&&"function"==typeof JSON.stringify?JSON.stringify(e):e:r="Invoke action.enter() causes error";var n=g.mix({failType:"EnterFail",reason:r},t);y.fire("enteractionfail",n),y.notifyError(n)}),r
	}
	function o(e,t,n,o){
		var i={url:e,container:t,isChildAction:!!o};if(o){var a=b[t];i.referrer=a?a.url:null}else i.referrer=f;g.mix(i,n);var s=r(i);return m.has(s,"loadAction should always return a Promise"),s
	}
	function i(e){
		"string"==typeof e&&(e=d.parse(e)),c&&"function"==typeof c.abort&&c.abort(),c=o(e,v.mainElement,null,!1),c.then(n).fail(g.bind(y.notifyError,y))
	}
	function a(e,t){
		var r=b[e.id];r&&(b[e.id]=void 0,r.action&&(t||(t={url:null,referrer:r.url,container:e.id,isChildAction:!0}),y.fire("leaveaction",{action:r.action,to:t}),"function"==typeof r.action.leave&&r.action.leave()))
	}
	function s(e,t,r,n){
		a(e,n);var o={url:n.url,action:t,hijack:r};b[e.id]=o;var i=require("./Observable");t instanceof i&&t.on("leave",function(){a(e)})
	}
	function u(e,t){
		function r(e,r,n){r=r||{};var o=require("./locator"),e=o.resolveURL(e,r);if(r.global){var i=document.getElementById(t.container);return i&&a(i),o.redirect(e,r),void 0}var s=b[t.container],u=e.toString()!==s.url.toString();(u||r.force)&&(r.silent?s.url=e:w.renderChildAction(e,t.container,n))}function o(e){e=e||window.event;var t=e.target||e.srcElement;if("a"===t.nodeName.toLowerCase()){var n=t.getAttribute("href",2)||"";if("#"===n.charAt(0)){e.preventDefault?e.preventDefault():e.returnValue=!1;var o=n.substring(1),i="global"===t.getAttribute("data-redirect");r(o,{global:i})}}}C[t.container]=null;var i=document.getElementById(t.container);if(i)return e.redirect=r,e.reload=function(e){this.redirect(t.url,{force:!0},e)},s(i,e,o,t),n(e,t)
	}
	var c,l={},f=null,p=null,h=require("./Deferred"),d=require("./URL"),v=require("./config"),y=require("./events"),g=require("./util"),m=require("./assert"),
	
	w={
		registerAction:function(e){
			m.hasProperty(e,"path",'action config should contains a "path" property'),l[e.path]=e
		},
		start:function(){
			v.systemName||(v.systemName=document.title),require("./router").setBackup(i)
		},
		resolveActionConfig:function(e){return e}
	},
	b={};
	w.renderAction=i;var C={};
	return w.renderChildAction=function(e,t,r){
		var n=require("./assert");n.has(t),"string"==typeof e&&(e=require("./URL").parse(e));var i=C[t];i&&"function"==typeof i.abort&&i.abort();var a=o(e,t,r,!0),s=a.then(u,g.bind(y.notifyError,y));return s.abort=a.abort,C[t]=s,s
	},
	w
});