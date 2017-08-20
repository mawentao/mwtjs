/* 日志模块 */
define(function(require){
    var o={};
    function writelog(level, msg) {
        var logstr = "["+level+"] "+msg;
        console.log(logstr);
    }
    o.debug = function(msg) {if(conf.loglevel>=3) writelog('DEBUG',msg);};
    o.info = function(msg) {if(conf.loglevel>=2) writelog('INFO',msg);};
    o.warn = function(msg) {if(conf.loglevel>=1) writelog('WARN',msg);};
    return o;
});
