/**
 * 日期区间选择空间
 **/
MWT.DaterangepickerField=function(opt)
{
	var thiso=this;
    this.listeners={};
    this.value=-1;
    var format="yy/mm/dd";
	var txtid='';
	var fromdate,todate,fromid,toid;
    this.float="left";
    if (opt)
	{
        this.construct(opt);
        if(isset(opt.format)) format=opt.format;
        if(isset(opt.float)) this.float=opt.float;
        if(this.id=="")this.id=this.render+"txt";
		txtid = this.id;
		fromid=this.id+"from";
		toid=this.id+"to";
	}

	// 初始化弹出层(创建日历选择)
	function initPopDiv(popid) 
	{/*{{{*/
		var jpop = jQuery('#'+popid);
		//1. 创建dom
		var code = "<div class='btn-bar'>"+
		  '<div class="mwt-btn-group" style="float:left;">'+
            '<button class="date-submit mwt-btn mwt-btn-default mwt-btn-xs" data-value="-90">近90天</button>'+
			'<button class="date-submit mwt-btn mwt-btn-default mwt-btn-xs" data-value="-60">近60天</button>'+
			'<button class="date-submit mwt-btn mwt-btn-default mwt-btn-xs" data-value="-30">近30天</button>'+
			'<button class="date-submit mwt-btn mwt-btn-default mwt-btn-xs" data-value="-7">近7天</button>'+
			'<button class="date-submit mwt-btn mwt-btn-default mwt-btn-xs" data-value="-1">昨天</button>'+
			'<button class="date-submit mwt-btn mwt-btn-default mwt-btn-xs" data-value="0">今天</button>'+
			'<button class="date-submit mwt-btn mwt-btn-default mwt-btn-xs" data-value="na">置空</button>'+
          '</div>'+
		  '<div style="float:right">'+
			'<button class="date-submit mwt-btn mwt-btn-primary mwt-btn-xs" data-value="yes">确定</button>'+
		  '</div>'+
        "</div>"+
        '<div class="date-area" id="'+fromid+'" style="display:inline-block;"></div>'+
		'<div class="date-area" id="'+toid+'" style="float:right;"></div>';
		jpop.html(code).css({'background':'#eee','border':'solid 1px #aaa'});
		//2. 初始化日历
		var fromdom=jQuery("#"+fromid);
        var todom=jQuery("#"+toid);
        fromdom.datepicker({
			changeMonth: true,
			numberOfMonths: 1,
			onSelect : function( selectedDate ) {
                todom.datepicker( "option", "minDate", selectedDate );
            }
        });
        todom.datepicker({
			changeMonth: true,
			numberOfMonths: 1,
			onSelect : function( selectedDate ) {
			    fromdom.datepicker( "option", "maxDate", selectedDate );
			}
        });
		//3. 初始化事件
        var obj=jQuery('#'+popid);
        obj.find('.date-submit').click(function(){
            var btn = jQuery(this);
			var v = btn.data('value');
			// 取消
			if(v=="cancel"){
				jpop.hide();
				return;
			}
			// 快选按钮
            if (v=='yes') {
				var f = fromdom.datepicker('getDate').format(format);
				var t = todom.datepicker('getDate').format(format);
				fromdate=new Date(f);
				todate=new Date(t);
            }
            else if(v=='na') {
                v = '';
                thiso.setValue(v);
				jpop.hide();
                return;
            }else {
                v = parseInt(v);
                fromdate=new Date();
                todate=new Date();
				if (v<0) {
					fromdate.setTime(fromdate.getTime()+86400000*v);
					todate.setTime(todate.getTime()-86400000);
				}
				syncDatePicker();
			}
            var fv=fromdom.datepicker('getDate').format(format);
            var tv=todom.datepicker('getDate').format(format);
            thiso.value=fv+" ~ "+tv;
            jQuery("#"+txtid).val(thiso.value);
            jpop.hide();
            thiso.fire("change");
        });
	}/*}}}*/

	// 同步text到datepicker
	function syncDatePicker() 
	{/*{{{*/
		jQuery("#"+fromid).datepicker('setDate',fromdate);
		jQuery("#"+toid).datepicker('setDate',todate);
	}/*}}}*/

    // create
    this.create=function()
	{/*{{{*/
        var style=" style=\"width:165px;font:normal 12px Arial;\" ";
        if(this.style!="")style=" style=\""+this.style+"\" ";
        var code= "<input type='text' class='mwt-field mwt-datepicker'"+style+"id='"+txtid+"' "+
                    "value='"+this.value+"' placeholder='请选择时间区间' readonly/>"+
                    '<i class="fa fa-calendar"></i>';
        jQuery("#"+this.render).html(code);
        var txtdom=jQuery("#"+txtid);
        txtdom.click(function(){
			mwt.showPop(txtid,txtid+'pop',470,281,function(popid){
				if (jQuery('#'+popid).html()=='') {
					initPopDiv(popid);
				}
				syncDatePicker();
			});
        });
        this.setValue(this.value);
    };/*}}}*/

	// 设置值
	this.setValue=function(v) 
    {/*{{{*/
        // 数字值处理
        if (mwt.isNumber(v)) {
            v = parseInt(v);
            fromdate=new Date();
            todate=new Date();
            if (v<0) {
			    fromdate.setTime(fromdate.getTime()+86400000*v);
                todate.setTime(todate.getTime()-86400000);
            } else {
			    fromdate.setTime(fromdate.getTime()+86400000*0);
                todate.setTime(todate.getTime()+86400000*v);
            }
            var fv = fromdate.format(format);
            var tv = todate.format(format);
            v = fv+" ~ "+tv;
        }
		this.value = v;
		jQuery('#'+txtid).val(this.value);
		var arr = v.split(' ~ ');
		fromdate=new Date(arr[0]);
		todate=new Date(arr[1]);
		this.fire("change");
	};/*}}}*/

};
MWT.extends(MWT.DaterangepickerField, MWT.Field);
