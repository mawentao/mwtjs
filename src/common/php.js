/**
 * 本文件定义了一些PHP同名函数
 **/


//////////////////////////////////////////////////////
// 数字相关的函数
//////////////////////////////////////////////////////
/**
 * 类似PHP的同名函数
 *     number传进来的数,fix保留的小数位,默认保留两位小数
 **/
function number_format(number,fix)
{
	var fh = ',' ;
	var jg = 3;
	var str = '' ;
	number = parseFloat(number);
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
	return zsw;
}


//////////////////////////////////////////////////////
// 时间和日期函数
//////////////////////////////////////////////////////
// 获取当前时间戳（秒级,php同名函数）
function time()
{
    var nt = new Date();
	var tm = nt.getTime() / 1000;
	return Math.ceil(tm);
}

// 日期字符串转时间戳
// 注意: 接受的格式如 2016-01-01 12:00:00
function strtotime(str)
{
	///////////////////
	//Safari浏览器的坑:日期只接受/分割
	str=str.replace(/-/g,"/");
	//////////////////
	var nt = new Date(str);
	var tm = nt.getTime() / 1000;
	return Math.ceil(tm);
}

// 日期格式化函数
function date(fmt, tm)
{
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
}


//////////////////////////////////////////////////////
// 数组相关函数
//////////////////////////////////////////////////////
// 判断元素是否在数组中
function in_array(value, arr)
{
	var len=arr.length;
	for (var i=0; i<len; ++i)
		if (arr[i]==value)
			return true;
	return false;
};

// 返回json的所有key列表
function array_keys(o)
{
	var res=[];
	for (var key in o) 
		res.push(key);
	return res;
};

//////////////////////////////////////////////////////
// print_r函数
//////////////////////////////////////////////////////
function json2str(o, depth)
{
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
};
function print_r(o) { alert(json2str(o)); };


// 判断变量是否定义
function isset(v) 
{
	return typeof(v) != "undefined";
};


// 同PHP中的strip_tags函数:去除html标签
function strip_tags(str)
{
    str = str.replace(/<!--.*\-->/ig,'');
    str = str.replace(/<script.*\/script>/ig,'');
    str = str.replace(/<style.*\/style>/ig,'');
	return str.replace(/<[^>]+>/g,"");
}

// PHP同名函数:判断变量是否数组
function is_array(v) {
	return toString.apply(v) === '[object Array]';
}	


