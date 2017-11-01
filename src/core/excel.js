/* 导出文件 */
/**
 * 获取浏览器信息
 **/
function getbrowser() { 
	var broswertypes ={
		'ie'      : 'msie',
		'firefox' : 'firefox',
		'chrome'  : 'chrome',
		'opera'   : 'opera',
		'safari'  : 'safari'
	};
	var agent = window.navigator.userAgent.toLowerCase();
	for (var k in broswertypes) {
		if (agent.indexOf(broswertypes[k])>=0)
			return k;
	}
	return 'unknow';
}

/**
 * base64加密
 **/
function base64(s) 
{
	return window.btoa(unescape(encodeURIComponent(s))); 
}

/**
 * 导出table到excel
 **/
window.export_excel = function(domid,filename)
{
	if(getbrowser()=='ie') {
		window.alert('不支持IE内核浏览器，请使用Chrome或FireFox浏览器！');
		return;
	}
	var uri = 'data:application/vnd.ms-excel;base64,';
	var template = '<html><head><title>'+filename+'</title><meta charset="UTF-8">'+
			'<style>table{font-size:13px;font-family:"微软雅黑";border-color:#666;} tr {height:25px;}'+
            'th, thead td {background:#eee;color:#000} th,td{border-color:#666;vertical-align:middle;}</style>'+
		'</head><body><table border="1">{table}</table></body></html>';
    var format = function(s, c) { return s.replace(/{(\w+)}/g, function(m,p) {return c[p];}) };
	var table = document.getElementById(domid);
	var ctx = {worksheet:'Worksheet', table:table.innerHTML};
	
	var aLink = document.createElement('a'); 
	aLink.download = filename;
	aLink.href = uri + base64(format(template, ctx));//dataurl格式的字符串 
	var evt = document.createEvent("MouseEvents");//建立一个事件 
	evt.initEvent("click", false, false);//这是一个单击事件 
	aLink.dispatchEvent(evt);//触发事件 
}

