define(function(require){
	var store,grid,gridid;

    var o = {};
	o.init = function(_gridid) {
		gridid = _gridid;
		// create grid
		var typeopt = [
			{text:'全部', value:'0'},
			{text:'物理表', value:'1'},
			{text:'SQL', value:'2'}
		];
		var bar = [
            {type:"select",id:"type-"+gridid,value:0,label:'类型',options:typeopt,handler:o.query},
            {type:'search',id:'so-key-'+gridid,width:300,placeholder:'查询数据集',handler:o.query},
			'->',
			{label:btn.plus('创建SQL数据集'),handler:function(){
                window.location='#/db/sql';
			}}
        ];
		store = new MWT.Store({
			url: ajax.getAjaxUrl('t_datacube_table&action=query'),
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
			bodyStyle: 'background:#fff',
			cm: new MWT.Grid.ColumnModel([
				{head:"",dataIndex:"dbid",width:1,render:function(v){return '';}},
				{head:"数据集名称",dataIndex:"tcomment",align:'left',sort:true,render:function(v,item){
					var icon = '<i class="fa fa-table gridi"></i>';
					switch (parseInt(item.ttype)) {
						case 2: icon='<i class="iconop sql"></i>'; break;
					} 
					return icon+' '+v;
				}},
				{head:'数据表',dataIndex:'tname',align:'left',width:400,sort:true,render:function(v,item){
					if(item.ttype == 2) {
                        return '<a href="javascript:;" name="sqlva" data-id="' + item.tid + '"' +
                            'style="display:block;width:400px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;' +
                            'color:#000080;font-size:12px;">' + v + '</a>';
                    }
                    return v;
				}},
				{head:'数据源',dataIndex:'dbname',align:'left',width:150,sort:true,render:function(v,item){
					var icon = '';
					if (item.dbtype==1) icon='<i class="iconop ecs-mysql"></i> ';
					return icon+v;
				}},
				{head:'所有者',dataIndex:'username',align:'center',width:100,sort:true,render:function(v,item){
					return v;
				}},
				{head:"操作", dataIndex:"tid",width:200,align:'right', render:function(v,item){
                    var modbtn = '';
                    if(item.ttype == 2){
                    	var modurl = '#/db/sql~tid='+v;
                    	modbtn = '<a class="grida" href="'+modurl+'">编辑SQL</a>';
					}
					var editurl = '#/db/dataset_edit~tid='+v;
					var editbtn = '<a class="grida" href="'+editurl+'">字段定义</a>';
					var viewbtn = '<a class="grida" href="#/db/dataset_view~t='+item.t+'" target="_blank">查看数据</a>';
					var delbtn ='<a class="grida" href="javascript:;" name="delbtn-'+gridid+'" data-id="'+v+'">删除</button>';
					var btns = [modbtn, editbtn, viewbtn, delbtn];
					return btns.join("&nbsp;");
				}}
      		])
        });
		grid.create();
		store.on('load',function(res){
			// 帮助信息
			mwt.popinit();

			// 删除
			jQuery('[name="delbtn-'+gridid+'"]').unbind('click').click(function(){
				var id=jQuery(this).data('id');
				mwt.confirm('确定要删除吗？',function(res){
					if (!res) return;
					ajax.post('t_datacube_table&action=remove',{tid:id},function(res){
						if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
						else { store.load(); }
					});
				});
			});

			// 显示sql全文
            jQuery('[name="sqlva"]').unbind('click').click(function(){
                var id=jQuery(this).data('id');
                var im = grid.getRecord("tid", id);
                // debugger
                require('./sql_dialog').open(im.tname);
            });
		});
		o.query();
	};

	o.query=function() {
		store.baseParams = {
			//day: get_value('dt-'+gridid),
            //status: get_select_value('status-'+gridid),
            type: get_select_value('type-'+gridid),
            key: get_value("so-key-"+gridid)
        };
        grid.load();
	};

    return o;
});
