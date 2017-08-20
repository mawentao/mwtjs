define(function(require){
    var ErAction=require("er/Action");
	var frame=require('frame');
	var frameInited=false;
    var o = new ErAction();
    o.on("enter",function(){
        //1. 解析UrlPath
        var erurl = this.context.url;
        var path  = erurl.getPath();

        var controller = 'index';
        var action = 'index';
        var arr = path.split("/");
        if (arr.length>1 && arr[1]!="") controller = arr[1];
        if (arr.length>2 && arr[2]!="") action = arr[2];
        //2. 初始化frame
        if (!frameInited) {
            frame.init();
            frameInited = true;
            log.debug("init frame");
        }
        frame.active(controller,action);
        //3. 执行action
        var cm = 'controller/'+controller;
        require([cm], function(c){
			ajax.abortAll();
            c[action+"Action"](erurl);
        });
    });

    return o;
});
