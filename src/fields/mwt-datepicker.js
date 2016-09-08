/**
 * DatePicker
 **/

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.format = function(fmt)   
{
  var o = {   
    "m+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "M+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(2 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
};

MWT.DatePicker=function(opt)
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
        jQuery("#"+txtid).datepicker({
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
MWT.extends(MWT.DatePicker, MWT.Field);
