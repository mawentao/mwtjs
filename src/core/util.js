/**
 * 操作html元素的工具函数
 */

mwt.set_html=function(eleid, value)
{/*{{{*/
	document.getElementById(eleid).innerHTML = value;
}/*}}}*/

mwt.get_value=function(eleid)
{/*{{{*/
	var dom = document.getElementById(eleid);
	return dom.value.trim();
}/*}}}*/

mwt.get_text_value=function(eleid)
{/*{{{*/
	var dom = document.getElementById(eleid);
	var val = dom.value.trim();
	if (val == "") {
		dom.value = "";
		dom.focus();
		throw new Error(eleid+" is empty");
	}
	return val;
}/*}}}*/


mwt.set_value=function(eleid, value)
{/*{{{*/
	document.getElementById(eleid).value = value;
}/*}}}*/


/* 数据格式判断 */
mwt.isNumber=function(num){
	var reg=/^[-]?[0-9]+$/;
	return reg.test(num);
};
mwt.isDecimal=function(num){
	var reg=/^[0-9]+[\.]{0,1}[0-9]*$/;
	return reg.test(num);
};
mwt.isPhone=function(str){
    var reg=/^1[0-9]{10}$/;
    return reg.test(str);
};
mwt.isEmail=function(str){
    var reg=/^[\w\-_\.]+@[\w\-_\.]+\.\w+$/;
    return reg.test(str);
}
mwt.isUrl=function(str){
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

mwt.set_checkbox_checked = function(elename, checked)
{/*{{{*/
	var doms = document.getElementsByName(elename);
	for (var i=0; i<doms.length; ++i) {
		doms[i].checked = checked;
	}
}/*}}}*/

mwt.set_checkbox_values=function(elename, varr)
{/*{{{*/
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
}/*}}}*/

mwt.get_select_value=function(eleid)
{/*{{{*/
	var sel = document.getElementById(eleid);
	return sel.options[sel.selectedIndex].value;
}/*}}}*/

mwt.set_select_value=function(eleid, value)
{/*{{{*/
	var sel = document.getElementById(eleid);
	for(var i=0; i<sel.options.length; i=i+1){
		if(sel.options[i].value == value){
			sel.options[i].selected = true;
			break;
		}
	}
}/*}}}*/

mwt.get_radio_value=function(elename)
{/*{{{*/
	var radios = document.getElementsByName(elename);
	var result;
	for(var i=0; i<radios.length; i=i+1){
		if(radios[i].checked){
			result = radios[i].value;
			break;
		}
	}
	return result;
}/*}}}*/

mwt.get_checkbox_values=function(elename)
{/*{{{*/
	var values = [];
	var doms = document.getElementsByName(elename);
	for (var i=0; i<doms.length; ++i) {
		if (doms[i].checked) {
			values.push(doms[i].value);
		}
	}
	return values;
}/*}}}*/

mwt.set_radio_value=function(elename, value)
{/*{{{*/
	var doms = document.getElementsByName(elename);
	for (var i=0; i<doms.length; ++i) {
		if (doms[i].value == value) {
			doms[i].checked = true;
			return;
		}
	}
}/*}}}*/


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


/* ------------ get dom value ----------- */
function get_html(eleid)
{
	return document.getElementById(eleid).innerHTML;
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


/* ------------ set dom value ------------ */



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

