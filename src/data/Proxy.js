/**
 * 数据代理
 **/

MWT.Proxy=function(cnf)
{
    this.listeners = {};

    this.construct=function(cnf) {
    };

    this.load=function(params,callback){};
};
MWT.extends(MWT.Proxy, MWT.Event);


require('./MemoryProxy.js');
require('./HttpProxy.js');
