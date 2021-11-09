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
        // 表格
        var tbcls = ["mwt-table"];
        if (thiso.bordered) tbcls.push('bordered');
        if (striped) tbcls.push('striped');
        if (thiso.cls) tbcls.push(thiso.cls);
        var tableHtml = '<table id="'+tableid+'" class="'+tbcls.join(" ")+'">'+
            thiso.cm.getColgroup(thiso.multiSelect)+
            '<thead id="'+theadDomid+'" class="mwt-table-head"></thead>'+
            '<tbody id="'+tbodyDomid+'" class="mwt-table-body"></tbody>'+
        '</table>';

        //1. 固定布局
        if (position=='fixed') {
            new MWT.BorderLayout({
                render: render,
                items: [
                    (thiso.tbar && thiso.tbar.length)
                        ? {region:'north',height:60,html:'<div id="'+tbarDomid+'" class="mwt-grid-tbar"'+(opt.tbarStyle?' style="'+opt.tbarStyle+'"':'')+'></div>'}
                        : '',
                    {region:'center',id:'table-'+render,cls:'mwt-grid-table',html:tableHtml},
                    {region:'south',id:tfootDomid,cls:'mwt-grid-footbar',height:40}
                ]
            }).init();
            return;
        }

        //2. 相对布局
        var divs = [];
        if(thiso.tbar && thiso.tbar.length){
            var style=opt.tbarStyle ? ' style="'+opt.tbarStyle+'"' : '';
            divs.push('<div id="'+tbarDomid+'" class="mwt-grid-tbar"'+style+'></div>');
        }
        divs.push('<div id="table-'+render+'" class="mwt-grid-table">'+tableHtml+'</div>');
		divs.push('<div id="'+tfootDomid+'" class="mwt-grid-footbar"></div>');
        var code = '<div id="container-'+render+'" class="mwt-grid-container">'+divs.join("")+'</div>';
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
        var thname = thiso.grid_div+"-th";
        var headcode = thiso.cm.getThead(thiso.multiSelect, grid_chkbox_name, thname, position=='fixed');
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
        var code = '<div class="mwt-row mwt-row-flex">'+
                '<div class="mwt-col-fill" id="pagebar-'+render+'"></div>'+
                '<div class="mwt-col-wd mwt-grid-foot-toolbox" id="toolbox-'+render+'"></div>'+
            '</div>';
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

        //3. 加载动画
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
        if(!this.grid_div){this.create();}
        var columns=this.cm.getColumns();
        var len=columns.length;
        var trs = [];
        var size=this.store.size();
        if (size==0) {
            var emptymsg = opt.emptyMsg ? opt.emptyMsg : "查询记录为空";
            var colspan = this.cm.getColumnCount(this.multiSelect);
            trs.push('<tr class="empty"><td colspan="'+colspan+'">'+emptymsg+'</td></tr>');
        } else {
            var trname = render+"row";
            for(var i=0;i<size;++i){
                var item=this.store.get(i);
                item.store_index = i;
                var tds = [];
                if (this.multiSelect) {
                    tds.push('<td '+thiso.cm.getMultiSelectColumnStyle()+'><input name="'+grid_chkbox_name+'" value="'+i+'" type="checkbox" class="mwt-grid-checkbox"/></td>');
                }
                for(var c=0;c<len;++c){
                    var column = columns[c];
                    if (column.hide){continue;}
                    var dataidx=column.dataIndex;
                    var v = item[dataidx];
                    if (column.render){
                        var func=column.render;
                        v = func(v,item,i,this._pagebar);
                    }
                    var td='<td '+this.cm.getTdStyle(c)+'>'+v+'</td>';
                    tds.push(td);
                }
                trs.push('<tr name="'+trname+'" data-idx="'+i+'">'+tds.join()+'</tr>');
            }
        }
        jQuery("#"+tbodyDomid).html(trs.join(""));
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

require('./GridColumnModel.js');