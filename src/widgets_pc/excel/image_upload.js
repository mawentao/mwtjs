/**
 * 图片上传控件
 * author: mawentao
 * create: 2017-12-17 14:23:11
 **/
MWT.ImageUpload = function(opt)
{
    this.listeners={};
    var render='image-upload-div';
    var fileElementId = "imgfile";
    var ajaxapi;        //!< 上传接口
    var popover;
    var filesel,callbackfun;

    if (opt) {
        if(opt.render)render=opt.render;
        if(opt.ajaxapi) ajaxapi=opt.ajaxapi;
        if(ajaxapi.indexOf('fileElementId')<0) ajaxapi+='&fileElementId='+fileElementId;
    }

    // 创建form
    function create_form() {
        if (!render) return;
        mwt.createDiv(render);
        var code = '<form method="POST" enctype="multipart/form-data">'+
            '<input type="file" id="'+fileElementId+'" name="'+fileElementId+'" accept="image/*" style="display:none;"/>'+
        '</form>';
        jQuery("#"+render).html(code);
        filesel = jQuery('#'+fileElementId);
        filesel.change(do_upload);  
    }

    // 上传文件
    function do_upload() {
        var imgfile = filesel.val();
        if (imgfile=="") return;
        jQuery.ajaxFileUpload({
            url           : ajaxapi,
            secureuri     : false,
            fileElementId : fileElementId,
            dataType      : 'json',
            timeout       : 30000,
            complete      : function(data) {
                create_form();
            },
            success: function(data,status) {
                if (callbackfun) {
                    callbackfun(data);
                }
            },
            error: function (data, status, e) {
                mwt.alert("Error: "+e);
            }
        });
    }

    // 触发上传文件
    this.upload=function(callback) {
        if (!filesel) { create_form(); }
        callbackfun = callback;
        filesel.val("");
        filesel.click();
    };
};

MWT.extends(MWT.ImageUpload, MWT.Event);

