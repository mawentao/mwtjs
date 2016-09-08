/**
 * �̳����¼�����
 */


// �̳�
MWT.extends=function(A,B){A.prototype = new B();};

// �¼�����
MWT.Event=function()
{
	this.listeners={};

	// ע���¼���Listener
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

	// ɾ���¼���Listener
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

	// ɾ���¼���ȫ��Listener
	this.removeAllListeners=function(ename) { delete this.listeners[ename]; };
	this.unall=function(ename) {this.removeAllListeners(ename);};

	// �����¼�
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


