define(function(require){
	//var dict=require('common/dict');
	//var help=require('common/help');
	var dialog=require('./dialog');
	var store,grid,gridid,dimInfo;

    var o = {};
	o.init = function(_gridid,_dimInfo) {
		gridid = _gridid;
		dimInfo = _dimInfo;
		var table_name = dimInfo.table_name;
		// create grid
		var addbtn = btn.plus('添加数据');
		if (dimInfo.src_table_id!=0) {
			addbtn = btn.sync('立即更新数据');
		}
		var bar = [
            {type:'search',id:'so-key-'+gridid,width:300,placeholder:'查询维度ID或维度名',handler:o.query},
			'->',
			{label:addbtn,handler:function(){
				if (dimInfo.src_table_id==0) {
					dialog.open({did:'',dname:'',table:table_name});
				} else {
					var msgid=mwt.notify('维度数据更新中...',0,'loading');
					ajax.post('db&action=sync_dim_data',{table_name:table_name},function(res){
						mwt.notify_destroy(msgid);
						if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
						else {
							mwt.notify("更新完毕",1500,'success');
							o.query();
						}
					});
				}
			}}
        ];
		store = new MWT.Store({
			url: ajax.getAjaxUrl('t_datacube_table_dim&action=query_data&table_name='+table_name),
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
			tbar: bar,
			tbarStyle: 'margin-bottom:-1px;border:none;background:#fff;',
			bodyStyle: 'top:75px;bottom:37px;background:#fff;',
			cm: new MWT.Grid.ColumnModel([
				{head:'',dataIndex:'did',width:10,render:function(v){return '';}},
				{head:"维度ID",dataIndex:"did",align:'left',width:180,sort:true,render:function(v,item){
					return v;
				}},
				{head:'维度名称',dataIndex:'dname',align:'left',width:180,sort:true,render:function(v,item){
					return v;
				}},
				{head:"更新时间", dataIndex:"modtime",align:'left', render:function(v,item){
					return '<span style="font-size:12px;color:gray;">'+v+'</span>';
				}},
				{head:"", dataIndex:"did",align:'right',width:100,render:function(v,item){
					var editbtn = '<a class="grida" href="javascript:;" name="editbtn-'+gridid+'" data-id="'+v+'">编辑</button>';
					var delbtn ='<a class="grida" href="javascript:;" name="delbtn-'+gridid+'" data-id="'+v+'">删除</button>';
					var btns = [];
					if (dimInfo.src_table_id==0) {
						btns = [editbtn,delbtn];
					}
					return btns.join('&nbsp;&nbsp;');
				}},
      		])
        });
		grid.create();
		store.on('load',function(res){
			// 帮助信息
			mwt.popinit();
			// 编辑
			jQuery('[name="editbtn-'+gridid+'"]').unbind('click').click(function(){
				var id=jQuery(this).data('id');
				var im=grid.getRecord('did',id);
				if (im) { im.table=table_name; dialog.open(im); }
			});
			// 删除
			jQuery('[name="delbtn-'+gridid+'"]').unbind('click').click(function(){
				var id=jQuery(this).data('id');
				mwt.confirm('确定要删除吗？',function(res){
					if (!res) return;
					ajax.post('dim_manage&action=remove_dim_data',{table:table_name,did:id},function(res){
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

    return o;
});
