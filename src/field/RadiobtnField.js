/**
 * 单选按钮
 **/
MWT.RadiobtnField=function(opt)
{
    this.listeners={};
    this.options=[];
    if(opt)
	{
        this.cls = 'mwt-btn-primary';
        this.construct(opt);
        if(isset(opt.options)) this.options=opt.options;
        if(this.id=="")this.id=this.render+"sel";
	}

    // create
    this.create=function(){
        var thiso=this;
        var domid=this.id+"rabtn";
        var code="<div class='mwt-btn-group' style='"+this.style+"'>";
		for(var i=0;i<this.options.length;++i){
            var v=isset(this.value)?this.value:0;
            var selected=this.options[i].value==v?"active":"";
            var cls = "mwt-btn mwt-btn-xs "+this.cls;
            cls+=" "+selected;
            code+="<button name='"+domid+"' class='"+cls+"' style='float:none;' data-value='"+this.options[i].value+"'>"+this.options[i].text+"</button>";
        }
        code+="</div><input type='hidden' id='"+this.id+"' value='"+this.value+"'/>";
        jQuery("#"+this.render).html(code);
        // bundle event
        jQuery("button[name="+domid+"]").click(function(){
            jQuery("button[name="+domid+"]").removeClass("active");
            jQuery(this).addClass("active");
            thiso.value=jQuery(this).data("value");
            jQuery('#'+thiso.id).val(thiso.value);
            thiso.fire("change");
        });
    };
    this.setValue=function(v){
        this.value=v;
        jQuery("#"+this.id).val(v);
        var domid=this.id+"rabtn";
        jQuery("button[name="+domid+"]").removeClass("active");
        jQuery("button[data-value='"+v+"']").addClass("active");
    };
};
MWT.extends(MWT.RadiobtnField, MWT.Field);
