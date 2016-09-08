/***********************************************************
 * @file:   mwt-radiobtn.js
 * @author: mawentao(mawt@youzu.com)
 * @create: 2015-09-07 12:17:04
 * @modify: 2015-09-07 12:17:04
 * @brief:  mwt-radiobtn.js
 ***********************************************************/

MWT.RadiobtnField=function(opt)
{
    this.listeners={};
    this.options=[];
    if(opt)
	{
        if(isset(opt.options)) this.options=opt.options;
        this.construct(opt);
        if(this.id=="")this.id=this.render+"sel";
        if(opt.style)this.style=opt.style;
        if(opt.class)this.class=opt.class;
	}

    // create
    this.create=function(){
        var thiso=this;
        var domid=this.id+"rabtn";
        var code="<div class='mwt-btn-group' style='"+this.style+"'>";
		for(var i=0;i<this.options.length;++i){
            var v=isset(this.value)?this.value:0;
            var selected=this.options[i].value==v?"active":"";
            var cls = "mwt-btn mwt-btn-xs";
            if(isset(this.class))cls+=" "+this.class;
            else cls+=" mwt-btn-primary";
            cls+=" "+selected;
            code+="<button name='"+domid+"' class='"+cls+"' data-value='"+this.options[i].value+"'>"+this.options[i].text+"</button>";
        }
        code+="</div><input type='hidden' id='"+this.id+"' value='"+this.value+"'/>";
        jQuery("#"+this.render).html(code);
        // bundle event
        jQuery("button[name="+domid+"]").click(function(){
            jQuery("button[name="+domid+"]").removeClass("active");
            jQuery(this).addClass("active");
            thiso.value=jQuery(this).data("value");
            set_value(thiso.id,thiso.value);
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
