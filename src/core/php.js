/**
 * 一些PHP同名函数
 * 注意: 本文件中定义的函数不挂在langui下，可以直接使用
 **/

//////////////////////////////////////////////////////
// 判断变量相关的函数
//////////////////////////////////////////////////////
// 判断变量是否定义
window.isset=function(v){return typeof(v) != "undefined";}

// 判断变量是否是数字
window.is_numeric=function(v) 
{/*{{{*/
	if (typeof v === 'number') return true;
	if (typeof v === 'string') {
		var reg = new RegExp("^[-|+]?[0-9]+(.)?[0-9]*$");
		return reg.test(v);
	}
	return false;
}/*}}}*/

// 判断变量是否数组
window.is_array=function(v) {return toString.apply(v) === '[object Array]';}

// 判断变量是否字符串
window.is_string=function(v) {return typeof v === 'string';}

//////////////////////////////////////////////////////
// 数字相关的函数
//////////////////////////////////////////////////////
/**
 * 类似PHP的同名函数
 *     number传进来的数,fix保留的小数位,默认保留两位小数
 **/
window.number_format=function(number,fix)
{/*{{{*/
    number = parseFloat(number);
    // 负数做下特殊处理
    var signal = 1;
    if (number<0) {
        signal = -1; 
        number = Math.abs(number);
    }   

    var fh = ',' ;
    var jg = 3;
    var str = '' ;
    number = number.toFixed(fix);
    var zsw = number.split('.')[0];//整数位
    var xsw = number.split('.')[1];//小数位
    var zswarr = zsw.split('');//将整数位逐位放进数组
    for(var i=1;i<=zswarr.length;i++) {
        str = zswarr[zswarr.length-i] + str ;
        if(i%jg == 0)
        {   
            str = fh+str;//每隔jg位前面加指定符号
        }   
    }   
    str = (zsw.length%jg==0) ? str.substr(1) : str;//如果整数位长度是jg的的倍数,去掉最左边的fh
    zsw = str+'.'+xsw;  //重新连接整数和小数位
    if (!xsw) zsw=str;
    if (signal<0) zsw='-'+zsw;
    return zsw;
}/*}}}*/


//////////////////////////////////////////////////////
// 字符串相关的函数
//////////////////////////////////////////////////////
// 同PHP中的strip_tags函数:去除html标签
window.strip_tags=function(str)
{/*{{{*/
    str = str.replace(/<!--.*\-->/ig,'');
    str = str.replace(/<script.*\/script>/ig,'');
    str = str.replace(/<style.*\/style>/ig,'');
    return str.replace(/<[^>]+>/g,"");
}/*}}}*/


//////////////////////////////////////////////////////
// 时间和日期函数
//////////////////////////////////////////////////////
// 获取当前时间戳(秒级)
window.time=function()
{/*{{{*/
    var nt = new Date();
    var tm = nt.getTime() / 1000;
    return Math.ceil(tm);
}/*}}}*/

// 日期字符串转时间戳
// 注意: 接受的格式如 2016-01-01 12:00:00
window.strtotime=function(str)
{/*{{{*/
    ///////////////////
    //Safari浏览器的坑:日期只接受/分割
    str=str.replace(/-/g,"/");
    //////////////////
    var nt = new Date(str);
    var tm = nt.getTime() / 1000;
    return Math.ceil(tm);
}/*}}}*/

// 日期格式化函数
window.date=function(fmt, tm)
{/*{{{*/
    var dt = new Date();
    if (tm) dt = new Date(tm*1000);
    var o = {
        "Y+" : dt.getFullYear(),
        "m+" : dt.getMonth()+1,
        "d+" : dt.getDate(),
        "H+" : dt.getHours(),
        "i+" : dt.getMinutes(),
        "s+" : dt.getSeconds(),
        "w+" : dt.getDay()
    };
    for (var k in o) {
        if (new RegExp("("+ k +")").test(fmt)) {
            var v = o[k]+"";
            if (v.length==1) v="0"+v;
            fmt = fmt.replace(RegExp.$1,v);
        }
    }
    return fmt;
}/*}}}*/


//////////////////////////////////////////////////////
// 数组相关函数
//////////////////////////////////////////////////////
// 判断元素是否在数组中
window.in_array=function(value, arr)
{/*{{{*/
    var len=arr.length;
    for (var i=0; i<len; ++i)
        if (arr[i]==value)
            return true;
    return false;
}/*}}}*/

// 返回json的所有key列表
window.array_keys=function(o)
{/*{{{*/
    var res=[];
    for (var key in o)
        res.push(key);
    return res;
}/*}}}*/


//////////////////////////////////////////////////////
// print_r函数
//////////////////////////////////////////////////////
window.json2str=function(o, depth)
{/*{{{*/
    var result = '';
    depth || (depth=1);
    var indent_pre = new Array(4*(depth-1)).join(' ');
    var indent = new Array(4*depth).join(' ');
    var tmp = '';
    var type = typeof o;
    switch(type) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'undefined':
        case 'function':
            tmp += o;
            break;
        case 'object':
        default:
            for(var key in o) {
                tmp += indent + '[' + key + '] = ';
                tmp += json2str(o[key], (depth+1));
            }
    }
    if (type == "object") {
        result += type + "\n";
        result += indent_pre + '(' + "\n";
        result += tmp;
        result += indent_pre + ')' + "\n";
    } else {
        result += type + "(" + tmp + ")\n";
    }
    return result;
}/*}}}*/
window.print_r=function(o) { alert(json2str(o)); };

