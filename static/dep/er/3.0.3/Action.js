define("er/Action",function(require){
	function t(){
		for(var t=[],e=0;e<arguments.length;e++){var i=arguments[e];i.success||t.push(i)}return this.handleError(t)
	}
	function e(){this.disposed=!1}
	var i=require("./util"),o=require("./Observable");
	return e.prototype.context=null,e.prototype.modelType=null,e.prototype.viewType=null,
	e.prototype.enter=function(e){
		this.context=e||{},this.fire("enter");
		var o=e&&e.url&&e.url.getQuery(),n=i.mix({},e,o);
		if(this.model=this.createModel(n),this.model&&"function"==typeof this.model.load){
			var r=this.model.load();
			return r.then(i.bind(this.forwardToView,this),i.bind(t,this))
		}
		return this.forwardToView(),require("./Deferred").resolved(this)
	},
	e.prototype.handleError=function(t){throw t},
	e.prototype.createModel=function(t){
		if(this.modelType){var e=new this.modelType(t);return e}return{}
	},
	e.prototype.forwardToView=function(){
		if(this.disposed)return this;
		if(this.fire("modelloaded"),this.view=this.createView(),this.view)
			this.view.model=this.model,this.view.container||(this.view.container=this.context.container),this.fire("beforerender"),this.view.render(),this.fire("rendered"),this.initBehavior(),this.fire("entercomplete");
		else{
			var t=require("./events");t.notifyError("No view attached to this action")
		}
		return this
	},
	e.prototype.createView=function(){return this.viewType?new this.viewType:null},
	e.prototype.initBehavior=function(){},
	e.prototype.leave=function(){
		this.disposed=!0,this.fire("beforeleave"),this.model&&("function"==typeof this.model.dispose&&this.model.dispose(),this.model=null),this.view&&("function"==typeof this.view.dispose&&this.view.dispose(),this.view=null),this.fire("leave")
	},
	e.prototype.redirect=function(t,e){var i=require("./locator");i.redirect(t,e)},
	e.prototype.reload=function(){var t=require("./locator");t.reload()},
	i.inherits(e,o),
	e
});
