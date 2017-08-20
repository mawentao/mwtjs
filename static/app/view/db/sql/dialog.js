/* SQL查询结果, (c) 2016 mawentao */
define(function(require){
	var dialog,elapse,stopjs;
	var dbid,sql;

	function init() {
		dialog = new MWT.Dialog({
			render : 'console-dialog-div',
            title  : '<span style="color:darkgreen;"><i class="fa fa-play-circle-o"></i> RunSql</span>',
			fullscreen: true,
			bodyStyle: 'background:#f1f1f1;position:absolute;top:43px;left:0;right:0;bottom:0;overflow:auto;',
            body   : '<div id="console-tab" style="padding-bottom:43px;"></div>'+
					 '<div style="background:#fff;height:43px;line-height:43px;border-top:solid 1px #ddd;'+
						'position:fixed;bottom:0;left:0;right:0;">'+
						'<button id="exportbtn" class="mwt-btn mwt-btn-success radius" style="float:right;margin:5px 10px 0 0;">'+
							'<i class="fa fa-download"></i> 导出到Excel</button>'+
					 '</div>'
        });
		dialog.on('open',function(){
			runsql();
		});
	}

	function checksql() {
		//var reg = /delete|update|insert|replace|drop|create|alter/i;
		var reg = /delete|insert|replace|drop|alter/i;
		return !reg.test(sql);
	}

	function jishi() {
		if (stopjs) return;
		++elapse;
		jQuery('#elapse-div').html(elapse+"秒");
		setTimeout(jishi,1000);
	}

	function runsql() {
		elapse = 0;
		stopjs=false;
		var jtb = jQuery('#console-tab');
		var code = '<tr><td style="font-size:13px;color:#333;padding:10px;">'+
			'<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw" style="font-size:13px;"></i> 正在执行SQL...'+
            '<span>（已耗时： <b style="color:red;" id="elapse-div"></b>）</span>'+
		'</td></tr>';
		jtb.html(code);
		jishi();
		var params = {
			dbid: dbid,
			sql: sql
		};
		ajax.post('table&action=runsql',params,function(res){
			stopjs=true;
			if (res.retcode!=0) {
				mwt.alert(res.retmsg);
			} else {
				if (res.data.tbody.length==0) {
					jtb.html('<p style="margin:10px;font-size:13px;color:#666;">数据查询结果为空！</p>');
				} else {
					var tabid = require('common/table').render('console-tab',res.data.thead,res.data.tbody);
					jQuery('#exportbtn').unbind('click').click(function(){
						export_excel(tabid,tabid+".xls");
					});
				}
			}
		});
	}

    var o={};

	o.open=function(_dbid,_sql){
		dbid = _dbid;
		sql = _sql;
		if (!checksql()) {
			mwt.alert('SQL语句不安全！');
			return;
		}
		if (!dialog) {
			init();
		}
		dialog.open();
	};

	return o;
});
