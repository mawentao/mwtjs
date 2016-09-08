/***********************************************************
 * @file:   mwt-select.js
 * @author: mawentao(mawt@youzu.com)
 * @create: 2015-08-24 16:58:02
 * @modify: 2015-08-24 16:58:02
 * @brief:  mwt-select.js
 ***********************************************************/

MWT.SelectField=function(opt)
{
    this.listeners={};
    this.options=[];
    if(opt)
	{
        if(isset(opt.options)) this.options=opt.options;
        this.construct(opt);
        if(this.id=="")this.id=this.render+"sel";
	}


    // create
    this.create=function(){
        var thiso=this;
        var domid=this.id;
        var code="<select id='"+this.id+"'";
        if(this.cls!=""){
            code+=" class='"+this.cls+"'";
        }else{
            code+=" class='form-control'";
        }
        if(this.style!="")code+=" style=\""+this.style+"\"";
        else code+=" style=\"width:auto;border-radius:2px;\"";
        code+=">";
		for(var i=0;i<this.options.length;++i){
            var v=isset(this.value)?this.value:0;
            var selected=this.options[i].value==v?"selected":"";
            code += "<option value='"+this.options[i].value+"' "+selected+">"+this.options[i].text+"</option>";
        }
        code+="</select>";
        jQuery("#"+this.render).html(code);
        // bundle event
        jQuery("#"+domid).change(function(){
            var v=jQuery(this).children('option:selected').val();
            thiso.value=v;
            thiso.fire("change");
        });
    };
    this.setValue=function(v){
        this.value=v;
        set_select_value(this.id,v);
    };
};
MWT.extends(MWT.SelectField, MWT.Field);
