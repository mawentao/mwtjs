/**
 * 单选输入控件
 **/
MWT.RadioField=function(opt)
{
    this.listeners={};
    var options=[];
    var errpop;           //!< 错误弹框 
    var errmsg;           //!< 错误信息 
    var empty=false;      //!< 是否允许为空   
    var checkfun;         //!< 自定义校验函数
    var rdoname;
    if(opt)
	{
        if(isset(opt.options)) options=opt.options;
        this.construct(opt);
        if(opt.errmsg) errmsg=opt.errmsg;
        if(opt.checkfun) checkfun=opt.checkfun;
        if(opt.empty) empty=opt.empty;
	}


    // create
    this.create=function(){
        var thiso=this;
        var domid=this.id;
        rdoname = this.render+'rdo';
        var rdoes = [];
        for (var i=0;i<options.length;++i) {
            var item=options[i];
            var cb='<label class="'+this.cls+'" style="display:inline-block">'+
                '<input type="radio" name="'+rdoname+'" value="'+item.value+'"><span>'+item.text+'</span></label>';
            rdoes.push(cb);
        }
        var code = rdoes.join("&nbsp;&nbsp;");
        jQuery("#"+this.render).html(code);
        //errpop = new MWT.Popover({anchor:thiso.render,html:errmsg,cls:"mwt-popover-danger"});
        // bundle event
        jQuery('[name='+rdoname+']').change(function(){
            thiso.value = mwt.get_radio_value(rdoname);
            thiso.fire("change");
        });
        // set default
        this.reset();
    };

    this.setValue=function(v){
        this.value=v;
        mwt.set_radio_value(rdoname,v);
    };

	this.validate=function() {
        //errpop.hide();
        var v = this.value;
        if ( (!empty && v=='')  || (checkfun && !checkfun(this.value))) {
            //errpop.pop();
            //setTimeout(errpop.hide,2000);
            return false;
        }
        return true;
    };
};
MWT.extends(MWT.RadioField, MWT.Field);
