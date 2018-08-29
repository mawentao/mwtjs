/* 文件上传控件 */
MWT.FileField=function(opt)
{
    this.listeners={};
	var thiso=this;
    var formid,fileid,filesel;
    var placeholder="选择文件...";   //!< 
    var errpop;           //!< 错误弹框
    var errmsg;           //!< 错误信息
    var empty=false;      //!< 是否允许为空
    var checkfun;         //!< 自定义校验函数
    if(opt)
	{
        this.construct(opt);
        fileid = this.id;
        formid = this.id+'form';
        if(opt.placeholder) placeholder=opt.placeholder;
        if(opt.errmsg) errmsg=opt.errmsg;
        if(opt.checkfun) checkfun=opt.checkfun;
        if(opt.empty) empty=opt.empty;
	}

    // create
    this.create=function(){
        var btnid = fileid+'btn';
        var code = '<div id="'+formid+'" style="display:none;"></div>'+
            '<input id="'+btnid+'" type="text" class="mwt-field" readonly style="cursor:pointer;" '+
                'placeholder="'+placeholder+'">';
        jQuery("#"+this.render).html(code);
        this.createForm();
        jQuery('#'+btnid).unbind('click').click(function(){
            filesel.val("");
            filesel.click();
        });
    };

    this.createForm = function()
    {/*{{{*/
        var code = '<form method="POST" enctype="multipart/form-data">'+
            '<input type="file" id="'+fileid+'" name="'+fileid+'" accept="*/*" />'+
        '</form>';
        jQuery("#"+formid).html(code);
        filesel = jQuery('#'+fileid);
        filesel.change(function(){
            var v = filesel.val();
            jQuery('#'+fileid+'btn').val(v);
            thiso.value = v;
        });
    }/*}}}*/

    this.setValue=function()
    {
    };
};
MWT.extends(MWT.FileField, MWT.Field);
