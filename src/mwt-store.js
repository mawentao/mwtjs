/**
 * 数据存储与传输模块
 */

MWT.Store=function(cnf)
{
    this.listeners = {};
    this.url="";
    this.baseParams={};
    this.totalProperty=0;
    this.root=[];
    this.annex={};
	this.loadres;
	var beforeLoad,afterLoad;

    if (cnf) {
        if (cnf.url) this.url=cnf.url;
        if (cnf.beforeLoad) beforeLoad=cnf.beforeLoad;
        if (cnf.afterLoad) afterLoad=cnf.afterLoad;
    }
    // 返回当前data的个数
    this.size=function() {return this.root.length;};
    // 获取第index个元素
    this.get=function(index) {return this.root[index];};
    // 查找元素
    this.indexOf=function(key,value) {
        var n=this.root.length;
        if (typeof value=="undefined") {
            for (var i=0; i<n; ++i)
                if (this.root[i]==key)
                    return i;
        } else {
            for (var i=0; i<n; ++i)
                if (this.root[i][key]==value)
                    return i;
        }
        return -1;
    };

    // 在末尾添加元素
    this.push=function(item) {
        this.root.push(item);
        this.fire("load");
    };
    // 插入元素
    this.insert=function(index,item) {
        this.root.splice(index,0,item);
        this.fire("load");
    };

    // 删除第index个元素
    this.remove=function(index) { 
        this.root.splice(index,1); 
        this.fire("load");
    };
    // 删除最后一个元素
    this.pop=function(index) { 
        this.root.pop(); 
        this.fire("load");
    };
    // 删除全部数据
    this.clear=function() {
        this.root=[];
        this.fire("load");
    };
	// 交换两个位置的数据
	this.swap=function(p1,p2) {
		var n=this.root.length;
		if (p1>=n || p1<0 || p2>=n || p2<0 || p1==p2) return;
		var tmp = this.root[p1];
		this.root[p1] = this.root[p2];
		this.root[p2] = tmp;
		this.fire("load");
	};
    
    // 编辑
    this.set=function(index,item) {
        this.root[index]=item;
        this.fire("load");
    };

    // 加载数据（data为空，从url获取）
    this.load=function(data) {
        // Load本地数据
        if (data) {
            this.root=data;
            this.totalProperty=data.length;
            this.fire("load");
        } 
        // Ajax Load（jquery）
        else {
            var thiso=this;
			if(beforeLoad)beforeLoad();
            jQuery.ajax({
                type: "post", 
                async: true,
                url: this.url,
                data: this.baseParams,
                dataType: "json", 
                complete: function() {
					if(afterLoad)afterLoad();
                },
                success: function (res) { 
					thiso.loadres=res;
					if (isset(res['data'])) {
						var data=res['data'];
					    if (isset(data.totalProperty)) thiso.totalProperty=data.totalProperty;
					    if (isset(data.root)) thiso.root=data.root;
                        if (isset(data.annex)) thiso.annex=data.annex;
					}
                    thiso.fire("load");
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    var errmsg = "Error("+XMLHttpRequest.readyState+") : "+textStatus;
					thiso.loadres={errmsg:errmsg};
					console.log(errmsg);
                    //alert(XMLHttpRequest.status);
                    //alert(errmsg); 
                }
            });
        }
    };

    // 排序
    this.sort=function(key, dir) {
        this.baseParams["sort"]=key;
        this.baseParams["dir"] =dir;
        this.load();
    };
};
MWT.extends(MWT.Store, MWT.Event);




/* -------- 分页条 -------- */
MWT.Pagebar=function(cnf)
{
    this.listeners = {};
    this.store={};
    this.render=null;
    this.pageNumCount=10;
    this.pageSizeList=[10,20,50,100];
    this.start=0;          //!< 起始行
    this.pageSize=10;      //!< 页面大小
    this.pageNum=0;        //!< 当前页号
    this.pageCount=0;     //!< 总页数
    this.totalProperty=0;  //!< 总记录数
	var simple=false;

    if (cnf) {
        if (cnf.render) this.render=cnf.render;
        if (cnf.pageSize) this.pageSize=cnf.pageSize;
        if (cnf.pageSizeList) this.pageSizeList=cnf.pageSizeList;
        if (cnf.store) {
            this.store=cnf.store;
            var thiso=this;
            this.store.on("load", function(s){
                thiso.totalProperty=s.totalProperty;
                thiso.pageNum=(thiso.start/thiso.pageSize) + 1;
                thiso.pageCount=Math.ceil(s.totalProperty/thiso.pageSize);
                thiso.fire("load");
                thiso.display();
            });
        }
		if (cnf.simple) simple=true;
    }
    
    // 切换页面
    this.changePage=function(pn) {
        var pagenumer=pn>0 ? pn-1 : 0;
        this.start=pagenumer * this.pageSize;
        this.store.baseParams["start"]=this.start;
        this.store.baseParams["limit"]=this.pageSize;
        this.store.load();
    };

    // 设置一页显示的记录个数
    this.changePagesize=function(size) {
        this.pageSize=size;
        this.changePage(1);
    };

    // 下一页
    this.nextPage=function() {
        var page=this.pageNum + 1;
        if (page > this.pageCount) { page=this.pageNum; }
        this.changePage(page);
    };

    // 上一页
    this.prevPage=function() {
        var page=this.pageNum - 1;
        if (page < 1) { page=1; }
        this.changePage(page);
    };
    
    // 首页
    this.firstPage=function() {
        this.changePage(1);
    };

    // 尾页
    this.lastPage=function() {
        this.changePage(this.pageCount);
    };

    // 显示Pagebar（如果设置了render）
    this.display=function()
    {
        if (this.render) {
            var thiso=this;
            var selid=this.render+"-sel";
            var pname=this.render+"-page";

			// simple
			if (simple) {
				var cbtn=this.render+'-cbtn';
				var cls = 'class="mwt-btn mwt-btn-default mwt-btn-xs radius" style="color:#444;margin-left:5px;width:26px;padding:0;font-size:16px;"';
				var code = '<table class="tablay" style="margin-top:3px;"><tr><td align="center">';
				code += '<button name="'+cbtn+'" data-v="'+1+'" '+cls+'><i class="fa fa-angle-double-left"></i></button>';
				code += '<button name="'+cbtn+'" data-v="'+(this.pageNum-1)+'" '+cls+'><i class="fa fa-angle-left"></i></button>';
				code += '<span style="font-size:13px;margin:0 7px;color:#444;">'+this.pageNum+' / '+this.pageCount+'</span>';
				code += '<button name="'+cbtn+'" data-v="'+(this.pageNum+1)+'" '+cls+'><i class="fa fa-angle-right"></i></button>';
				code += '<button name="'+cbtn+'" data-v="'+(this.pageCount)+'" '+cls+'><i class="fa fa-angle-double-right"></i></button>';
				document.getElementById(this.render).innerHTML=code;
				jQuery('[name='+cbtn+']').click(function(){
						var p = jQuery(this).data('v');
						if (p!=thiso.pageNum && p>0 && p<=thiso.pageCount) {
						thiso.changePage(p);
						}
						});
				return;
			}

            var code="<table class='tablay' style='margin-top:3px;'><tr><td>";

            // 页号列表
            var list_heaad=[
                {"text":"首页", "value":1, "active":this.pageNum!=1},
                {"text":"上一页", "value":this.pageNum-1, "active":this.pageNum!=1}
            ];
            var list_body=[];

            var step=Math.ceil(this.pageNumCount / 2);
            var begin=this.pageNum - step;
            if (begin<1) begin=1;
            var count=0;
            while (count < this.pageNumCount) {
                var active=(begin!=this.pageNum);
                var item={"text":begin, "value":begin, "active":active};
                list_body.push(item);
                ++begin;
                if (begin > this.pageCount)
                    break;
                ++count;
            }

            var list_tail=[
                {"text":"下一页", "value":this.pageNum+1, "active":(this.pageCount>0)&(this.pageNum!=this.pageCount)},
                {"text":"尾页", "value":this.pageCount, "active":(this.pageCount>0)&(this.pageNum!=this.pageCount)}
            ];
            var list=list_heaad.concat(list_body, list_tail);
            for (var i=0; i<list.length; ++i) {
                var t=list[i].text;
                var v=list[i].value;
                var c=list[i].active ? "" : "disabled";
                var margin_left = (i==0) ? 0 : 1;
                code += "<button name='"+pname+"' "+c+" value='"+v+"' "+
                    "class='mwt-btn mwt-btn-default mwt-btn-xs' style='border-radius:0;margin-left:"+margin_left+"px;'>"+t+
                  "</button>";
            }

            

            code += "</td><td style='text-align:right;font-size:12px;color:#777;'>"+
                    "共 <b>"+this.totalProperty+"</b> 条记录，每页显示个数：<select id='"+selid+"'>";
            for (var i=0; i<this.pageSizeList.length; ++i) {
                var v=this.pageSizeList[i];
                var c=v==this.pageSize ? "selected" : "";
                code+="<option value='"+v+"' "+c+">"+v+"</option>";
            }
            code += "</select>";
            
            code += "</td></tr></table>";
            //alert(this.totalProperty+"条记录");
            //
            document.getElementById(this.render).innerHTML=code;

            document.getElementById(selid).onchange=function(e){
                thiso.changePagesize(this.value);
            };

            var btns=document.getElementsByName(pname);
            for (var i=0; i<btns.length; ++i) {
                btns[i].onclick=function(e) {
                    thiso.changePage(this.value);
                };
            }

        }
    };
};
MWT.extends(MWT.Pagebar, MWT.Event);


