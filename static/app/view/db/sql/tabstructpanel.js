/* tabstructpanel.js, (c) 2016 mawentao */
define(function(require){
	var exmsg = require('common/extmsg');
	var table;

	// 查看数据表前20条记录
	function table_data_head() {
		if (table=='') {
			mwt.notify('选择数据表',1500,'danger');
			return;
		}
		var dbid = get_select_value('dbsel');
		var sql = "SELECT * FROM "+table+" LIMIT 20";
		require('./dialog').open(dbid,sql);
	}

	var o={};

	o.init=function() {
		var dtbar = new MWT.Bar({
			render: 'tablebar-div',
			style: "background:#f1f1f1;border-bottom:solid 1px #ddd;padding:0;",
			items: [
				{html:'<span id="dtstitle" class="title">表结构</span>'},'->',
                {label:"<i class='icon icon-preview' style='padding:0;font-size:16px;vertical-align:text-bottom;'></i> 前20条数据",
				 class:'mwt-btn mwt-btn-primary',handler:table_data_head},
			]
		});
		dtbar.create();
	};

	o.reset = function() {
		table = '';
		jQuery('#dtstitle').html("表结构");
		jQuery('#tablebody-div').html("");
	};

	o.show = function(dtname) {
		table=dtname;
		jQuery('#dtstitle').html("表结构（"+dtname+"）");
		var jd = jQuery('#tablebody-div');
		jd.html(exmsg.getloading());
		ajax.post('table&action=getstruct',{dtname:dtname,dbid:get_select_value('dbsel')},function(res){
			if (res.retcode!=0) jd.html(exmsg.error(res.retmsg));
			else {
				jd.html('<pre><code>'+res.data.replace(/[\r|\n]/g,'<br>')+'</code></pre>');
				require('highlight').highlightBlock(mwt.$('tablebody-div'));
			}
		});
	};
	
	return o;
});
