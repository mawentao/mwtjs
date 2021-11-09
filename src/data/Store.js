/**
 * 数据存储与传输模块
 * author: mawentao
 * create: 2013-07-14 10:07:14
 **/

require('./Proxy.js');

MWT.Store=function(cnf)
{
    this.listeners = {};
    this.proxy;             //!< 数据代理器
    this.baseParams={};     //!< 参数
    this.root=[];           //!< 主数据存储
    this.totalProperty=0;   //!< 主数据个数
    this.annex={};          //!< 附加数据存储

    if (cnf) {
        if (cnf.proxy) this.proxy=cnf.proxy;
    }

    // 返回当前data的个数
    this.size=function() {return this.root.length;};

    // 获取第index个元素
    this.get=function(index) {return this.root[index];};

    // 查找元素
    this.indexOf=function(key,value) 
    {/*{{{*/
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
    };/*}}}*/

    // 在末尾添加元素
    this.push=function(item) 
    {/*{{{*/
        this.root.push(item);
        this.fire("load");
    };/*}}}*/

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

    // 加载数据
    this.load=function()
    {
        var thiso=this;
        this.proxy.load(this.baseParams,function(data){
            if (isset(data.totalProperty)) thiso.totalProperty=data.totalProperty;
            else if (isset(data.total_property)) thiso.totalProperty=data.total_property;
            if (isset(data.root)) thiso.root=data.root;
            if (isset(data.annex)) thiso.annex=data.annex;
            thiso.fire('load');
        });
    };

    // 清空数据
    this.clear=function()
    {/*{{{*/
        this.root=[];
        this.totalProperty=0;
        this.annex={};
        this.fire("load");
    };/*}}}*/

    // 交换两个位置的数据
    this.swap=function(p1,p2) 
    {/*{{{*/
        var n=this.root.length;
        if (p1>=n || p1<0 || p2>=n || p2<0 || p1==p2) return;
        var tmp = this.root[p1];
        this.root[p1] = this.root[p2];
        this.root[p2] = tmp;
        this.fire("load");
    };/*}}}*/
    
    // 编辑
    this.set=function(index,item) 
    {/*{{{*/
        this.root[index]=item;
        this.fire("load");
    };/*}}}*/

    // 排序
    this.sort=function(key, dir) 
    {/*{{{*/
        this.baseParams["sort"]=key;
        this.baseParams["dir"] =dir;
        this.load();
    };/*}}}*/
};
MWT.extends(MWT.Store, MWT.Event);

