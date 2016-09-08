/**
 * H5 List View
 **/
MWT.ListView=function(opt)
{
	this.listeners={};

    this.render=null;
    this.store={};
    this.pagebar={};
    var pageSize=10;  //!< 0表示不分页
    var listdiv='';
    var pagediv='';
    var bodyStyle='';
    var pageStyle='';
    var bodyCls='weui_cells';
    var pageCls='loadmore';
    var cellfun=null;
    var emptyfun=null;  //!< 查询结果为空
    var thiso=this;

    if(opt){
        if(opt.render)this.render=opt.render;
        if(isset(opt.pagebar)) this.pagebar=opt.pagebar;
        if(isset(opt.pageSize)) pageSize=opt.pageSize;
        if(isset(opt.bodyStyle)) bodyStyle=opt.bodyStyle;
        if(opt.store){
			this.store=opt.store;
			var thiso=this;
			this.store.on("load", function(s){
				thiso.display();
			});
		}
        if(opt.cellfun) cellfun=opt.cellfun;
        if(opt.emptyfun) emptyfun=opt.emptyfun;
        if(opt.bodyStyle) bodyStyle=opt.bodyStyle;
        if(opt.bodyCls) bodyCls=opt.bodyCls;
        if(opt.pageStyle) pageStyle=opt.pageStyle;
    }

    // 创建
    this.create=function(){
        listdiv = this.render+"-listdiv";
        pagediv = this.render+"-pagediv";
        var code="<div id='"+listdiv+"' class='"+bodyCls+"' style='"+bodyStyle+"'></div>"+
                 "<div id='"+pagediv+"' class='"+pageCls+"' style='"+pageStyle+"' data-mode='1'></div>";
        jQuery("#"+this.render).html(code);
        //create pagebar
        if (pageSize>0) {
            this.pagebar = new MWT.Pagebar({
                store: this.store,
                pageSize: pageSize
            });
			jQuery("#"+pagediv).click(function(){
			    var $pdiv = jQuery(this);
				var mode = $pdiv.data("mode");
                if (mode==1) {
                    thiso.pagebar.nextPage();
                }
            });
            this.pagebar.on("load", function(e){
                if (e.pageCount>0 && e.pageNum!=e.pageCount) {
                    var code = "点击加载更多";
                    jQuery("#"+pagediv).show().html(code).attr("data-mode",1);
                } else {
                    //var code = "加载更多";
                    jQuery("#"+pagediv).hide().attr("data-mode",1);
                }
            });
        } else {
			jQuery("#"+pagediv).hide().attr("data-mode",1);
        }
        // loading...
        this.store.on("beforeLoad",function(){
            var code = '<i class="fa fa-spinner fa-pulse" style="font-size:13px;"></i> 正在加载...';
            jQuery("#"+pagediv).show().attr("data-mode",0).html(code);
        });
        this.store.on("afterLoad",function(){
            if (pageSize==0) { 
                jQuery("#"+pagediv).hide();
            }
        });
    };

    // 加载数据
    this.load=function(params){ 
        if (isset(params))this.store.baseParams = params;
        if (pageSize>0) {
            jQuery("#"+listdiv).html("");
            this.pagebar.changePage(1);
        }
        else this.store.load();
    };

    // 显示ListView
    this.display=function(){
		if(!this.render){return;}
        if(this.pagebar.pageNum<1) {
            jQuery("#"+listdiv).html("");
        }
        var size=this.store.size();
        if (size>0) {
            for (var i=0;i<size;++i) {
                var item = this.store.get(i);
                if (cellfun) {
                    jQuery("#"+listdiv).append(cellfun(item));
                }
            }
        } else {
            if (emptyfun && jQuery("#"+listdiv).html()=='') {
                jQuery("#"+listdiv).html(emptyfun());
            }
        }
    };
};
MWT.extends(MWT.ListView, MWT.Event);
