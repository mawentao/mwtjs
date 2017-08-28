/**
 * 日志模块
 * author: mawentao 
 * create: 2013-07-12 14:23:44
 **/
mwt.log=function(level,content)
{
    var loglevel = mwt.config.log_level;
    if (loglevel==0) return;
    var level = level.toUpperCase();
    var logstr = '['+level+'] '+content;
    switch (level.toUpperCase()) {
        case 'DEBUG':
            if (loglevel>=3) console.log(logstr);
            break;
        case 'INFO':
            if (loglevel>=2) console.log(logstr);
            break;
        case 'WARN':
            if (loglevel>=1) console.log(logstr);
            break;
        default: console.log(logstr); break;
    };
};

mwt.log_debug=function(msg){mwt.log('DEBUG',msg);}
mwt.log_info=function(msg){mwt.log('INFO',msg);}
mwt.log_warn=function(msg){mwt.log('WARN',msg);}
