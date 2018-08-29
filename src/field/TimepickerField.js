/**
 * 时间选择器
 **/
MWT.TimepickerField=function(opt)
{
    this.listeners={};
    this.options=[];
	var name='';
    var thiso=this;
    var vMap = {};
    if(opt)
	{
        if(isset(opt.options)) this.options=opt.options;
        this.construct(opt);
        if(this.id=="")this.id=this.render+"sel";
		name=opt.name ? opt.name : this.id;
        if (!this.options.length) {
            for (var h=0;h<24;++h) {
                for (var m=0;m<60;m+=5) {
                    var hm = (h<10?'0'+h:h)+':'+(m<10?'0'+m:m);
                    this.options.push({text:hm,value:hm});
                }
            }
        }
        for (var i=0;i<this.options.length;++i) {
            vMap[this.options[i].value] = i;
        }
	}

    // create
    this.create=function(){
        var domid=this.id;
        var sel="<select id='"+this.id+"' name='"+name+"' class='mwt-btn mwt-btn-default'>";
		for(var i=0;i<this.options.length;++i){
            var v=isset(this.value)?this.value:0;
            var selected=this.options[i].value==v?"selected":"";
            sel += "<option value='"+this.options[i].value+"' "+selected+">"+this.options[i].text+"</option>";
        }
        sel+="</select>";

        var code = '<div class="mwt-btn-group">'+
            '<button name="btn-'+domid+'" data-v="-1" class="mwt-btn mwt-btn-default"><i class="fa fa-angle-left"></i></button>'+
            sel+
            '<button name="btn-'+domid+'" data-v="+1" class="mwt-btn mwt-btn-default"><i class="fa fa-angle-right"></i></button>'+
        '</div>';
        jQuery("#"+this.render).html(code);
        // bundle event
        jQuery("#"+domid).change(function(){
            var v=jQuery(this).children('option:selected').val();
            thiso.value=v;
            thiso.fire("change");
        });
        jQuery('[name="btn-'+domid+'"]').unbind('click').click(function(){
            var v = jQuery('#'+domid).children('option:selected').val();
            var vi = vMap[v];
            var step = parseInt(jQuery(this).data('v'));
            vi += step;
            if (vi<0) vi=0;
            else if (vi>=thiso.options.length) vi=thiso.options.length-1;
            var im = thiso.options[vi];
            thiso.setValue(im.value);
        });
    };
    this.setValue=function(v){
        var selid = this.id;
        mwt.set_select_value(selid,v);
        this.value=jQuery('#'+selid).children('option:selected').val();
        thiso.fire("change");
    };

};
MWT.extends(MWT.TimepickerField, MWT.Field);
