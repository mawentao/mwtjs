define("er/Observable",function(require){
	function t(){this._events={}}
	var e="_erObservableGUID";
	return t.prototype.on=function(t,n){
		this._events||(this._events={});var r=this._events[t];r||(r=this._events[t]=[]),n.hasOwnProperty(e)||(n[e]=require("./util").guid()),r.push(n)
	},
	t.prototype.un=function(t,e){
		if(this._events){if(!e)return this._events[t]=[],void 0;var n=this._events[t];if(n)for(var r=0;r<n.length;r++)n[r]===e&&(n.splice(r,1),r--)}
	},
	t.prototype.fire=function(t,n){
		1===arguments.length&&"object"==typeof t&&(n=t,t=n.type);var r=this["on"+t];if("function"==typeof r&&r.call(this,n),this._events){null==n&&(n={}),"[object Object]"!==Object.prototype.toString.call(n)&&(n={data:n}),n.type=t,n.target=this;var i={},o=this._events[t];if(o){o=o.slice();for(var s=0;s<o.length;s++){var a=o[s];i.hasOwnProperty(a[e])||a.call(this,n)}}if("*"!==t){var u=this._events["*"];if(!u)return;u=u.slice();for(var s=0;s<u.length;s++){var a=u[s];i.hasOwnProperty(a[e])||a.call(this,n)}}}
	},
	t.enable=function(e){
		e._events={},e.on=t.prototype.on,e.un=t.prototype.un,e.fire=t.prototype.fire
	},
	t
});