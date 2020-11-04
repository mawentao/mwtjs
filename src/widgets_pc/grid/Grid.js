/**
 * 表格
 */
require('./grid.css');

MWT.Grid=function(opt)
{
    var render=null;
    this.listeners={};

    this.grid_div=null;
    this.store={};
    this._pagebar = {};
    this.pagebar=true;         //!< 是否分页
    this.pageSize=20;          //!< 页面大小
    this.pageStyle=1;          //!< 分页样式(详见PageBar的配置)
    this.pageSizeList=[10,20,50,100,500,1000,5000];   //!< 分页页面大小选择
    var pagebarSimple=false;   //!< 简单分页条
    var position='relative';   //!< 位置(relative:相对位置,其他:固定头部和尾部)

    this.tbar=null;
    this.cm={};
    this.cls="";
    this.bordered=false;
    this.multiSelect=false;//!<多选按钮

    var filename="";    //!< 导出文件名
    var striped=false;  //!< 奇偶行变色
    var noheader=false; //!< 不显示表头 
    var notoolbox=false;//!< 不显示工具箱（导出,刷新,奇偶变色）
    var tableid='';
    var rowclick=null;  //!< 行点击事件处理函数

    if(opt){
        if(opt.render)render=opt.render;
        if(opt.cm)this.cm=opt.cm;
        if(opt.cls)this.cls=opt.cls;
        if(opt.store){
            this.store=opt.store;
            var thiso=this;
            this.store.on("load", function(){
                thiso.display();
            });
        }
        if(isset(opt.pagebar)) this.pagebar=opt.pagebar;
        if(isset(opt.pageSize)) this.pageSize=opt.pageSize;
        if(isset(opt.pageStyle)) this.pageStyle=opt.pageStyle;
        if(isset(opt.pageSizeList)) this.pageSizeList=opt.pageSizeList;
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
        if(filename=='')filename=tableid;
    }
    var tbarDomid  = 'tbar-'+render;
    var theadDomid = 'thead-'+render;
    var tbodyDomid = 'tbody-'+render;
    var tfootDomid = 'tfoot-'+render;
    var thiso = this;
	var grid_chkbox_name = 'cbxname-'+render;

    // 初始化表格布局
    function initLayout() {
        //1. tbar
        var tbarHtml = "";
        if(thiso.tbar && thiso.tbar.length){
            var style=opt.tbarStyle ? ' style="'+opt.tbarStyle+'"' : '';
            tbarHtml+="<div id='"+tbarDomid+"' class='mwt-grid-tbar'"+style+"></div>";
        }
        //2. table
        var tableHtml = "";
        var tbcls = 'mwt-table';
        if (thiso.bordered) tbcls+=' bordered';
        if (striped) tbcls+=' striped';
        if (position=='fixed') tbcls+=' mwt-table-fixed';
        if (thiso.cls) tbcls+=' '+thiso.cls;
        tableHtml = '<table id="'+tableid+'" class="'+tbcls+'">'+
            '<tbody id="'+theadDomid+'" class="mwt-table-head"></tbody>'+
            '<tbody id="'+tbodyDomid+'" class="mwt-table-body"></tbody>'+
            '<tfoot id="'+tfootDomid+'" class="mwt-table-foot"></tfoot>'+
        '</table>';
        //9. 合成container
        var code = '<div id="container-'+render+'" class="mwt-grid-container">'+tbarHtml+tableHtml+'</div>';
        jQuery("#"+render).html(code);
    }

    // 初始化tbar
    function initTbar() {
        if(thiso.tbar){
            new MWT.ToolBar({render:tbarDomid,items:thiso.tbar}).create();
        }
    }

    // 初始化表头
    function initHead() {
        // 0.不需要表头
        if (noheader) {
            mwt.$(theadDomid).remove();
            return;
        }

        //1. 创建表头元素
        var columns=thiso.cm.getColumns();
        var cn = columns.length;
        var headcode = '<tr style="border-top:none;">';
        if(thiso.multiSelect) {
            headcode+='<th '+thiso.cm.getMultiSelectColumnStyle()+'>'+
                "<input type='checkbox' id='ckbox-"+render+"' onchange='mwt.set_checkbox_checked(\""+grid_chkbox_name+"\",this.checked);'/></th>";
        }
        var thname = thiso.grid_div+"-th";
        for(var i=0;i<cn;++i){
            var column=columns[i];
            if (column.hide){continue;}
            var style = thiso.cm.getColumnStyle(i);
            headcode+="<th name='"+thname+"' "+style;
            if (column.sort) headcode+=" class='grid-sort'";
            if (column.poptitle) headcode+=" pop-title='"+column.poptitle+"' ";
            headcode+=" data-id='"+column.dataIndex+"'>"+column.head+"</th>";
        }
        headcode+="</tr>";
        jQuery("#"+theadDomid).html(headcode);

        //2. 列标题排序点击事件
        var jthAll = jQuery('[name='+thname+']');
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

        mwt.popinit();
    }

    // 初始化Foot
    function initFoot() {
        //0. 不需要footbar
        if (!thiso.pagebar && thiso.notoolbox) {
            mwt.$(tfootDomid).remove();
            return;
        }

        //1. 初始化foot布局
        var columns=thiso.cm.getColumns();
        var cn = columns.length;
        var  code = '<tr><td colspan="'+(cn+1)+'">'+
            '<div class="mwt-row mwt-row-flex">'+
                '<div class="mwt-col-fill" id="pagebar-'+render+'"></div>'+
                '<div class="mwt-col-wd mwt-grid-foot-toolbox" id="toolbox-'+render+'"></div>'+
            '</div>'+
        '</td></tr>';
        jQuery('#'+tfootDomid).html(code);

        //2. 创建pagebar
        if (thiso.pagebar) {
            thiso._pagebar = new MWT.PageBar({
                "render"   : 'pagebar-'+render,
                "store"    : thiso.store,
                "pageSize" : thiso.pageSize,
                "simple"   : pagebarSimple,
                "pageStyle": thiso.pageStyle,
                "pageSizeList": thiso.pageSizeList
            });
        } else {
            thiso.store.on('load',function(res){
                var code = '<label>共 '+res.totalProperty+' 条记录</label>';
                jQuery('#pagebar-'+render).html(code);
            });
        }

        //3. 创建toolbox
        if (notoolbox) {
            mwt.$('toolbox-'+render).remove();
        } else {
            var act = striped ? 'active' : '';
            var stripedbtn='<a href="javascript:;" id="'+tableid+'-trpbtn" class="bara '+act+'"><i class="fa fa-bars"></i></a>';
            var refershbtn='<a href="javascript:;" id="'+tableid+'-refbtn" class="bara"><i class="fa fa-refresh"></i></a>';
            var exportbtn='<a href="javascript:;" id="'+tableid+'-expbtn" class="bara"><i class="fa fa-download"></i></a>';
            var btns=[stripedbtn,refershbtn,exportbtn];
            jQuery('#toolbox-'+render).html('<span class="seg"></span>'+btns.join('&nbsp;'));

            //3.1 导出按钮
            jQuery('#'+tableid+'-expbtn').unbind('click').click(function(){
                thiso.exportExcel();
            });
            //3.2 奇偶行变色
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
            //3.3 刷新按钮
            jQuery('#'+tableid+'-refbtn').unbind('click').click(function(){
                thiso.store.load();
            });
        }
    }

    // 自动排版
    function autoComposition() {
        if (position!="fixed") return;
        if (mwt.$(tbarDomid)) {
            var tbarHeight = mwt.$(tbarDomid).offsetHeight;
            var tbarMarginBottom = parseInt(mwt.$(tbarDomid).style.marginBottom);
            if (!tbarMarginBottom) tbarMarginBottom=0;
            jQuery('#'+tableid).css({top:tbarHeight+tbarMarginBottom-1});
        }

        var theadHeight = mwt.$(theadDomid).offsetHeight;
        var tfootHeight = mwt.$(tfootDomid) ? mwt.$(tfootDomid).offsetHeight : 0;
        jQuery('#'+tbodyDomid).css({top:theadHeight,bottom:tfootHeight});
    }

    // 创建
    this.create=function()
    {/*{{{*/
        this.grid_div="grid_div_"+opt.render;

        //1. 初始化布局
        initLayout();

        //2. 创建Dom元素
        initTbar();
        initHead();
        initFoot();

        //3. 自动排版
        autoComposition();

        //4. 加载动画
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
    };/*}}}*/

    // 获取记录
    this.getRecord=function(key,value)
    {/*{{{*/
        var idx=this.store.indexOf(key,value);
        if(idx<0||idx>=this.store.size()){return null;}
        return this.store.get(idx);
    };/*}}}*/

    // 加载数据
    this.load=function(params)
    {/*{{{*/
        if (isset(params))this.store.baseParams = params;
        if (this.pagebar) this._pagebar.changePage(1);
        else this.store.load();
    };/*}}}*/

    // 显示Grid（如果设置了render）
    this.display=function()
    {/*{{{*/
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
                    html+="<td style='width:30px;text-align:center;'><input name='"+grid_chkbox_name+"' value='"+i+"' type='checkbox'/></td>";
                for(var c=0;c<len;++c){
                    if (columns[c].hide){continue;}
                    var dataidx=columns[c].dataIndex;
                    var v = item[dataidx];
                    if (columns[c].render){
                        var func=columns[c].render;
                        v = func(v,item,i,this._pagebar);
                    }
                    html+="<td ";
                    var width= columns[c].width ? columns[c].width : 'auto';
                    html+="width='"+width+"' ";
                    if (isset(columns[c].align)) html+="align='"+columns[c].align+"' ";
                    if (isset(columns[c].valign))html+="valign='"+columns[c].valign+"' ";
                    if (isset(columns[c].style)) html+="style='"+columns[c].style+"' ";
                    html+=">"+v+"</td>";
                }
                html+="</tr>";
            }
        }
        jQuery("#"+tbodyDomid).html(html);
        if (rowclick) {
            jQuery("[name="+trname+"]").unbind('click').click(function(){
                var idx = jQuery(this).data('idx');
                var im = thiso.store.get(idx);
                rowclick(im);
            });
        }
    };/*}}}*/

    // 获取选中项
    this.getSelectedRecords=function()
    {/*{{{*/
        var values=mwt.get_checkbox_values(grid_chkbox_name);
        var records=[];
        for(var i=0;i<values.length;++i){
            var item=this.store.get(values[i]);
            item.store_index=values[i];
            records.push(item);
        }
        return records;
    };/*}}}*/

    // 导出到excel
    this.exportExcel=function()
    {/*{{{*/
		var outfile = filename;
        if (this._pagebar && this._pagebar.pageNum) {
            outfile += "_第"+this._pagebar.pageNum+"页_共"+
                    this._pagebar.pageCount+"页";
        }
        var rg = new RegExp("\\.xls$",'i');
        if (!rg.test(outfile)) outfile += ".xls";
        export_excel(tableid,outfile);
    };/*}}}*/
};
MWT.extends(MWT.Grid, MWT.Event);


/**
 * Grid列模型
 **/
MWT.Grid.ColumnModel=function(opt)
{
    this.columns=[];

    if(opt){
        this.columns=opt;
    }

    this.getColumns=function(){return this.columns;};

    // 获取多选框列样式
    this.getMultiSelectColumnStyle=function() { return 'style="width:30px;text-align:center;"'; };

    // 获取第i列样式
    this.getColumnStyle=function(idx) {
        var column = this.columns[idx];
        var html = "";
        var width= column.width ? column.width : 'auto';
        html+="width='"+width+"'";
        var align = isset(column.align) ? column.align : 'left';
        html+=" align='"+align+"'";
        if (isset(column.valign))html+=" valign='"+column.valign+"'";
        if (isset(column.style)) html+=" style='"+column.style+"'";
        return html;
    };
};

MWT.Grid.RowNumberer=function(opt)
{
    this.head = '';
    this.dataIndex = '';
    this.width = 50;
    this.align = 'left';
    this.style = "color:#999;font-family:Helvetica;";
    if (opt) {
        if(opt.style) this.style=opt.style;
        if(opt.width) this.width=opt.width;
        if(opt.align) this.align=opt.align;
    }
    this.render=function(v,item,storeIdx,pagebar) {
        var linen = storeIdx+1;
        if (pagebar) linen += pagebar.start;
        return linen+'.';
    };
};

// 表格字段渲染函数
MWT.GridRender = {
    money: function(v) {
        var n = parseFloat(v);
        if (n<1000) {
            n =  parseInt(n*100)/100;
            return n+'元';
        } else {
            n = n/10000;
            n = parseInt(n*100)/100;
            return n+'万元';
        }
    },
    integer: function(v) {
        return number_format(v);
    },
    percent: function(v) {
        var n = v*100;
        return number_format(n,2)+'%';
    },
    datetime: function(v,color) {
        if (!v) return '';
        if (!color || !is_string(color)) color = '#999';
        return '<span style="color:'+color+';font: 12px Tahoma;">'+v.substr(0,16)+'</span>';
    },
    date: function(v,color) {
        if (!v) return '';
        var dt = v.substr(0,10);
        if (dt=='0000-00-00'||dt=='1970-01-01') {
            return '';
        }   
        if (!color || !is_string(color)) color = '#999';
        return '<span style="color:'+color+'">'+dt+'</span>';
    },
    second: function(v) {
        var rs = [];
        if (v>=86400) {
            rs.push(parseInt(v/86400)+'天');
            v = v%86400;
        }
        if (v>=3600) {
            rs.push(parseInt(v/3600)+'小时');
            v = v%3600;
        }
        if (v>=60) {
            rs.push(parseInt(v/60)+'分钟');
            v = v%60;
        }
        if (v!=0 || rs.length==0) {
            rs.push(v+'秒');
        }
        return rs.join('');
    },
    fileSize: function(v) {
        var bytes = parseInt(v);
        if (bytes === 0) return '0 B';
        var k = 1024;
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
};

