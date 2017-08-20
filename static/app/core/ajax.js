/* ajax封装 */
define(function(require){
    var _cache = {};
    var o = {};
	var ajaxxhrs = [];  //!< ajax请求连接池

    o.getAjaxUrl = function(api) {
        return dz.ajaxapi+api; 
    };

	// 终止所有ajax请求
	o.abortAll=function(){
		console.log("abort_all_ajax_requests");
		for(var i=0;i<ajaxxhrs.length;++i) {
			var axr=ajaxxhrs[i];
			axr.abort();
		}
		ajaxxhrs=[];
	};

    o.ajaxrequest=function(method, url, params, callbackfun, sync) {
        //if(!noanimation) show_loading();
        var axr = jQuery.ajax({
            url: url,
            type: method,
            dataType: "json",
            data: params,
            async: !sync, 
            complete: function(res) {
                //if(!noanimation) hide_loading();
            },
            success: function(res) {
                callbackfun(res);
                //console.log(json2str(res));
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                var errmsg = "Error("+XMLHttpRequest.readyState+") : "+textStatus;
				if (textStatus=="abort") {
					console.log("abort ajax: "+method);
				} else {
                	alert(errmsg);
				}
            }
        });
		ajaxxhrs.push(axr);
    };

    // POST方式提交Ajax请求
	o.post = function(cachekey, params, callbackfun, sync) {
        var url = o.getAjaxUrl(cachekey);
        o.ajaxrequest("post", url, params, callbackfun, sync);
    };

    // GET方式提交Ajax请求
    o.get = function(method, cachekey, params, callbackfun, sync) {
        var url = o.getAjaxUrl(cachekey);
        o.ajaxrequest("get", url, params, callbackfun, sync);
    };

    // 读取缓存，如果缓存不存在再ajax请求
    o.loadcache = function(cachekey, callbackfun, sync) {
        if (_cache[cachekey]) {
	        callbackfun(_cache[cachekey]);
        } else {
            this.post(cachekey, {}, function(res){
                _cache[cachekey] = res;
                callbackfun(res);
            }, noanimation);
        }
    };

    // 根据cachekey清除缓存
    o.unsetcache = function(cachekey) {
        _cache[cachekey] = null;
    };

    // 清除所有缓存
    o.clearcache = function() {
        _cache = {};
    };

    return o;
});
