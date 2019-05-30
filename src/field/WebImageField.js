/**
 * 图片上传或添加图片链接控件
 **/
MWT.WebImageField=function(opt)
{
    this.listeners={};
    var thiso=this;
    var tid;
    var type="text";      //!< 
    var placeholder="输入图片链接";   //!< 
    var errpop;           //!< 错误弹框
    var errmsg;           //!< 错误信息
    var empty=false;      //!< 是否允许为空
    var checkfun;         //!< 自定义校验函数
    var optdivid,popStyle='max-height:100px;';
    var storekey;         //!< localStorage存储的key
	var imgupapi;        //!< 图片上传API
    if(opt)
    {
        this.construct(opt);
        if(opt.type) type=opt.type;
        if(opt.placeholder) placeholder=opt.placeholder;
        if(opt.errmsg) errmsg=opt.errmsg;
        if(opt.checkfun) checkfun=opt.checkfun;
        if(opt.empty) empty=opt.empty;
		if(opt.imgupapi) imgupapi=opt.imgupapi;
        tid=this.render+"txt";
        optdivid=this.render+"pop";
        if(opt.popStyle)popStyle=opt.popStyle;
        storekey=this.render+"skey";

        var imguploader = new mwt.ImageUpload({
            ajaxapi: imgupapi
        });
    }

    // create
    this.create=function(){
        var btnstyle = ' style="height:26px;"';
        var code = '<div class="mwt-row mwt-row-flex mwt-web-img-field">'+
              '<div class="mwt-col-wd" style="width:110px;">'+
                '<img id="img-'+tid+'" src="" class="mwt-image-view">'+
              '</div>'+
              '<div class="mwt-col-fill">'+
                '<div style="position:relative">'+
                  '<input type="'+type+'" id="'+tid+'" class="form-control '+this.cls+'" placeholder="'+placeholder+'"'+
                    ' style="'+this.style+';padding:0 20px 0 5px;">'+
                  '<i id="'+tid+'-clear" class="fa fa-times-circle" '+
                    'style="display:none;color:#999;font-size:14px;margin-left:-20px;vertical-align:middle;"></i>'+
                '</div>'+
                '<div style="margin-top:10px;">'+
                  '<button id="refreshbtn-'+tid+'" class="mwt-btn mwt-btn-default mwt-btn-xs"'+btnstyle+'>刷新</button>'+
                  '&nbsp;&nbsp;'+
                  '<button id="upbtn-'+tid+'" class="mwt-btn mwt-btn-primary mwt-btn-xs"'+btnstyle+'>上传本地图片</button>'+
//                  '&nbsp;&nbsp;'+
//                  '<button id="sobtn-'+tid+'" class="mwt-btn mwt-btn-warning mwt-btn-xs"'+btnstyle+'>搜索网络图片</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '<div id="'+optdivid+'" class="mwt-field-pop" style="'+popStyle+'"></div>';
        jQuery("#"+this.render).html(code);
        errpop = new MWT.Popover({anchor:tid,html:errmsg,cls:"mwt-popover-danger"});
        mwt.initImageView();

        this.setValue(this.value);
        // bundle event
        var $txt = jQuery("#"+tid);
        var $clr = jQuery("#"+tid+'-clear');
        var $pop = jQuery("#"+optdivid);
        $txt.change(change);
        $txt.focus(function(){
            $clr.show();
            show_pop();
            jQuery(document).unbind('click').on("click", function(){
                var act=document.activeElement.id;
                if (act!=tid) {
                    $pop.hide();
                    $clr.hide();
                }
            });
            event.stopPropagation();
        });
        //$txt.blur(function(){$clr.hide();});
        $pop.click(function(event){
            event.stopPropagation();
        });
        $clr.click(function(){
            $txt.val('').focus();
        });
        // 刷新按钮
        jQuery('#refreshbtn-'+tid).unbind('click').on("click",thiso.refresh);
        // 上传本地图片
        jQuery('#upbtn-'+tid).unbind('click').on("click",function(){
            imguploader.upload(function(res){
				if (res.data && res.data.imgurl) {
					thiso.setValue(res.data.imgurl);
				}
            });
        });
    };

    function change() {
        errpop.hide();
        thiso.value = mwt.get_value(tid);
        thiso.fire("change");
        if (thiso.value!='') jQuery("#"+tid+'-clear').show();
        thiso.refresh();
    };

    this.setValue=function(v){
        mwt.set_value(tid,v);
        this.value=v;
        this.refresh();
    };

    this.validate=function() {
        errpop.hide();
        var t = empty ? mwt.get_value(tid) : mwt.get_text_value(tid);
        if (checkfun && !checkfun(t)) {
            errpop.pop();
            jQuery("#"+tid).focus();
            setTimeout(errpop.hide,2000);
            return false;
        }
        return true;
    };

    this.readOnly = function(rd) {
        if (rd) jQuery('#'+tid).attr('readonly',true);
        else jQuery('#'+tid).removeAttr('readonly');
    };

    // 显示pop
    function show_pop() {
        var v = localStorage.getItem(storekey);
        if (!v) return;
        var words = v.split('||');
        if (words.length==0) return;
        var code = '<div class="mwt-pop-words"><a id="'+this.render+'-pop-clrbtn" href="javascript:;">清空</a>'+
             '<ul id="'+this.render+'-wdul">';
        for (var i=0;i<words.length;++i) {
            code += '<li name="'+thiso.render+'-wd">'+words[i]+'</li>';
        }
        code += '</ul></div>';
        jQuery('#'+optdivid).show().html(code);
        jQuery('[name='+thiso.render+'-wd]').click(function(){
            var word = jQuery(this).html();
            jQuery('#'+tid).val(word);
            change();
        });
    };

    // 刷新图片
    this.refresh = function() {
        var imgurl = mwt.get_value(tid);
        if (imgurl=='') return;
        jQuery('#img-'+tid).attr('src',imgurl);
    };
};
MWT.extends(MWT.WebImageField, MWT.Field);

