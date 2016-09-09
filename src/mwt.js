var MWT=mwt={};

// 获取指定ID的dom元素
mwt.$=function(id){return document.getElementById(id);};

// 销毁指定ID的dom元素
mwt.destroy=function(id){
	var dom=mwt.$(id);
	if(dom)dom.remove();
};

// 随机生成一个domid，且document中没有此di的dom元素
mwt.gen_domid=function(prefix){
    function randstr(n) {
        var x="0123456789qwertyuioplkjhgfdsazxcvbnmABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var tmp="";
        var timestamp = new Date().getTime();
        for(var i=0;i<n;i++)  {
            tmp += x.charAt(Math.ceil(Math.random()*100000000)%x.length);
        }
        return tmp;
    }
    var len = 6;
    while (true) {
        var id = prefix ? prefix+randstr(len) : randstr(len);
        if (!MWT.$(id)) {
            return id;
        }
    }
};

// 创建一个div元素
mwt.create_div = function(msgdivid) {
    var msgdiv = document.getElementById(msgdivid);
    if(!msgdiv) {
        var onediv = document.createElement('div');
        onediv.id=msgdivid;
        document.body.appendChild(onediv);
    }
    return msgdivid;
};

