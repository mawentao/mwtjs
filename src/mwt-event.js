/**
 * 继承与事件机制
 */


// 继承
MWT.extends=function(A,B){A.prototype = new B();};

// 事件机制
MWT.Event=function()
{
	this.listeners={};

	// 注册事件的Listener
	this.addListener=function(ename, func)
	{
		if (!this.listeners[ename]) {
			this.listeners[ename]=[];
		}
		for (var i=0; i<this.listeners[ename].length; ++i) {
			if (func==this.listeners[ename][i])
				return;
		}
		this.listeners[ename].push(func);
	};
	this.on=function(ename, func) { this.addListener(ename, func);};
	this.fireon=function(ename, func){this.addListener(ename, func);func.call(func, this);};

	// 删除事件的Listener
	this.removeListener=function(ename, func)
	{
		if (!this.listeners[ename]) {return;}
		var arr=this.listeners[ename];
		for (var i=0; i<arr.length; ++i) {
			if (arr[i]==func) {
				arr.remove(i);
				return;
			}
		}
	};
	this.un=function(ename,func) {this.removeListener(ename, func);};

	// 删除事件的全部Listener
	this.removeAllListeners=function(ename) { delete this.listeners[ename]; };
	this.unall=function(ename) {this.removeAllListeners(ename);};

	// 触发事件
	this.fireEvent=function(ename) 
	{
		if (!this.listeners[ename]) { return; }
		var arr=this.listeners[ename];
		for (var i=0; i<arr.length; ++i) {
			var fun=arr[i];
			fun.call(fun, this);
		}
	};
	this.fire=function(ename) {this.fireEvent(ename);};
};


