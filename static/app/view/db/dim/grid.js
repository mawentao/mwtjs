define(function(require){
	var dialog=require('./dialog');
	var store,grid,gridid;

    var o = {};
	o.init = function(_gridid) {
		gridid = _gridid;
		var bar = [
            {type:'search',id:'so-key-'+gridid,width:300,placeholder:'查询维度',handler:o.query},
			'->',
			{label:btn.plus('新建维度'),handler:function(){
				dialog.open({table_name:''});
			}}
        ];
		store = new MWT.Store({
			url: ajax.getAjaxUrl('t_datacube_table_dim&action=query'),
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
			striped: true,
			tbar: bar,
			tbarStyle: 'margin-bottom:-1px;border:none;background:#fff;',
			bodyStyle: 'top:75px;bottom:38px;background:#fff;',
			cm: new MWT.Grid.ColumnModel([
				{head:"",dataIndex:"dbid",width:1,render:function(v){return '';}},
				{head:"维度",dataIndex:"dim_name",align:'left',width:150,sort:true,render:function(v,item){
					var icon = '<i class="sicon-hourglass gridi"></i>';
					return icon+' '+v;
				}},
				{head:'维度表名',dataIndex:'table_name',align:'left',width:180,sort:true,
				 render:function(v,item){
					return v;
				}},
				{head:'数据源',dataIndex:'src_table_id',align:'left',sort:true,render:function(v,item){
					var code = '<span style="font-size:12px;color:gray;">手动更新</span>';
					if (v!=0) {
						code = '[#'+item.src_table_id+'] '+item.tcomment+
							   ' ('+item.did_key+':'+item.dname_key+')';
					}
					if (item.uid!=dz.uid) return code;
					return code+=' <a href="javascript:;" class="grida" name="srcsetbtn-'+gridid+'" '+
									'data-id="'+item.table_name+'">设置</a>'
				}},
				{head:'所有者',dataIndex:'username',align:'center',width:100,sort:true,
				 render:function(v,item){
					return v;
				}},
				{head:"操作", dataIndex:"table_name",align:'right',width:150,render:function(v,item){
					var viewbtn = '<a class="grida" href="#/db/dim_data~did='+v+'">查看数据</a>';
					var editbtn = '<a class="grida" href="javascript:;" name="editbtn-'+gridid+'" data-id="'+v+'">编辑</a>';
					var delbtn ='<a class="grida" href="javascript:;" name="delbtn-'+gridid+'" data-id="'+v+'">删除</button>';
					var btns = [viewbtn,editbtn,delbtn];
					if (dz.uid!=item.uid) {
						btns = [viewbtn];
					}
					return btns.join("&nbsp;&nbsp;");
				}}
      		])
        });
		grid.create();
		store.on('load',function(res){
			// 帮助信息
			mwt.popinit();
			// 删除维度表
			jQuery('[name="delbtn-'+gridid+'"]').unbind('click').click(function(){
				var id=jQuery(this).data('id');
				mwt.confirm('确定要删除吗？',function(res){
					if (!res) return;
					ajax.post('t_datacube_table_dim&action=remove',{table_name:id},function(res){
						if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
						else { store.load(); }
					});
				});
			});
			// 编辑
			jQuery('[name=editbtn-'+gridid+']').unbind('click').click(function(){
				var id=jQuery(this).data('id');
				var record=grid.getRecord('table_name',id);
				if (record) {
					dialog.open(record);
				}
			});
			// 设置数据源
			jQuery('[name=srcsetbtn-'+gridid+']').unbind('click').click(function(){
				var id=jQuery(this).data('id');
				var record=grid.getRecord('table_name',id);
				if (record) require('./srctabl_dialog').open(record);
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

    return o;
});
