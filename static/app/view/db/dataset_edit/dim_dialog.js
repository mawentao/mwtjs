/* 维度表选择 */
define(function(require){
	var dialog,store,grid,callback;

	function init_grid() {
		store = new MWT.Store({
			url: ajax.getAjaxUrl('t_datacube_table_dim&action=query')
  		});
		grid = new MWT.Grid({
			render: "dim_dialog_grid_div",
			store: store,
			pagebarSimple: true,
			pagebar: true,
			pageSize: 20,
			position: 'fixed',
			multiSelect:false,
			tbarStyle: 'background:#f2f2f2;',
			bodyStyle: 'top:77px',
			cm: new MWT.Grid.ColumnModel([
				{head:"维度名", dataIndex:"dim_name", width:200, sort:true,render:function(v){
					return '<i class="sicon-tag grida"></i> '+v;
				}},
				{head:"维度表", dataIndex:"table_name", sort:true},
				{head:"", width:100, align:'right', dataIndex:"table_name",render:function(v){
					return '<a class="grida" href="#/db/dim_data~did='+v+'" target="_blank">查看数据</a>';
				}}
      		]),
			tbar: [
                {type:'search',id:'so-key',width:200,placeholder:'查询维度',handler:query},
                '->',
                {html:'<label><a href="#/db/dim" target="_blank" class="grida">没有适用的维度？</a></label>'}
			],
			rowclick: rowclick
        });
		grid.create();
		query();
	};

	function rowclick(im) {
		if (callback) {
			callback(im);
		}
		dialog.close();
	}

	function query() {
		store.baseParams = {
            key: get_value("so-key")
        };
        grid.load();
	}

	function init() {
		dialog = new MWT.Dialog({
            title  : '选择维度',
            width  : 600,
			height : 450,
            top    : 50,
            body   : '<div style="position:absolute;top:41px;left:0;right:0;bottom:0;" id="dim_dialog_grid_div"></div>'
        });
		dialog.on('open',function(){
			if (!grid) init_grid();
		});
	}

	var o={};
	o.open = function(cbkfun){
		if (cbkfun) callback=cbkfun;
		if (!dialog) init();
		dialog.open();
	};
	return o;
});
