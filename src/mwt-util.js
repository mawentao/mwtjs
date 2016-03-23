/**
 * ����htmlԪ�صĹ��ߺ���
 */

// ����
function hide(eleid)
{
	document.getElementById(eleid).style.display = "none";
}

// ��ʾ
function display(eleid)
{
   	document.getElementById(eleid).style.display = "block";
}
function show(eleid)
{
   	document.getElementById(eleid).style.display = "block";
}

// ʱ�����ں���

// ��ȡ��ǰʱ�����s��, phpͬ���ӿڣ�
function time()
{
    var nt = new Date();
	var tm = nt.getTime() / 1000;
	return Math.ceil(tm);
}

// ��ȡ��ʽ�������ڣ�phpͬ���ӿڣ�
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

// php�е�print_r
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


/* ------------- ������չ���� ---------------- */
/* ɾ������ָ���±�Ԫ�� */
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


/* ------------- String��չ���� -------------- */
// �ж��ַ����Ƿ���str��ͷ
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

// �ж��ַ����Ƿ���str��β
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


/* Date��չ���� */
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


/* ���ݸ�ʽ�ж� */
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
          + '(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp��user@ 
		  + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP��ʽ��URL- 199.194.52.184 
		  + '|' // ����IP��DOMAIN�������� 
		  + '([0-9a-z_!~*\'()-]+.)*' // ����- www. 
		  + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // �������� 
		  + '[a-z]{2,6})' // first level domain- .com or .museum 
		  + '(:[0-9]{1,4})?' // �˿�- :80 
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

