/*url伪地址路由映射, (c) 2016 mawentao */
define(function(require){
    require('core/eraction');
    var urlmapping={},o={};
    // 启动ER
	o.start=function(){
		require("er/main").start();
		this.addmap("/index/index");
	};
	// 添加路由path
	o.addmap = function(path) {
        var ridx=path.lastIndexOf('~');
        if (ridx>=0) {
            path = path.substr(0,ridx);
        }
        var pathList = []; 
        var controller = 'index';
        var action = 'index';
        var arr = path.split("/");
        if (arr.length>1 && arr[1]!="") controller = arr[1];
        if (arr.length>2 && arr[2]!="") action = arr[2];
        pathList.push('/');
        pathList.push('/'+controller);
        pathList.push('/'+controller+'/'+action);
        for (var i=0; i<pathList.length; ++i) {
            var p = pathList[i];
            if (!urlmapping[p]) {
                var item = {path:p, type:'core/eraction'};
                require("er/controller").registerAction(item);
				urlmapping[p] = true;
				log.debug("map url path [#"+p+"] to javascript /controller/"+controller+".js#"+action+"Action");
            }   
        }   
    };
    return o;
});
