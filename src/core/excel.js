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
window.export_excel = function(domid,filename,style)
{
	if(getbrowser()=='ie') {
		window.alert('不支持IE内核浏览器，请使用Chrome或FireFox浏览器！');
		return;
	}
    if (!style) style='';
	var uri = 'data:application/vnd.ms-excel;base64,';
	var template = '<html><head><title>'+filename+'</title><meta charset="UTF-8">'+
			'<style>'+
                'table {font-size:12px;border-collapse:collapse;border-color:#ddd;}'+
                'th,thead td {background:#333;color:#fff;font-weight:normal;}'+
                'th,td {height:25px;vertical-align:middle;mso-number-format:"\@";border-color:#ddd;text-align:center;}'+
                style+
            '</style>'+
		'</head><body><table border="1">{table}</table></body></html>';
    var format = function(s, c) { return s.replace(/{(\w+)}/g, function(m,p) {return c[p];}) };
	var table = document.getElementById(domid);
	///////////////////////////////////////////////
	var tripTags = new RegExp("(<\/?table.*?>|<input.*?>|<colgroup.*?</colgroup>|<tfoot.*?</tfoot>)","gi");//!< 删除这些标签
	var tableHtml = table.innerHTML.replace(tripTags,"");
	var cleanTh = new RegExp("<th .*?>","gi");  //!< 删除th标签的属性
	tableHtml = tableHtml.replace(cleanTh,"<th>");
	var cleanTd = new RegExp("<td .*?>","gi");  //!< 删除td标签的属性
	tableHtml = tableHtml.replace(cleanTd,"<td>");
	///////////////////////////////////////////////
	var ctx = {worksheet:'Worksheet', table:tableHtml};
	var code = base64(format(template,ctx));
	var fsize = code.length;
	//console.log(fsize);
	if (fsize>=2*1024*1024) {
		mwt.alert("导出的数据不能超过2MB");
		return;
	}
	
	var aLink = document.createElement('a'); 
	aLink.download = filename;
	aLink.href = uri + code;//dataurl格式的字符串 
	var evt = document.createEvent("MouseEvents");//建立一个事件 
	evt.initEvent("click", false, false);//这是一个单击事件 
	aLink.dispatchEvent(evt);//触发事件 
}

