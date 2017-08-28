/**
 * Http数据代理（使用JQuery Ajax实现）
 **/
mwt.HttpProxy=function(cnf)
{
    this.listeners = {};
    var url='';             //!< URL
    var method='POST';      //!< GET/POST
    var dataType='json';    //!< 返回的数据类型
    var async = true;       //!< 是否异步请求
    var beforeLoad,afterLoad;

    if (cnf) {
        this.construct(cnf);
        if(cnf.url) url=cnf.url;
        if(cnf.method && cnf.method.toUpperCase()=='GET') method='GET';
        if(cnf.dataType) dataType=cnf.dataType;
        if(isset(cnf.async) && !cnf.async) async=false;

        if(cnf.beforeLoad)beforeLoad=cnf.beforeLoad;
        if(cnf.afterLoad)afterLoad=cnf.afterLoad;
    }

    this.load=function(params,callback)
    {
        //var thiso=this;
        if(beforeLoad)beforeLoad();
        jQuery.ajax({
            url      : url,
            type     : method, 
            async    : async,
            data     : params,
            dataType : dataType, 
            complete: function() {
                if(afterLoad) afterLoad();
            },  
            success: function (res) {
                var data = res;
                if (res.data) data=res.data;
                if (callback) callback(data);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                var errmsg = "Error("+XMLHttpRequest.readyState+") : "+textStatus;
                mwt.log_warn(errmsg);
            }   
        });
    };
};
MWT.extends(MWT.HttpProxy, MWT.Proxy);
