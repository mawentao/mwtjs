/**
 * 内存数据代理
 **/
mwt.MemoryProxy=function(cnf)
{
    this.listeners = {};
    this.data=[];

    if (cnf) {
        this.construct(cnf);
        if(cnf.data) this.data=cnf.data;
    }

    this.load=function(params,callback)
    {
        var list = this.data;
        var len  = list.length ? list.length : 0;
        // 内存排序
        if (len && isset(params.sort)) {
            var sort = params.sort;
            var dir = params.dir.toUpperCase();
            if (list.sort) {
                list.sort(function(a,b){
                    if (!isset(a[sort]) || !isset(b[sort])) return 1;
                    if (dir=='ASC') return a[sort]>b[sort] ? 1 : -1;
                    else return a[sort]<b[sort] ? 1 : -1;
                });
            }
        }
        // 内存分页
        var sliceArr = list;
        if (isset(params.start) && isset(params.limit)) {
            var start = parseInt(params.start);
            var limit = parseInt(params.limit);
            if (limit) {
                sliceArr = list.slice(start,start+limit);  
            }
        }
        // 封装数据结构
        var res = {
            totalProperty: len,
            root: sliceArr,
            annex: {}
        };
        if (callback) callback(res);
    };
};
MWT.extends(MWT.MemoryProxy, MWT.Proxy);
