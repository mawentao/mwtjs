define(function(require){
/* 维度选择器 */
var DimSelect=function(opt)
{
	this.listeners={};
	var isDate=false;			//!< 是否日期维度
	var btnid,txtid,optdivid;
	var cfmbtnid;				//!< 确认按钮domID
	var store,grid; 			//!< 非日期选择
	var dimInfo;
	var dateFormat = 'yy/mm/dd'; //!< 日期格式(不可以yymmdd)
	var thiso=this;
	if(opt) {
		this.construct(opt);
		btnid = this.render+'-btn';
        txtid = this.render+'-btn-txt';
        optdivid = this.render+'-opt';
		cfmbtnid = this.render+'-cfmbtn';
		if (opt.dimInfo) dimInfo=opt.dimInfo;
		if (dimInfo.dimtable=='date') isDate=true;
	}

	////////////////////////////////////////////////////////
	// 日期区间选择器
	function create_daterange_select()
	{/*{{{*/
		var fromid = 'from-'+optdivid;
		var toid = 'to-'+optdivid;
		var qbtn = 'qbtn-'+optdivid;
		var code="<div class='date-range' style='margin:10px 5px;'>"+
              "<div style='left:0;'>"+
                "<div class='btn-bar' style='margin-bottom:8px;'>"+
				  '<div class="mwt-btn-group-radius">'+
                    '<button name="'+qbtn+'" class="mwt-btn mwt-btn-default mwt-btn-sm" data-value="-90">最近90天</button>'+
                    '<button name="'+qbtn+'" class="mwt-btn mwt-btn-default mwt-btn-sm" data-value="-60">最近60天</button>'+
                    '<button name="'+qbtn+'" class="mwt-btn mwt-btn-default mwt-btn-sm" data-value="-30">最近30天</button>'+
                    '<button name="'+qbtn+'" class="mwt-btn mwt-btn-default mwt-btn-sm" data-value="-7">最近7天</button>'+
                    '<button name="'+qbtn+'" class="mwt-btn mwt-btn-default mwt-btn-sm" data-value="-1">昨天</button>'+
                    '<button name="'+qbtn+'" class="mwt-btn mwt-btn-default mwt-btn-sm" data-value="0">今天</button>'+
				  '</div>'+
				  '<div class="mwt-btn-group-radius" style="float:right;">'+
                    '<button id="'+cfmbtnid+'" class="mwt-btn mwt-btn-primary mwt-btn-xs" style="padding:3px 10px;border-radius:2px;margin-top:3px;">确定</button>'+
				  '</div>'+
                "</div>"+
                '<div class="date-area" id="'+fromid+'" style="display:inline-block;"></div>'+
                '<div class="date-area" id="'+toid+'" style="float:right;"></div>'+
              "</div></div>";
        jQuery("#"+optdivid).html(code).css({'height':'278px','margin-top':'-139px'});
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
		// 快捷按钮
		jQuery('[name='+qbtn+']').unbind('click').click(function(){
			var v = jQuery(this).data('value');
			setDateRange(v);
		});
		// 同步默认值
		var arr = thiso.value.split(' ~ ');
		var fromdate = new Date(arr[0]);
		var todate = new Date(arr[1]);
		fromdom.datepicker('setDate',fromdate);
		todom.datepicker('setDate',todate);
	}/*}}}*/

	// 获取日期区间
	function getDateRange(v) 
	{/*{{{*/
		var fromdate=new Date();
		var todate=new Date();
		if (v<0) {
			fromdate.setTime(fromdate.getTime()+86400000*v);
			todate.setTime(todate.getTime()-86400000);
		}
		var fv = fromdate.format("yy/mm/dd");
		var tv = todate.format("yy/mm/dd");
		return fv+' ~ '+tv;
	}/*}}}*/

	// 设置日期区间 
	function setDateRange(v)
	{/*{{{*/
		var fromdate=new Date();
		var todate=new Date();
		if (v<0) {
			fromdate.setTime(fromdate.getTime()+86400000*v);
			todate.setTime(todate.getTime()-86400000);
		}
		jQuery("#from-"+optdivid).datepicker('setDate',fromdate);
		jQuery("#to-"+optdivid).datepicker('setDate',todate); 
		syncValue();
    }/*}}}*/

	////////////////////////////////////////////////////////
	// 维度选择器(非日期维度)
	function create_dim_select()
	{/*{{{*/
		var gridid = 'grid-'+optdivid;
		var code = '<div id="'+gridid+'" class="fill" style="background:#fff;"></div>';
        jQuery("#"+optdivid).html(code).css({'width':'400px'});

		store = new MWT.Store({
            url: ajax.getAjaxUrl('t_datacube_table_dim&action=query_data')
        });
        grid = new MWT.Grid({
            render        : gridid,
            store         : store,
            noheader      : false,
            pagebar       : true, //!< false 表示不分页
            pageSize      : 100,
            pagebarSimple : true,      //!< 简化版分页栏
            notoolbox     : true,        //!< 不显示右下角工具箱
            multiSelect   : true, 
			position	  : 'fixed',
            bordered      : false,
			striped		  : true,
			tbarStyle : 'background:#eee',
            cm: new MWT.Grid.ColumnModel([
            	{head:"全选", dataIndex:"dname", sort:true}/*,
              	{head:"维度ID", dataIndex:"did", sort:true, align:'right',width:200,render:function(v){
					return v;
              	}}*/
            ]),
            tbar: [
				{html:'<label style="color:#0096A9;">选择'+dimInfo.dimname+'</label>'},'->',
              	{type:"search",label:"查询",id:"sokey-"+optdivid,width:140,placeholder:'查询维度',handler:query},
				{label:"确定",handler:syncValue}
            ],
            rowclick: function(im) {
                //print_r(im);
                //fd.setText(im.name);
                //fd.setValue(im.id);
            }
        });
        grid.create();
		store.on('load',function(){grid.autolayout();});
		query();
	}/*}}}*/

	function query() 
	{/*{{{*/
		store.baseParams = {
            key: get_value('sokey-'+optdivid),
			table_name: dimInfo.dimtable
        };
        grid.load();
	}/*}}}*/
	////////////////////////////////////////////////////////

	// 弹出框
	function create_pop() 
	{/*{{{*/
		if (dimInfo.dimtable=='date') {
			create_daterange_select();
		} else {
			create_dim_select();
		}
		// 点击确认按钮
		jQuery('#'+cfmbtnid).unbind('click').click(syncValue);
	}/*}}}*/

	// 点击确认按钮
	function syncValue() 
	{/*{{{*/
		// 日期区间
		if (dimInfo.dimtable=='date') {
			var fv = jQuery("#from-"+optdivid).datepicker('getDate').format(dateFormat);
			var tv = jQuery("#to-"+optdivid).datepicker('getDate').format(dateFormat);
			thiso.value=fv+" ~ "+tv;
			jQuery('#'+txtid).html(thiso.value);
		}
		// 非日期区间 
		else {
			var records=grid.getSelectedRecords();
			if (records.length==0) {
				thiso.value = -1;
				jQuery('#'+txtid).html('不限').css({'color':'gray'});
			} else {
				var vs = [];
				var ts = [];
				for (var i=0;i<records.length;++i) {
					var rd = records[i];
					vs.push(rd.did);
					ts.push(rd.dname);
				}
				thiso.value = vs.join(',');
				jQuery('#'+txtid).html(ts.join(',')).css({'color':'#0096A9'});
			}
		}
		popclose();
		thiso.fire('change');
	};/*}}}*/

	this.create = function() {
		var render = this.render;
		var icon = isDate ? 'fa fa-calendar' : 'fa fa-caret-down';
		var code = '<div class="mwt-field">'+
           	  '<a id="'+btnid+'" class="mwt-btn mwt-btn-default mwt-btn-xs form-control dimmsel" href="javascript:;">'+
              '<span id="'+txtid+'" class="dimlabel" style="max-width:150px">请选择...</span><i class="'+icon+'"></i></a>'+
        	'</div>'+
        '</div>';
		jQuery("#"+this.render).html(code);
		// 默认值
		if (dimInfo.dimtable=='date') {
			thiso.value = getDateRange(-7);			//!< 日期默认选最近7天
			jQuery('#'+txtid).html(thiso.value).css({'color':'#0096A9'});
		} else {
			thiso.value = -1;	//!< 默认不限
			jQuery('#'+txtid).html('不限').css({'color':'gray'});;
		}

		// 点击选择器,弹框
		jQuery("#"+btnid).click(function(event){
			if (!mwt.$(optdivid)) {
				MWT.create_div(optdivid);
				var dom=MWT.$(optdivid);
				dom.style = "position:absolute;left:260px;top:50%;margin-top:-200px;height:400px;width:510px;border:solid 1px #ccc;background:#f2f2f2;box-shadow:0 0 20px #ccc;";
				jQuery("#"+optdivid).unbind('click').click(function(event){
            		event.stopPropagation();
       			});
			}
			var jpop = jQuery("#"+optdivid);
            jpop.show();
			if (jpop.html()=='') {
				create_pop();
			}
            thiso.fire('pop');
			// 点击非弹出区域,弹出框消失
            jQuery(document).on("click",popclose);
            event.stopPropagation();
        });
        // 通知
        this.fire('create');
	};

	// 弹出框消失
	function popclose() {jQuery("#"+optdivid).hide();}
};

MWT.extends(DimSelect,MWT.Field);

return DimSelect;
});
