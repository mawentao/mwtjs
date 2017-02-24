/**
 * 表格
 */

MWT.Grid=function(opt)
{
	this.listeners={};

    this.render=null;
    this.grid_div=null;
    this.grid_chkbox_id=null;
    this.grid_chkbox_name=null;
    this.page_div=null;
	this.store={};
    this._pagebar = {};
    this.pagebar=true;
    this.pageSize=10;
	var pagebarSimple=false;

    this.tbar=null;
	this.cm={};
	this.cls="mwt-table";
    this.bordered=false;
    this.multiSelect=false;//!<多选按钮

	var filename="";    //!< 导出文件名
	var striped=false;  //!< 奇偶行变色
	var tableid=''; 
	var noheader=false;
	var rowclick=null;     //!< 行点击事件处理函数
	var thiso=this;

	if(opt){
		if(opt.render)this.render=opt.render;
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
		if(opt.rowclick)rowclick=opt.rowclick;
		if(opt.pagebarSimple)pagebarSimple=true;
		if(opt.filename)filename=opt.filename;
		tableid=this.render+"-tab";
		if(filename=='')filename=tableid+'.xls';
	}

    // 创建
    this.create=function(){
		this.grid_div="grid_div_"+opt.render;
		this.page_div="page_div_"+opt.render;
        this.grid_chkbox_id=this.grid_div+"-chkbox-id";
        this.grid_chkbox_name=this.grid_div+"-chkbox";
		
		/*
		var code = '';
		if (this.tbar) code+="<div id='tbar_div_"+opt.render+"' style='margin-bottom:10px;border:solid 1px #ddd;'></div>";
		code += "<div class='mwt-grid' style='border-top:none;'>";*/
		
		var code="<div class='mwt-grid'";
        if(this.tbar){
            code+="><div id='tbar_div_"+opt.render+"'></div>";
        }else{
            code+=" style='border-top:solid 0px #ccc;'>";
        }

        //create thead
		var columns=this.cm.getColumns();
        code+="<table id='"+tableid+"' class='tab";
        if(this.bordered)code+=" bordered";
		if(striped)code+=" striped";
        //if(!this.pagebar)code+=" nobbar";
        code+="'>";
		if (!noheader) {
		    code+="<thead><tr>";
            if(this.multiSelect) code+="<td style='width:20px;text-align:center;'>"+
                "<input id='"+this.grid_chkbox_id+"' type='checkbox' "+
                   "onchange='set_checkbox_checked(\""+this.grid_chkbox_name+"\",this.checked);'/></td>";
		    var len=columns.length;
			var thname = this.grid_div+"-th";
		    for(var i=0;i<len;++i){
			    if (columns[i].hide){continue;}
				var width="";
				if (columns[i].width){width="width='"+columns[i].width+"'";}
				var tdid = this.grid_div+"-"+columns[i].dataIndex+"-"+i;
				code+="<td "+width+" id='"+tdid+"' name='"+thname+"' ";
				if (isset(columns[i].align)) code+="align='"+columns[i].align+"' ";
				if (isset(columns[i].valign))code+="valign='"+columns[i].valign+"' ";
				if (isset(columns[i].style)) code+="style='"+columns[i].style+"' ";
				if (columns[i].sort) code+="class='grid-sort' ";
				if (columns[i].poptitle) code+="pop-title='"+columns[i].poptitle+"' ";
                code+="data-id='"+columns[i].dataIndex+"'>"+columns[i].head+"</td>";
		    }
		    code+="</tr></thead>";
        }
		code+="<tbody id='"+this.grid_div+"'></tbody></table>";

		// bottom
		var act = striped ? 'active' : '';
		var stripedbtn = '<a href="javascript:;" id="'+tableid+'-trpbtn" class="bara '+act+'"><i class="fa fa-bars"></i></a>';
		var refershbtn = '<a href="javascript:;" id="'+tableid+'-refbtn" class="bara"><i class="fa fa-refresh"></i></a>';
		var exportbtn = '<a href="javascript:;" id="'+tableid+'-expbtn" class="bara"><i class="fa fa-download"></i></a>';
		var btns=[stripedbtn,refershbtn,exportbtn];
		code+="<div style='background:#f9f9f9;padding:5px;'>"+
            '<table width="100%"><tr><td id="'+this.page_div+'"></td><td align="right" width="94">'+
				'<span class="seg"></span>'+btns.join('&nbsp;')+'</td></tr></table>'+
          '</div>'+
        "</div>";
		jQuery("#"+this.render).html(code);
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
            var tbar=new MWT.Bar({render:"tbar_div_"+opt.render,"items":this.tbar});
            tbar.create();
        }

        //create pagebar
        if(this.pagebar){
            this._pagebar = new MWT.Pagebar({
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
		if(!this.render){return;}
        if(!this.grid_div){
            this.create();
        }
		var columns=this.cm.getColumns();
        var len=columns.length;
        var html="";
		var size=this.store.size();
        var trname = this.render+"row";
		for(var i=0;i<size;++i){
			var item=this.store.get(i);
            item.store_index = i;
			html+="<tr name='"+trname+"' data-idx='"+i+"'>";
            if(this.multiSelect) 
                html+="<td align='center'><input name='"+this.grid_chkbox_name+"' value='"+i+"' type='checkbox'/></td>";
			for(var c=0;c<len;++c){
				if (columns[c].hide){continue;}
				var dataidx=columns[c].dataIndex;
				var v = item[dataidx];
				if (columns[c].render){
					var func=columns[c].render;
					v = func(v,item);
				}
				html+="<td ";
				var width="";
				if (columns[c].width){html+="width='"+columns[c].width+"' ";}
				if (isset(columns[c].align)) html+="align='"+columns[c].align+"' ";
				if (isset(columns[c].valign))html+="valign='"+columns[c].valign+"' ";
                if (isset(columns[c].style)) html+="style='"+columns[c].style+"' ";
				html+=">"+v+"</td>";
			}
			html+="</tr>";
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
		var columns=this.cm.getColumns();
		var len=columns.length;
		for(var i=0;i<len;++i){
			if (!columns[i].sort){continue;}
            var tdid = this.grid_div+"-"+columns[i].dataIndex+"-"+i;
            document.getElementById(tdid).onclick=function(){
                var idx = this.getAttribute("data-id");
                var sort = 0;
                if(this.hasAttribute("data-sort"))
                    sort=this.getAttribute("data-sort");
                sort=1-sort;
                this.setAttribute("data-sort",sort);

                var doms=document.getElementsByName(thiso.grid_div+"-th");
                for(var i=0;i<doms.length;++i){
                    removeClass(doms[i],"grid-sort-asc");
                    removeClass(doms[i],"grid-sort-desc");
                }
                addClass(this,(sort==1)?"grid-sort-asc":"grid-sort-desc");

                var dir=sort==1?"ASC":"DESC";
                //alert(idx+":"+sort+":"+dir);
                thiso.store.baseParams["sort"]=idx;
                thiso.store.baseParams["dir"]=dir;
                thiso.load();
            }
		}
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
