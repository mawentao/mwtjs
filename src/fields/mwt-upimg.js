/* 图片上传控件 */
MWT.ImageUploadField=function(opt)
{
    this.listeners={};
    var emptyImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAAsCAIAAACi3dJfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABqSURBVGhD7c+xDYAwEARB+q/KnRkQLmH0AdqJLjvttWettc6aUqFWoVehVqFXoVahV6FWoVehVqFXoVahV6FWofcWPq9/dQonfa+TKtQq9CrUKvQq1Cr0KtQq9CrUKvQq1Cr0KtSmC/e+AURnMevdfLBSAAAAAElFTkSuQmCC';
    var imgdom,filedom,fileid;
    var imgupapi = '';
    var errpop;       //!< 错误弹框
    var errmsg;       //!< 错误信息
    var empty=false;  //!< 是否允许为空

    var thiso = this;
    if (opt) {
        this.cls = "upimg";
        this.construct(opt);
        if(this.id=="")this.id=this.render+"img";
        if(opt.emptyImg) emptyImg=opt.emptyImg;
        if(opt.imgupapi) imgupapi=opt.imgupapi;
        if(opt.empty) empty=opt.empty;
        if(opt.errmsg) errmsg=opt.errmsg;
    }

    // create
    this.create = function() {
        var thiso=this;
        var imgid=this.render+"img";
        fileid=this.render+"file";
        var imgsrc = this.value=='' ? emptyImg : this.value;
        var code = '<img id="'+imgid+'" src="'+imgsrc+'" class="'+this.cls+'" style="'+this.style+'" onclick="jQuery(\'#'+fileid+'\').click();">'+
            '<div id="'+fileid+'form"></div>';
        jQuery("#"+this.render).html(code);
        imgdom = jQuery('#'+imgid);
        create_filedom();

        errpop = new MWT.Popover({anchor:imgid,html:errmsg,cls:"mwt-popover-danger"});
        
    };

    function create_filedom() {
        var code = '<form method="POST" enctype="multipart/form-data">'+
                '<input type="file" id="'+fileid+'" name="upfile" accept="image/*" style="display:none;"/>'+
            '</form>';
        jQuery("#"+fileid+"form").html(code);
        filedom = jQuery('#'+fileid);
        filedom.change(do_upload);
/*
        imgdom.unbind('click').click(function(){
            alert("aaa");
            filedom.val('');
            filedom.click();
        });
        MWT.$(fileid).onchange = do_upload;
*/
    }

    function do_upload() {
        var v = filedom.val();
        jQuery.ajaxFileUpload({
            url: imgupapi,
            secureuri: false,
            fileElementId: fileid,
            dataType: 'json',
            timeout: 30000,
            complete: function(res) {
                //console.log(res);
                create_filedom();
                //filedom.change(do_upload);
            },  
            success: function(res,status) {
                    //data['filename'] = imgfile;
                    //callbackfun(data);  
                    if (res.retcode!=0) {
                        MWT.alert(res.retmsg);
                    } else {
                        thiso.setValue(res.data.imgurl);
                    }
                },  
                error: function (res, status, e) {
					MWT.alert(e);
                }
        });
    };

    this.setValue=function(v) {
        this.value = v;
        if (v!='') {
            imgdom.attr('src',v); 
        } else {
            imgdom.attr('src',emptyImg); 
        }
    };

    this.validate=function() {
        errpop.hide();
        if (!empty && this.value=='') {
            errpop.pop();
            setTimeout(errpop.hide,2000);
            return false;
        }
        return true;
    };
};
MWT.extends(MWT.ImageUploadField, MWT.Field);
