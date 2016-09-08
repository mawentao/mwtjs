/**
 * 多选输入控件
 **/
MWT.CheckboxField=function(opt)
{
    this.listeners={};
    var options=[];
    var errpop;           //!< 错误弹框 
    var errmsg;           //!< 错误信息 
    var empty=false;      //!< 是否允许为空   
    var checkfun;         //!< 自定义校验函数
    var cbxname;
    if(opt)
	{
        if(isset(opt.options)) options=opt.options;
        this.construct(opt);
        if(this.id=="")this.id=this.render+"sel";
        if (this.value=='') this.value=[];
        if (this.defaultValue=='') this.defaultValue=[];
        if(opt.errmsg) errmsg=opt.errmsg;
        if(opt.checkfun) checkfun=opt.checkfun;
        if(opt.empty) empty=opt.empty;
	}


    // create
    this.create=function(){
        var thiso=this;
        var domid=this.id;
        cbxname = this.render+'cbx';
        var cbxes = [];
        for (var i=0;i<options.length;++i) {
            var item=options[i];
            var cb='<label class="'+this.cls+'" style="cursor:pointer;display:inline-block;">'+
                '<input type="checkbox" name="'+cbxname+'" value="'+item.value+'"><i></i><span>'+item.text+'</span></label>';
            cbxes.push(cb);
        }
        var code = cbxes.join("&nbsp;&nbsp;");
        jQuery("#"+this.render).html(code);
        errpop = new MWT.Popover({anchor:thiso.render,html:errmsg,cls:"mwt-popover-danger"});
        // bundle event
        jQuery('[name='+cbxname+']').change(function(){
            thiso.value = get_checkbox_values(cbxname);
            thiso.fire("change");
        });
        // set default
        this.reset();
    };

    this.setValue=function(v){
        this.value=v;
        set_checkbox_values(cbxname,v);
    };

	this.validate=function() {
        errpop.hide();
        var v = this.value;
        if ( (!empty && v.length==0)  || (checkfun && !checkfun(this.value))) {
            errpop.pop();
            setTimeout(errpop.hide,2000);
            return false;
        }
        return true;
    };
};
MWT.extends(MWT.CheckboxField, MWT.Field);
