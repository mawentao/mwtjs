/**
 * 时间选择控件
 **/
MWT.DateTimePicker=function(opt)
{
    this.listeners={};
    this.format="yy/mm/dd";
    if (opt)
	{
        this.construct(opt);
        if(this.id=="")this.id=this.render+"txt";
        if(isset(opt.format))this.format=opt.format;
        if(!isset(opt.value)) this.value=new Date().format(this.format);
	}
    // create
    this.create=function(){
        var thiso=this;
        var txtid=this.id;
        var code="<input type='text' class='form-control form-datepicker'";
        if(this.style!="")code+=" style=\""+this.style+"\"";
        code+=" id='"+txtid+"' value='"+this.value+"' readonly/>";
        jQuery("#"+this.render).html(code);
        jQuery("#"+txtid).datetimepicker({
            changeMonth:true,
            numberOfMonths:1,
            dateFormat: this.format
        });
        jQuery("#"+txtid).change(function(){
            thiso.value=jQuery(this).val();
            thiso.fire("change");
        });
    };

    this.setValue=function(v){
        this.value=v;
        set_value(this.id,v);
    };
};
MWT.extends(MWT.DateTimePicker, MWT.Field);
