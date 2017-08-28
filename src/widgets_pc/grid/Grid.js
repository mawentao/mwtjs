/**
 * 表格
 */

require('./grid.css');

MWT.Grid=function(opt)
{
    var render=null;
    this.listeners={};

    this.grid_div=null;
    this.grid_chkbox_id=null;
    this.grid_chkbox_name=null;
    this.page_div=null;
    this.store={};
    this._pagebar = {};
    this.pagebar=true;
    this.pageSize=10;
    var pagebarSimple=false;   //!< 简单分页条
    var position='relative';   //!< 位置(relative:相对位置,其他:固定头部和尾部)

    this.tbar=null;
    this.cm={};
    this.cls="mwt-table";
    this.bordered=false;
    this.multiSelect=false;//!<多选按钮

    var filename="";    //!< 导出文件名
    var striped=false;  //!< 奇偶行变色
    var noheader=false; //!< 不显示表头 
    var notoolbox=false;//!< 不显示工具箱（导出,刷新,奇偶变色）
    var tableid='';
    var rowclick=null;  //!< 行点击事件处理函数
    var thiso=this;

    if(opt){
        if(opt.render)render=opt.render;
        if(opt.cm)this.cm=opt.cm;
        if(opt.cls)this.cls=opt.cls;
        if(opt.store){
            this.store=opt.store;
            var thiso=this;
            this.store.on("load", function(s){
                thiso.display();
            });
        }
        if(isset(opt.pagebar)) this.pagebar=opt.pagebar;
        if(isset(opt.pageSize)) this.pageSize=opt.pageSize;
        if(isset(opt.multiSelect))this.multiSelect=opt.multiSelect;
        if(isset(opt.tbar))this.tbar=opt.tbar;
        if(opt.striped)striped=true;
        if(opt.bordered)this.bordered=true;
        if(opt.noheader)noheader=true;
		if(opt.notoolbox)notoolbox=true;
        if(opt.rowclick)rowclick=opt.rowclick;
        if(opt.pagebarSimple)pagebarSimple=true;
        if(opt.filename)filename=opt.filename;
        if(opt.position)position=opt.position;
        tableid=render+"-tab";
        if(filename=='')filename=tableid+'.xls';
    }




    // 创建
    this.create=function(){
        this.grid_div="grid_div_"+opt.render;
        this.page_div="page_div_"+opt.render;
        this.grid_chkbox_id=this.grid_div+"-chkbox-id";
        this.grid_chkbox_name=this.grid_div+"-chkbox";
        
        // 相对布局
        var fiexd = position=='relative' ? '' : ' mwt-grid-fixed';
        var code='<div class="mwt-grid'+fiexd+'">';

        // tbar
		var tbarid=render+'-tbar';
        if(this.tbar){
            var style=opt.tbarStyle ? ' style="'+opt.tbarStyle+'"' : '';
            code+="<div class='mwt-grid-tbar' id='"+tbarid+"'"+style+"></div>";
        }

		// table
		code += '<div id="'+tableid+'">';
		{
        	// head
        	var columns=this.cm.getColumns();
			var headid=render+'-head';
        	var headcode='';
        	if (!noheader) {
            	headcode+='<thead><tr>';
            	if(this.multiSelect) headcode+="<th style='width:20px;text-align:center;'><input id='"+this.grid_chkbox_id+"' type='checkbox' onchange='set_checkbox_checked(\""+this.grid_chkbox_name+"\",this.checked);'/></th>";
            	var len=columns.length;
            	var thname = this.grid_div+"-th";
            	for(var i=0;i<len;++i){
                	if (columns[i].hide){continue;}
                	var width="";
                	if (columns[i].width){width="width='"+columns[i].width+"'";}
                	//var tdid = this.grid_div+"-"+columns[i].dataIndex+"-"+i;
                	headcode+="<th "+width+" name='"+thname+"' ";
					var style = '';
					if (isset(columns[i].align)) style+='text-align:'+columns[i].align+';';
					if (isset(columns[i].valign)) style+='vertical-align:'+columns[i].valign+';';
                	if (isset(columns[i].style)) style+=columns[i].style;
					headcode+='style="'+style+'"';
               		if (columns[i].sort) headcode+="class='grid-sort' ";
                	if (columns[i].poptitle) headcode+="pop-title='"+columns[i].poptitle+"' ";
                	headcode+="data-id='"+columns[i].dataIndex+"'>"+columns[i].head+"</th>";
            	}
            	headcode+="</tr></thead>";
            	if (position!='relative') {
                	// fixed布局让head和body在两个table里
                	code+='<div id="'+headid+'" class="mwt-grid-head"><table>'+headcode+'</table></div>';
            	}
        	}
        	// body
        	var bordered = this.bordered ? ' bordered' : '';
			var strip = striped ? ' striped' : '';
			var style = opt.bodyStyle ? ' style="'+opt.bodyStyle+'"' : '';
			var bodyid=render+'-body';
			code += '<div id="'+bodyid+'" class="mwt-grid-body'+bordered+strip+'"'+style+'><table>';
			if (position=='relative') code+=headcode;
			code += '<tbody id="'+this.grid_div+'"></tbody></table></div>';
		}
		code += '</div>';
        // foot
		var footid=render+'-foot';
		var toolbox = '';
		if (!notoolbox) {
			var act = striped ? 'active' : '';
			var stripedbtn = '<a href="javascript:;" id="'+tableid+'-trpbtn" class="bara '+act+'"><i class="fa fa-bars"></i></a>';
			var refershbtn = '<a href="javascript:;" id="'+tableid+'-refbtn" class="bara"><i class="fa fa-refresh"></i></a>';
			var exportbtn = '<a href="javascript:;" id="'+tableid+'-expbtn" class="bara"><i class="fa fa-download"></i></a>';
			var btns=[stripedbtn,refershbtn,exportbtn];
			toolbox = '<td align="right" width="94" style="padding:0;"><span class="seg"></span>'+btns.join('&nbsp;')+'</td>';
		}
        code+='<div id="'+footid+'" class="mwt-grid-foot">'+
            '<table width="100%"><tr><td id="'+this.page_div+'"></td>'+toolbox+'</tr></table>'+
          '</div>';
        code+='</div>';
        jQuery("#"+render).html(code);
		

        /////////////////////////////////////////////////
        // 导出按钮
        jQuery('#'+tableid+'-expbtn').unbind('click').click(function(){
            thiso.export_excel();
        });
        // 奇偶行变色
        jQuery('#'+tableid+'-trpbtn').unbind('click').click(function(){
            if (striped) {
                jQuery('#'+tableid).removeClass('striped');
                jQuery(this).removeClass('active');
            } else {
                jQuery('#'+tableid).addClass('striped');
                jQuery(this).addClass('active');
            }
            striped = !striped;
        });
        // 刷新按钮
        jQuery('#'+tableid+'-refbtn').unbind('click').click(function(){
            thiso.store.load();
        });
        if (!this.store.beforeLoad) {
            this.store.beforeLoad = function() {
                jQuery('#'+tableid+'-refbtn').unbind('click').
                    html('<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>');
            };
        }
        if (!this.store.afterLoad) {
            this.store.afterLoad = function() {
                jQuery('#'+tableid+'-refbtn').unbind('click')
                    .html('<i class="fa fa-refresh"></i>')
                    .click(function(){thiso.store.load();});
            };
        }
        /////////////////////////////////////////////////
        // 表头事件
        if (!noheader) {
            this.initevent();
            mwt.popinit();
        }

        //create tbar
        if(this.tbar){
            var tbar=new MWT.Bar({render:tbarid,"items":this.tbar});
            tbar.create();
        }

        //create pagebar
        if(this.pagebar){
            this._pagebar = new MWT.PageBar({
                "store"   : this.store,
                "render"  : this.page_div,
                "pageSize": this.pageSize,
                "simple"  : pagebarSimple
            });
        }
        //
        else {
            this.store.on('load',function(res){
                var code = '<span style="font-size:12px;color:#777;">共 '+res.totalProperty+' 条记录</span>';
                jQuery('#'+thiso.page_div).html(code);
            });
        }

		////////////////////////////////////////////
		// fixed布局自动计算top和bottom距离
		this.autolayout();
		/*if (position!='relative') {
			var headh = jQuery('#'+tableid).position().top;
			if(!noheader){headh+=jQuery('#'+headid).height();}
			var footh = jQuery('#'+footid).height();
			jQuery('#'+bodyid).css({'top':headh+1,'bottom':footh+17});
		}*/
    };

	// fixed布局自动计算top和bottom距离
	this.autolayout=function() {
		if (position!='relative') {
			var headh = jQuery('#'+tableid).position().top;
			if(!noheader){headh+=jQuery('#'+render+'-head').height();}
			var footh = jQuery('#'+render+'-foot').height();
			jQuery('#'+render+'-body').css({'top':headh+1,'bottom':footh+17});
		}
	};

    // 获取记录
    this.getRecord=function(key,value){
        var idx=this.store.indexOf(key,value);
        if(idx<0||idx>=this.store.size()){return null;}
        return this.store.get(idx);
    };

    // 加载数据
    this.load=function(params){
        if (isset(params))this.store.baseParams = params;
        if (this.pagebar) this._pagebar.changePage(1);
        else this.store.load();
    };

    // 显示Grid（如果设置了render）
    this.display=function(){
        if(!render){return;}
        if(!this.grid_div){
            this.create();
        }
        var columns=this.cm.getColumns();
        var len=columns.length;
        var html="";
        var size=this.store.size();
        if (size==0) {
            var emptymsg = opt.emptyMsg ? opt.emptyMsg : "查询记录为空";
            html += '<tr class="empty"><td colspan="'+(len+1)+'">'+emptymsg+'</td></tr>';
        } else {
            var trname = render+"row";
            for(var i=0;i<size;++i){
                var item=this.store.get(i);
                item.store_index = i;
                html+="<tr name='"+trname+"' data-idx='"+i+"'>";
                if(this.multiSelect) 
                    html+="<td style='width:20px;text-align:center;'><input name='"+this.grid_chkbox_name+"' value='"+i+"' type='checkbox'/></td>";
                for(var c=0;c<len;++c){
                    if (columns[c].hide){continue;}
                    var dataidx=columns[c].dataIndex;
                    var v = item[dataidx];
                    if (columns[c].render){
                        var func=columns[c].render;
                        v = func(v,item);
                    }
                    html+="<td ";
                    //var width="";
                    if (columns[c].width){html+="width='"+columns[c].width+"' ";}
                    if (isset(columns[c].align)) html+="align='"+columns[c].align+"' ";
                    if (isset(columns[c].valign))html+="valign='"+columns[c].valign+"' ";
                    if (isset(columns[c].style)) html+="style='"+columns[c].style+"' ";
                    html+=">"+v+"</td>";
                }
                html+="</tr>";
            }
        }
        jQuery("#"+this.grid_div).html(html);
        if (rowclick) {
            jQuery("[name="+trname+"]").unbind('click').click(function(){
                var idx = jQuery(this).data('idx');
                var im = thiso.store.get(idx);
                rowclick(im);
            });
        }
    };

    // 获取选中项
    this.getSelectedRecords=function(){
        var values=get_checkbox_values(this.grid_chkbox_name);
        var records=[];
        for(var i=0;i<values.length;++i){
            var item=this.store.get(values[i]);
            item.store_index=values[i];
            records.push(item);
        }
        return records;
    };

    // 初始化事件
    this.initevent=function(){
        //1. 列标题排序点击事件
        var jthAll = jQuery('[name='+thiso.grid_div+'-th]');
        jthAll.unbind('click').click(function(){
            var jthis = jQuery(this);
            if (!jthis.hasClass('grid-sort')) return;
            //1-1. 样式
            var sortCls = jthis.hasClass('grid-sort-asc') ? 'grid-sort-desc' : 'grid-sort-asc';
            jthAll.removeClass('grid-sort-asc').removeClass('grid-sort-desc');
            jthis.addClass(sortCls);
            //1-2. reload
            var dir=(sortCls=='grid-sort-asc')?"ASC":"DESC";
            thiso.store.baseParams["sort"]=jthis.data('id');
            thiso.store.baseParams["dir"]=dir;
            thiso.load();
        });
    };

    // 导出到excel
    this.export_excel=function() {
        export_excel(tableid,filename);
    };
};
MWT.extends(MWT.Grid, MWT.Event);


MWT.Grid.ColumnModel=function(opt)
{
    this.columns=[];

    if(opt){
        this.columns=opt;
    }

    this.getColumns=function(){return this.columns;};
};
