/**
 * 列表流
 */
require('./flow.css');

MWT.Flow=function(opt)
{
    var render=null;
    this.listeners={};
    this.store;
    var emptyMsg = '暂无数据';
    var pagebar;
    var pageSize=10;
    var itemRenderFun = null;
    var cls = '';
    var thiso=this;

    if(opt){
        if(opt.render)render=opt.render;
//        if(opt.cm)this.cm=opt.cm;
        if(opt.cls)cls=opt.cls;
        if(opt.store){
            this.store=opt.store;
        }
        if(isset(opt.pageSize)) pageSize=opt.pageSize;
        if(isset(opt.itemRenderFun)) itemRenderFun=opt.itemRenderFun;
        if(isset(opt.emptyMsg)) emptyMsg=opt.emptyMsg;
    }

    // 创建
    this.create=function(){
        //1. 创建dom元素
        var code = '<table id="tab-'+render+'" class="mwt-flow-tab '+cls+'"></table>'+
            '<div class="mwt-btn-block mwt-btn mwt-btn-default mwt-btn-xs mwt-loadmorebtn" id="loadmorebtn-'+render+'">点击查看更多</div>';
        jQuery('#'+render).html(code);
        //2. 创建pagebar
        pagebar = new MWT.PageBar({
            store: this.store,
            pageSize: pageSize
        }); 
        pagebar.on('load',function(s){
            thiso.display();
        });
    };

    // 显示列表
    this.display=function() {
        var jarea = jQuery('#tab-'+render);
        var jmorebtn = jQuery('#loadmorebtn-'+render);

        if (this.store.size()==0) {
            var code = '<div class="mwt-empty">'+emptyMsg+'</div>';
            jarea.html(code);
            jmorebtn.hide();
            return;
        }
        var ls = [];
        for (var i=0;i<this.store.size();++i) {
            var im = this.store.get(i);
            var code = itemRenderFun ? itemRenderFun(im,i) : '';
            if (!code.startWith('<tr><td>')) {
                code = '<tr><td>'+code+'</td></tr>';
            }
            ls.push(code);
        }
        jarea.append(ls.join(''));

        // 加载更多
        if (pagebar.pageNum < pagebar.pageCount) {
            jmorebtn
                .html('点击查看更多').show()
                .unbind('click').click(function(){
                    code = '<i class="icon icon-loading fa fa-spin fa-2x"></i>'+jmorebtn.html();
                    jmorebtn.html(code).unbind('click');
                    pagebar.nextPage();
                });
        } else {
            jmorebtn.hide();
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
        jQuery('#tab-'+render).html('');
        if (isset(params))this.store.baseParams = params;
        pagebar.changePage(1);
    };
};
MWT.extends(MWT.Flow, MWT.Event);

