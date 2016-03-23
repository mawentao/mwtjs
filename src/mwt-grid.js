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
    this.tbar=null;
	this.cm={};
	this.cls="mwt-table";
    this.bordered=false;
    this.multiSelect=false;//!<多选按钮
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
        if(opt.bordered)this.bordered=true;
	}

    // 创建
    this.create=function(){
		this.grid_div="grid_div_"+opt.render;
		this.page_div="page_div_"+opt.render;
        this.grid_chkbox_id=this.grid_div+"-chkbox-id";
        this.grid_chkbox_name=this.grid_div+"-chkbox";
		var code="<div class='mwt-grid'";
        if(this.tbar){
            code+="><div id='tbar_div_"+opt.render+"'></div>";
        }else{
            code+=" style='border-top:solid 0px #ccc;'>";
        }

        //create thead
		var columns=this.cm.getColumns();
        code+="<table class='tab";
        if(this.bordered)code+=" bordered";
        if(!this.pagebar)code+=" nobbar";
        code+="'>";
		code+="<thead><tr>";
        if(this.multiSelect) code+="<td style='width:20px;text-align:center;'>"+
            "<input id='"+this.grid_chkbox_id+"' type='checkbox' "+
               "onchange='set_checkbox_checked(\""+this.grid_chkbox_name+"\",this.checked);'/></td>";
		var len=columns.length;
		for(var i=0;i<len;++i){
			if (columns[i].hide){continue;}
			var width="";
			if (columns[i].width){width="width='"+columns[i].width+"'";}
            var tdid = this.grid_div+"-"+columns[i].dataIndex+"-"+i;
		    code+="<td "+width+" id='"+tdid+"' name='"+this.grid_div+"-th' ";
            if (isset(columns[i].align)) code+="align='"+columns[i].align+"' ";
            if (isset(columns[i].valign))code+="valign='"+columns[i].valign+"' ";
            if (isset(columns[i].style)) code+="style='"+columns[i].style+"' ";
            if (columns[i].sort) code+="class='grid-sort' ";
            code+="data-id='"+columns[i].dataIndex+"'>"+columns[i].head+"</td>";
		}
		code+="</tr></thead><tbody id='"+this.grid_div+"'></tbody></table>";
        if(this.pagebar)
            code+="<div id='"+this.page_div+"' style='background:#efefef;padding:5px;'></div>";
        code+="</div>";
		set_html(this.render, code);
        this.initevent();

        //create tbar
        if(this.tbar){
            var tbar=new MWT.Bar({render:"tbar_div_"+opt.render,"items":this.tbar});
            tbar.create();
        }

        //create pagebar
        if(this.pagebar){
            this._pagebar = new MWT.Pagebar({
		        "store"  : this.store,
			    "render" : this.page_div,
                "pageSize": this.pageSize
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
		for(var i=0;i<size;++i){
			var item=this.store.get(i);
            item.store_index = i;
			html+="<tr>";
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
