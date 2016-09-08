/**
 * 操作html元素的工具函数
 */

// 隐藏
function hide(eleid)
{
	document.getElementById(eleid).style.display = "none";
}

// 显示
function display(eleid)
{
   	document.getElementById(eleid).style.display = "block";
}
function show(eleid)
{
   	document.getElementById(eleid).style.display = "block";
}

// 时间日期函数

// 获取当前时间戳（s级, php同名接口）
function time()
{
    var nt = new Date();
	var tm = nt.getTime() / 1000;
	return Math.ceil(tm);
}

// 
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

// 获取格式化的日期（php同名接口）
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
        "s+" : dt.getSeconds()
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

// php中的print_r
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
}
function print_r(o) { alert(json2str(o)); }

/* ------------ get dom value ----------- */
function get_html(eleid)
{
	return document.getElementById(eleid).innerHTML;
}


function get_value(eleid)
{
	var dom = document.getElementById(eleid);
	return dom.value.trim();
}

function get_int_value(eleid, dafult_value)
{
	var dom = document.getElementById(eleid);
	var val = parseInt(dom.value);
	if (isNaN(val)) {
		dom.value = dafult_value;
		val = dafult_value;
	}
	return val;
}

function get_text_value(eleid)
{
	var dom = document.getElementById(eleid);
	var val = dom.value.trim();
	if (val == "") {
		dom.value = "";
		dom.focus();
		throw new Error(eleid+" is empty");
	}
	return val;
}

function get_textarea_values(eleid)
{
	var str = get_text_value(eleid);
	var arr = str.split("\n");
	var res = [];
	for (var i=0; i<arr.length; ++i) {
		var v = arr[i].trim();
		if (v == "") {continue;}
		v = encodeURIComponent(v);
		res.push(v);
	}
	return res;
}

function get_radio_value(elename)
{
	var radios = document.getElementsByName(elename);
	var result;
	for(var i=0; i<radios.length; i=i+1){
		if(radios[i].checked == true){
			result = radios[i].value;
			break;
		}
	}
	return result;
}

function get_select_value(eleid)
{
	var sel = document.getElementById(eleid);
	return sel.options[sel.selectedIndex].value;
}

function get_checkbox_values(elename)
{
	var values = [];
	var doms = document.getElementsByName(elename);
	for (var i=0; i<doms.length; ++i) {
		if (doms[i].checked) {
			values.push(doms[i].value);
		}
	}
	return values;
}

/* ------------ set dom value ------------ */
function set_html(eleid, value)
{
	document.getElementById(eleid).innerHTML = value;
}

function set_value(eleid, value)
{
	document.getElementById(eleid).value = value;
}

function set_select_value(eleid, value)
{
	var sel = document.getElementById(eleid);
	for(var i=0; i<sel.options.length; i=i+1){
		if(sel.options[i].value == value){
			sel.options[i].selected = true;
			break;
		}
	}
}

function set_radio_value(elename, value)
{
	var doms = document.getElementsByName(elename);
	for (var i=0; i<doms.length; ++i) {
		if (doms[i].value == value) {
			doms[i].checked = true;
			return;
		}
	}
}

function set_checkbox_checked(elename, checked)
{
	var doms = document.getElementsByName(elename);
	for (var i=0; i<doms.length; ++i) {
		doms[i].checked = checked;
	}
}

function set_checkbox_values(elename, varr)
{
	var doms = document.getElementsByName(elename);
	for (var i=0; i<doms.length; ++i) {
		var checked = false;
		for (var k=0; k<varr.length; ++k) {
			if (varr[k] == doms[i].value) {
				checked = true;
				break;
			}
		}
		doms[i].checked = checked;
	}
}


/* ------------- 数组扩展函数 ---------------- */
/* 删除数组指定下标元素 */
Array.prototype.remove=function(dx)  
{  
	if(isNaN(dx)||dx>this.length){return false;}  
	for(var i=0,n=0;i<this.length;i++) {
		if(this[i]!=this[dx]) {
			this[n++]=this[i];
		}  
	}  
	this.length-=1;
};


/* ------------- String扩展函数 -------------- */
// 判断字符串是否以str开头
String.prototype.startWith=function(str, ignoreCase)
{
	var reg = eval("/^"+str+"/");
	if (ignoreCase) 
		reg = eval("/^"+str+"/i");
	return reg.test(this);
};
String.prototype.startwith=function(str, ignoreCase)
{
	var reg = eval("/^"+str+"/");
	if (ignoreCase) 
		reg = eval("/^"+str+"/i");
	return reg.test(this);
};

// 判断字符串是否以str结尾
String.prototype.endWith=function(str, ignoreCase)
{
	var reg = eval("/"+str+"$/");
	if (ignoreCase) 
		reg = eval("/"+str+"$/i");
	return reg.test(this);
};
String.prototype.endwith=function(str, ignoreCase)
{
	var reg = eval("/"+str+"$/");
	if (ignoreCase) 
		reg = eval("/"+str+"$/i");
	return reg.test(this);
};
String.prototype.replaceAll=function(olds, news)
{
	return this.replace(new RegExp(olds,"gm"), news);
};


/* Date扩展函数 */
Date.prototype.format=function(fmt)
{
	var Y = this.getFullYear();
	var m = this.getMonth()+1;
	if (m < 10) m = "0"+m;
	var d = this.getDate();
	if (d < 10) d = "0"+d;
	var H = this.getHours();
	if (H < 10) H = "0"+H;
	var i = this.getMinutes();
	if (i < 10) i = "0"+i;
	var s = this.getSeconds();
	if (s < 10) s = "0"+s;

	return fmt.replace(/Y/g, Y).
			   replace(/m/g, m).
			   replace(/d/g, d).
			   replace(/H/g, H).
			   replace(/i/g, i).
			   replace(/s/g, s);
};


/* 数据格式判断 */
function is_number(num){
	var reg=/^[0-9]+$/;
	return reg.test(num);
};
function is_decimal(num){
	var reg=/^[0-9]+[\.]{0,1}[0-9]*$/;
	return reg.test(num);
};
function is_phone(str){
    var reg=/^1[0-9]{10}$/;
    return reg.test(str);
};
function is_email(str){
    var reg=/^[\w\-_\.]+@[\w\-_\.]+\.\w+$/;
    return reg.test(str);
}
function is_url(str){
    var reg='^((https|http|ftp|rtsp|mms)?://)' 
          + '(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
		  + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
		  + '|' // 允许IP和DOMAIN（域名） 
		  + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
		  + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
		  + '[a-z]{2,6})' // first level domain- .com or .museum 
		  + '(:[0-9]{1,4})?' // 端口- :80 
		  + '((/?)|' // a slash isn't required if there is no file name 
		  + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'; 
	var re=new RegExp(reg, 'i'); 
    return re.test(str);
}

/* ------------ Copy PHP function ------------ */
function implode(str, arr)
{
	var res="";
	var con="";
	for (var i=0; i<arr.length; ++i) {
		res+=con+arr[i];
		con=str;
	}
	return res;
};

function in_array(value, arr)
{
	var len=arr.length;
	for (var i=0; i<len; ++i)
		if (arr[i]==value)
			return true;
	return false;
};

function isset(v) 
{
	return typeof(v) != "undefined";
};

function array_keys(o)
{
	var res=[];
	for (var key in o) 
		res.push(key);
	return res;
};


function hasClass(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
};
function addClass(ele,cls) {
    if (!this.hasClass(ele,cls)) ele.className += " "+cls;
};
function removeClass(ele,cls) {
    if (hasClass(ele,cls)) {
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
        ele.className=ele.className.replace(reg,'');
    }
};

function date ( format, timestamp ) {
    var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
    var pad = function(n, c){
        if( (n = n + "").length < c ) {
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    var txt_weekdays = ["Sunday","Monday","Tuesday","Wednesday", "Thursday","Friday","Saturday"];        
    var txt_ordin = {1:"st",2:"nd",3:"rd",21:"st",22:"nd",23:"rd",31:"st"};
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var f = {
        // Day
            d: function(){
                return pad(f.j(), 2);
            },
            D: function(){
                t = f.l(); return t.substr(0,3);
            },
            j: function(){
                return jsdate.getDate();
            },
            l: function(){
                return txt_weekdays[f.w()];
            },
            N: function(){
                return f.w() + 1;
            },
            S: function(){
                return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th';
            },
            w: function(){
                return jsdate.getDay();
            },
            z: function(){
                return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0;
            },
        // Week
            W: function(){
                var a = f.z(), b = 364 + f.L() - a;
                var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
                if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
                    return 1;
                } else{
                    if(a <= 2 && nd >= 4 && a >= (6 - nd)){
                        nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                        return date("W", Math.round(nd2.getTime()/1000));
                    } else{
                        return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                    }
                }
            },
        // Month
            F: function(){
                return txt_months[f.n()];
            },
            m: function(){
                return pad(f.n(), 2);
            },
            M: function(){
                t = f.F(); return t.substr(0,3);
            },
            n: function(){
                return jsdate.getMonth() + 1;
            },
            t: function(){
                var n;
                if( (n = jsdate.getMonth() + 1) == 2 ){
                    return 28 + f.L();
                } else{
                    if( n & 1 && n < 8 || !(n & 1) && n > 7 ){
                        return 31;
                    } else{
                        return 30;
                    }
                }
            },
        // Year
            L: function(){
                var y = f.Y();
                return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0;
            },
            //o not supported yet
            Y: function(){
                return jsdate.getFullYear();
            },
            y: function(){
                return (jsdate.getFullYear() + "").slice(2);
            },
        // Time
            a: function(){
                return jsdate.getHours() > 11 ? "pm" : "am";
            },
            A: function(){
                return f.a().toUpperCase();
            },
            B: function(){
                // peter paul koch:
                var off = (jsdate.getTimezoneOffset() + 60)*60;
                var theSeconds = (jsdate.getHours() * 3600) +
                                 (jsdate.getMinutes() * 60) +
                                  jsdate.getSeconds() + off;
                var beat = Math.floor(theSeconds/86.4);
                if (beat > 1000) beat -= 1000;
                if (beat < 0) beat += 1000;
                if ((String(beat)).length == 1) beat = "00"+beat;
                if ((String(beat)).length == 2) beat = "0"+beat;
                return beat;
            },
            g: function(){
                return jsdate.getHours() % 12 || 12;
            },
            G: function(){
                return jsdate.getHours();
            },
            h: function(){
                return pad(f.g(), 2);
            },
            H: function(){
                return pad(jsdate.getHours(), 2);
            },
            i: function(){
                return pad(jsdate.getMinutes(), 2);
            },
            s: function(){
                return pad(jsdate.getSeconds(), 2);
            },
            //u not supported yet
        // Timezone
            //e not supported yet
            //I not supported yet
            O: function(){
               var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
               if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
               return t;
            },
            P: function(){
                var O = f.O();
                return (O.substr(0, 3) + ":" + O.substr(3, 2));
            },
            //T not supported yet
            //Z not supported yet
        // Full Date/Time
            c: function(){
                return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P();
            },
            //r not supported yet
            U: function(){
                return Math.round(jsdate.getTime()/1000);
            }
    };
    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){
        if( t!=s ){
            // escaped
            ret = s;
        } else if( f[s] ){
            // a date function exists
            ret = f[s]();
        } else{
            // nothing special
            ret = s;
        }
        return ret;
    });
}

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

