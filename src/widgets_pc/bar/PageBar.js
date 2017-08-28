/**
 * 分页工具条
 * author: mawentao
 * create: 2013-07-14 11:17:14
 **/

MWT.PageBar=function(cnf)
{
    this.listeners = {};
    this.store={};
    this.pageNumCount=10;
    this.pageSizeList=[10,20,50,100];
    this.start=0;          //!< 起始行
    this.pageSize=10;      //!< 页面大小
    this.pageNum=0;        //!< 当前页号
    this.pageCount=0;     //!< 总页数
    this.totalProperty=0;  //!< 总记录数
    var simple=false;

    if (cnf) {
        this.construct(cnf);

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
                var cls = 'class="mwt-btn mwt-btn-default"';
                var btns=[
                    '<button name="'+cbtn+'" data-v="'+1+'" '+cls+'><i class="fa fa-angle-double-left"></i></button>',
                    '<button name="'+cbtn+'" data-v="'+(this.pageNum-1)+'" '+cls+'><i class="fa fa-angle-left"></i></button>',
                    '<span style="font-size:13px;margin:0 4px;color:#444;">'+this.pageNum+' / '+this.pageCount+'</span>',
                    '<button name="'+cbtn+'" data-v="'+(this.pageNum+1)+'" '+cls+'><i class="fa fa-angle-right"></i></button>',
                    '<button name="'+cbtn+'" data-v="'+(this.pageCount)+'" '+cls+'><i class="fa fa-angle-double-right"></i></button>'
                ];
                var code = '<div class="mwt-simple-pagebar">'+btns.join('&nbsp;')+'</div>';
                jQuery('#'+this.render).html(code);
                jQuery('[name='+cbtn+']').click(function(){
                    var p = jQuery(this).data('v');
                    if (p!=thiso.pageNum && p>0 && p<=thiso.pageCount) {
                        thiso.changePage(p);
                    }
                });
                return;
            }

            var code="<table class='tablay'><tr><td>";

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

MWT.extends(MWT.PageBar, MWT.Bar);

