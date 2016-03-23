/**
 * DateRangePicker
 **/
MWT.DateRangePicker=function(opt)
{
    this.listeners={};
    this.format="yy/mm/dd";
    this.float="left";
    if (opt)
	{
        this.construct(opt);
        if(isset(opt.format)) this.format=opt.format;
        if(isset(opt.float)) this.float=opt.float;
		//if(isset(opt.value)) this.value=opt.value;
        //else this.value=new Date().format(this.format);
        if(this.id=="")this.id=this.render+"txt";
	}
    // create
    this.create=function(){
        var thiso=this;
        var txtid=this.id;
        var rangeid=this.id+"rdiv";
        var fromid=this.id+"from";
        var toid=this.id+"to";
        var style=" style=\"width:180px\" ";
        if(this.style!="")style=" style=\""+this.style+"\" ";
        var code="<div class='date-range'><input type='text' class='form-control form-datepicker'"+style+
                 "id='"+txtid+"' value='"+this.value+"' readonly/>"+
              "<div class='date-pop' id='"+rangeid+"' style='"+this.float+":0;'>"+
                "<div class='btn-bar'>"+
                  '<button class="date-submit mwt-btn mwt-btn-default mwt-btn-sm" data-value="90">最近90天</button>'+
                  '<button class="date-submit mwt-btn mwt-btn-default mwt-btn-sm" data-value="60">最近60天</button>'+
                  '<button class="date-submit mwt-btn mwt-btn-default mwt-btn-sm" data-value="30">最近30天</button>'+
                  '<button class="date-submit mwt-btn mwt-btn-default mwt-btn-sm" data-value="7">最近7天</button>'+
                  '<button class="date-submit mwt-btn mwt-btn-danger mwt-btn-sm fr" data-value="cancel">取消</button>'+
                  '<button class="date-submit mwt-btn mwt-btn-primary mwt-btn-sm fr">确定</button>'+
                "</div>"+
                '<div class="date-area" id="'+fromid+'"></div>'+
                '<div class="date-area" id="'+toid+'" style="float:right;"></div>'+
              "</div></div>";
        jQuery("#"+this.render).html(code);
        var txtdom=jQuery("#"+txtid);
        txtdom.click(function(){
            jQuery("#"+rangeid).show('fast');
        });
        var fromdom=jQuery("#"+fromid);
        var todom=jQuery("#"+toid);
        fromdom.datepicker({
            defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1,
			onSelect : function( selectedDate ) {
                todom.datepicker( "option", "minDate", selectedDate );
            }
        });
        todom.datepicker({
            defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1,
			onSelect : function( selectedDate ) {
			    fromdom.datepicker( "option", "maxDate", selectedDate );
			}
        });
        var obj=jQuery('#'+rangeid);
        obj.find('.date-submit').click(function(){
            var btn = jQuery(this);
            if(btn.data('value')){
                var v=btn.data('value');
                if(v=="cancel"){
                    jQuery("#"+rangeid).hide('fast');
                    return;
                }
                var fromdate=new Date();
                var todate=new Date();
                fromdate.setTime(fromdate.getTime()-86400000*v);
                todate.setTime(todate.getTime()-86400000);
                fromdom.datepicker('setDate',fromdate); 
                todom.datepicker('setDate',todate); 
            }
            var fv=fromdom.datepicker('getDate').format(thiso.format);
            var tv=todom.datepicker('getDate').format(thiso.format);
            thiso.value=fv+" ~ "+tv;
            txtdom.val(thiso.value);
            jQuery("#"+rangeid).hide('fast');
            thiso.fire("change");
        });
        this.setDefault(7);
    };

    this.setDefault=function(v){
        var thiso=this;
        var fromid=this.id+"from";
        var toid=this.id+"to";
        var txtid=this.id;
        var fromdom=jQuery("#"+fromid);
        var todom=jQuery("#"+toid);
        var txtdom=jQuery("#"+txtid);
		var fromdate=new Date();
		var todate=new Date();
		fromdate.setTime(fromdate.getTime()-86400000*v);
		todate.setTime(todate.getTime()-86400000);
		fromdom.datepicker('setDate',fromdate); 
		todom.datepicker('setDate',todate); 
		var fv=fromdom.datepicker('getDate').format(thiso.format);
		var tv=todom.datepicker('getDate').format(thiso.format);
		thiso.value=fv+" ~ "+tv;
		txtdom.val(thiso.value);
    };
};
MWT.extends(MWT.DateRangePicker, MWT.Field);
