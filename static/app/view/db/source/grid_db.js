define(function(require){
	//var dict=require('common/dict');
	//var help=require('common/help');
	var dialog=require('./db_dialog');
	var store,grid,gridid;

    var o = {};
	o.init = function(_gridid) {
		gridid = _gridid;
		// create grid
		var bar = [
			//{type:"select",id:"status-"+gridid,value:0,label:'状态',
			 //options:dict.get_egstatus_options({text:'全部',value:'0'}),handler:o.query},
            {type:'search',id:'so-key-'+gridid,width:300,placeholder:'查询数据源',handler:o.query},
			'->',
			{label:btn.plus('添加数据源'),handler:function(){
				dialog.open({dbid:0});				
			}}
        ];
		store = new MWT.Store({
			url: ajax.getAjaxUrl('t_datacube_db&action=query'),
			beforeLoad: store_before_load,
			afterLoad: store_after_load
  		});
		grid = new MWT.Grid({
			render: gridid,
			store: store,
			pagebar: true,
			pageSize: 20,
			bordered: false,
			position: 'fixed',
			multiSelect:false, 
			pagebarSimple: true,
			striped: true,
			tbar: bar,
			tbarStyle: 'margin-bottom:-1px;border:none;background:#fff;',
			bodyStyle: 'background:#fff;',
			cm: new MWT.Grid.ColumnModel([
				{head:"",dataIndex:"dbid",width:1,render:function(v){return '';}},
				{head:"数据库",dataIndex:"dbdesc",align:'left',sort:true,render:function(v,item){
					return '<i class="iconop ecs-mysql"></i> '+v+' <span style="color:gray">('+item.dbname+')</span>';
				}},
				{head:'所有者',dataIndex:'username',align:'center',width:100,sort:true,
				 render:function(v,item){
					return v;
				}},
				{head:"操作", dataIndex:"dbid",width:80,align:'right', render:function(v,item){
					var editbtn = '<a class="grida" href="javascript:;" name="editbtn-'+gridid+'" data-id="'+v+'">编辑</a>';
					var delbtn ='<a class="grida" href="javascript:;" name="delbtn-'+gridid+'" data-id="'+v+'">删除</button>';
					var btns = [editbtn,delbtn];
					return btns.join("&nbsp;&nbsp;");
				}}
      		]),
			rowclick: function(item) {
				require('./grid_table').query_db_table(item);
			}
        });
		grid.create();
		store.on('load',function(res){
			// 帮助信息
			mwt.popinit();
			// 编辑
			jQuery('[name="editbtn-'+gridid+'"]').unbind('click').click(function(){
				var id = jQuery(this).data('id');
				var item = grid.getRecord('dbid',id);
				dialog.open(item);
			});
			// 删除
			jQuery('[name="delbtn-'+gridid+'"]').unbind('click').click(function(){
				var id=jQuery(this).data('id');
				mwt.confirm('确定要删除吗？',function(res){
					if (!res) return;
					ajax.post('t_datacube_db&action=remove',{dbid:id},function(res){
						if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
						else { store.load(); }
					});
				});
			});
		});
		o.query();
	};

	o.query=function() {
		store.baseParams = {
			//day: get_value('dt-'+gridid),
			//status: get_select_value('status-'+gridid),
            key: get_value("so-key-"+gridid)
        };
        grid.load();
	};

	/* 批量设置奖项状态
	function bat_set_status(id)
	{
		var idarr = [];
		if (id) idarr.push(id);
		else {
			var records=grid.getSelectedRecords();
			if (records.length==0) {
				mwt.notify('未选择记录',1500,'danger');
				return;
			}
			for (var i=0;i<records.length;++i) {
            	idarr.push(records[i].pid);
			}
		}
		//require('./dialog_status').open(idarr);
	}*/

    return o;
});
