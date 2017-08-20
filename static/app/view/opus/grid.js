define(function(require){
	var store,grid,gridid;

    var o = {};
	o.init = function(_gridid) {
		gridid = _gridid;
		// create grid
		var bar = [
            {type:'search',id:'so-key-'+gridid,width:300,placeholder:'查询看板名称',handler:o.query},
			'->',
			{label:btn.plus("创建分析看板"),handler:function(){
				window.location='#/design';
			}}
        ];
		store = new MWT.Store({
			url: ajax.getAjaxUrl('t_datacube_board&action=query'),
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
			tbarStyle: 'margin-bottom:-1px;border-color:#ebebeb;background:#fff;',
			bodyStyle: 'top:77px;bottom:37px;background:#fff;',
			cm: new MWT.Grid.ColumnModel([
				{head:"看板名称",dataIndex:"name",align:'left',sort:true,render:function(v,item){
					var icon = '<i class="fa fa-desktop gridi"></i>';
					return '<a href="#/opus/dashboard~b='+item.id+'" class="grida" style="color:#000;">'+icon+' '+v+'</a>';
				}},
				{head:'作者',dataIndex:'username',align:'center',width:100,render:function(v,item){
					return v;
				}},
				{head:'创建时间',dataIndex:'ctime',align:'center',width:120,sort:true,render:function(v,item){
					var tm = strtotime(v);
					return '<span style="color:gray;font-size:12px;">'+date('Y-m-d H:i',tm)+'</span>';
				}},
				{head:'查看次数',dataIndex:'views',align:'right',sort:true,width:100,render:function(v,item){
					return v;
				}},
				{head:"操作", dataIndex:"id",width:130,align:'right', render:function(v,item){
					var url = "#/opus/dashboard~b="+v;
					var viewbtn = '<a class="grida" href="'+url+'">查看</a>';
					url = '#/design~b='+v;
					var editbtn = '<a class="grida" href="'+url+'">编辑</a>';
					var delbtn ='<a class="grida" href="javascript:;" name="delbtn-'+gridid+'" data-id="'+v+'">删除</a>';
					var btns = [viewbtn,editbtn,delbtn];
					if (item.uid!=dz.uid){btns=[viewbtn];}
					return btns.join("&nbsp;&nbsp;");
				}}
      		])
        });
		grid.create();
		store.on('load',function(res){
			// 帮助信息
			mwt.popinit();
			// 编辑
			jQuery('[name="editbtn-'+gridid+'"]').unbind('click').click(function(){
				var id = jQuery(this).data('id');
				var item = grid.getRecord('pid',id);
				dialog.open(item);
			});
			// 删除
			jQuery('[name="delbtn-'+gridid+'"]').unbind('click').click(function(){
				var id=jQuery(this).data('id');
				mwt.confirm('确定要删除吗？',function(res){
					if (!res) return;
					ajax.post('t_datacube_board&action=remove',{b:id},function(res){
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
            key: get_value("so-key-"+gridid)
        };
        grid.load();
	};

    return o;
});
