define(function(require){
    var o={};

    // 提示信息
    o.info=function(msg) {
        return '<div class="mwt-alert mwt-alert-info">'+
            '<i class="fa fa-info-circle" style="font-size:16px;float:left;margin-top:2px;"></i>'+
            '<div style="display:inline-block;margin-left:10px;font-size:13px;">'+msg+'</div>'+
        '</div>';
    };  

    // 异常信息
    o.warning=function(msg) {
        return '<div class="mwt-alert mwt-alert-warning">'+
            '<i class="fa fa-frown-o" style="font-size:16px;float:left;margin-top:2px;"></i>'+
            '<div style="display:inline-block;margin-left:10px;font-size:13px;">'+msg+'</div>'+
        '</div>';
    };

    // 报警信息
    o.danger=function(msg) {
        return '<div class="mwt-alert mwt-alert-danger">'+
            '<i class="icon icon-report" style="font-size:16px;float:left;margin-top:2px;padding-left:0;"></i>'+
            '<div style="display:inline-block;margin-left:10px;font-size:13px;">'+msg+'</div>'+
        '</div>';
    };


    o.getloading=function(msg) {
        if (!msg) msg = '读取数据...';
        var code = '<div style="padding:20px;font-size:13px;color:#999;font-weight:normal;">'+
            '<i class="fa fa-refresh fa-spin fa-3x fa-fw" style="font-size:16px;"></i> '+msg+
        '</div>';
        return code;
    };  

    return o;
});
