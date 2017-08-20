/* 数据表字段查看 */
define(function(require){
	var item,dialog,form;
	var store,grid;
	var domid='db_source_table_dialog';

	function query() {
		store.baseParams = {
			dbid: item.dbid,
			tname: item.tname
		};
		grid.load();
	}

	function init_grid() {
		store = new MWT.Store({
			url: ajax.getAjaxUrl('t_datacube_db&action=query_table_columns')
        });
        grid = new MWT.Grid({
            render: 'grid-'+domid,
            store: store,
            pagebar: false,
			position: 'fixed',  //!< 固定位置显示
            bordered: false,
			striped: true,
			bodyStyle: 'top:29px;bottom:35px;',
            cm: new MWT.Grid.ColumnModel([
              {head:"", dataIndex:"store_index", width:40,render:function(v,item){
				  return (v+1)+'.';
			  }},
              {head:"Field", dataIndex:"Field", width:200},
              {head:"Type", dataIndex:"Type", width:150},
              {head:"Comment", dataIndex:"Comment"},
            ])
        });
        grid.create();
	}

	function init() {
		dialog = new MWT.Dialog({
			render : domid,
            title  : '数据表',
            width  : 600,
            height : 450,
            top    : 50,
            form   : form,
            bodyStyle: 'padding:10px;position:relative;margin-top:-1px;',
            body   : '<div id="grid-'+domid+'"></div>'
        });

		dialog.on('open',function(){
			if (!grid) init_grid();
			query();
			dialog.setTitle('<i class="fa fa-table ico"></i> <span style="font-size:12px;">'+item.tname+'</span>');
        });
	}

	var o={};

	o.open=function(_item){
		item=_item;
		if (!dialog) init();
		dialog.open();
	};

	return o;
});
