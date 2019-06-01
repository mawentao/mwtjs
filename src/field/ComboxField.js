/**
 * 自定义选择输入控件
 **/
MWT.ComboxField=function(opt)
{
	this.listeners={};
	var errpop;           //!< 错误弹框 
    var errmsg;           //!< 错误信息 
    var empty=false;      //!< 是否允许为空   
    var checkfun;         //!< 自定义校验函数
    var btnid,txtid,optdivid;
    var width = 'auto';   //!< 控件宽度
    var popWidth = 400;   //!< 弹出层宽度
    var popHeight = 300;  //!< 弹出层高度
	var text="请选择...";
	if(opt) {
		this.construct(opt);
        if(opt.errmsg) errmsg=opt.errmsg;
        if(opt.checkfun) checkfun=opt.checkfun;
        if(opt.empty) empty=opt.empty;
        if(opt.width) width=opt.width;
        if(opt.popWidth) popWidth=opt.popWidth;
        if(opt.popHeight) popHeight=opt.popHeight;
        if(opt.text) text=opt.text;
        btnid = this.render+'-btn';
        txtid = this.render+'-btn-txt';
		optdivid = this.render+'-opt';
    }

	// create 
	this.create = function() {
        var thiso=this;
        var spanstyle = 'text-align:left;overflow:hidden;';
        if (width!='auto') spanstyle += 'width:'+width+'px';
		var code = '<div>'+
				'<a id="'+btnid+'" class="mwt-field mwt-btn mwt-btn-default '+this.cls+'" href="javascript:;" style="'+this.style+'">'+
                  '<span id="'+txtid+'" style="'+spanstyle+'">'+text+'</span><i class="fa fa-caret-down"></i></a>'+
                '</div>'+
			'</div>';
        jQuery("#"+this.render).html(code);
        errpop = new MWT.Popover({anchor:btnid,html:errmsg,cls:"mwt-popover-danger"});
        this.setValue(this.value);
		jQuery("#"+btnid).click(function(event){
            mwt.showPop(btnid,optdivid,popWidth,popHeight,function(){
                thiso.fire('pop');
            });
            thiso.fire('pop');
            jQuery(document).on("click", function(){
                jQuery("#"+optdivid).hide();
            }); 
            event.stopPropagation();
        }); 
        jQuery("#"+optdivid).click(function(event){
            event.stopPropagation();
        });
		this.fire('create');
	};
	
	// 弹出层divid
	this.getPopDivId = function() { return optdivid; }

	this.setValue=function(v){
        this.value=v;
    };

	this.setText=function(v) {
		jQuery('#'+txtid).html(v);
		jQuery("#"+optdivid).hide();
	};
    

	this.validate=function() {
        errpop.hide();
        var v = this.value;
        if ( (!empty && v=='')  || (checkfun && !checkfun(this.value))) {
            errpop.pop();
            setTimeout(errpop.hide,2000);
            return false;
        }
        return true;
    };
};
MWT.extends(MWT.ComboxField, MWT.Field);
