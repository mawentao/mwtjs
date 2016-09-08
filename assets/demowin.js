/** 创建Demo组表格 */
function create_demo_group_grid()
{
	var demo_group_data = [];
	var list = require("conf/main");
	for (var i=0; i<list.length; ++i) {
		var name = list[i].name;
		var item = [i, name];
		demo_group_data.push(item);
	}

	var store = new Ext.data.Store({
		proxy: new Ext.data.MemoryProxy(demo_group_data),
		reader: new Ext.data.ArrayReader({}, [{name: 'k'},{name: 'v'}])
	});
	store.load();

	demo_group_grid = new Ext.grid.GridPanel({
		store: store,
		cm: new Ext.grid.ColumnModel([
				{header:'key',dataIndex:'k', fixed : true, hidden: true},
				{id:'expc', header:'Demo Group',dataIndex:'v'}
			]),
		autoExpandColumn : 'expc',
		border: false,
		viewConfig: {
            scrollOffset: 0,
            getRowClass : function(record, rowIndex, p, ds){ 
                if(rowIndex%2==0){ return "row_even"; }
                else{ return "row_odd"; }       
            }
        }
	});
	demo_group_grid.getSelectionModel().on('rowselect',function(t,index,e){choose_demo_grid();});
}

function choose_demo_grid()
{
	var list = require("conf/main");
	var ss = demo_group_grid.getSelectionModel().getSelections();
	if(ss[0] != null){
		demo_store.proxy = new Ext.data.MemoryProxy(list[ss[0].get('k')].items);
		demo_store.reload();
		demo_grid.view.refresh();
	}
}

function create_demo_grid()
{
	demo_store = new Ext.data.Store({
		proxy: new Ext.data.MemoryProxy([]),
		reader: new Ext.data.ArrayReader({}, [
			{name: 'k'},
			{name: 'v'}
		])
	});
	demo_store.load();
	demo_grid = new Ext.grid.GridPanel({
		store: demo_store,
		cm: new Ext.grid.ColumnModel([
                new Ext.grid.RowNumberer(),
				{header:'key',dataIndex:'k', fixed : true, hidden: true},
				{id:'expc', header:'Demo（双击选择）',dataIndex:'v'}
			]),
		autoExpandColumn : 'expc',
		border: false,
		frame: false,
		viewConfig: {
            scrollOffset: 0,
            getRowClass : function(record, rowIndex, p, ds){ 
                if(rowIndex%2==0){ return "row_even"; }
                else{ return "row_odd"; }       
            }
        }
	});
    demo_grid.on('dblclick',function(){choose_demo();});
}

function create_demowin()
{
	create_demo_group_grid();
	create_demo_grid();
	demowin = new Ext.Window({
		el: 'demowin_div',
		title : 'Demos',
		width : 500,
		height : 400, 
		draggable : true,
		resizable : true,
		closable : true,  
		maximizable: true,
		layout : 'border', 
		modal: true, 
		closeAction: 'hide',
		items: [
			{region:'west', split:true, width:150, border: false, layout:'fit',
			 style:'border-width:0 1px 0 0;',
             items:[demo_group_grid] },
			{region:'center', layout:'fit', border:false,
			 style:'border-width:0 0 0 1px;',
             items:[demo_grid] }
		],
		buttons : [
			{text : '确定', handler: choose_demo},
			{text : '取消', handler: close_demo_win} 
		]
	});
}

function open_demo_win()
{
	demowin.show();
}

function close_demo_win()
{
	demowin.hide();
}

function choose_demo()
{
	var s1 = demo_group_grid.getSelectionModel().getSelections();
	var s2 = demo_grid.getSelectionModel().getSelections();
	if(s1[0] == null || s2[0] == null){
		alert("No Demo Selected!");
		return;
	}
	var page = "demos/"+s1[0].get('v')+"/"+s2[0].get('k');
	window.location = "#/~f="+page;
}
