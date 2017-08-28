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
        var res = {
            totalProperty: this.data.length ? this.data.length : 0,
            root: this.data,
            annex: {}
        };
        if (callback) callback(res);
    };
};
MWT.extends(MWT.MemoryProxy, MWT.Proxy);
