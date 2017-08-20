/* sqldefine.js, (c) 2016 mawentao */
define(function(require){
	var data;

	function getsql() {
		var sql = get_text_value('sqltxt');
		return require('common/sql').encode(sql);
	}

	// 全量查询
	function run() {
		mwt.confirm('全量查询可能会导致SQL执行超时，<br>强烈建议查询前20条数据！<br><br>确定要全量查询吗？',function(res){
			if (res) {
				var dbid = get_select_value('dbsel');
				var sql = getsql();
				require('./dialog').open(dbid,sql);
			}	
		});
	}

	// 查询前20条数据
	function runhead() {
		var dbid = get_select_value('dbsel');
		var sql = getsql();
		var reg = /limit/i;
		if (!reg.test(sql)) {
			sql += ' LIMIT 0,20';
		} else {
			var arr = sql.split(/limit/i);
			if (arr[1].length<10) {
				sql = arr[0]+' LIMIT 0,20';
			} else {
				sql += ' LIMIT 0,20';
			}
		}
		require('./dialog').open(dbid,sql);
	}

	// 保存SQL
	function save()
	{
		data.dbid = get_select_value('dbsel');
		data.sqlstatement = getsql();
		require('./sql_save_dialog').open(data);
	}

	// 恢复
	function restore()
	{
		set_value('sqltxt',data.sqlstatement);
	}

    var o={};
	o.init=function(_data){
		data = _data;
		var sqlbar = new MWT.Bar({
            render:"sqlbar-div",
            style: "background:#f1f1f1;border-bottom:solid 1px #ddd;padding:0;",
            items: [
				{html:'<span class="title">SQL定义</span>'},'->',
                {label:'<i class="fa fa-play-circle"></i> 查询前20条数据',
				 class:'mwt-btn mwt-btn-success',handler:runhead},
                {label:'<i class="fa fa-play-circle"></i> 全量查询',
				 class:'mwt-btn mwt-btn-danger',handler:run},
                {label:'<i class="fa fa-save"></i> 保存数据集',handler:save}
            ]
        });
        sqlbar.create();
		restore();
	};
	return o;
});
