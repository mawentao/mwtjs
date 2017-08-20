define(function(require){
	//var dict=require('common/dict');
	//var help=require('common/help');
	//var dialog=require('./dialog');
	var store,grid,gridid;

    var o = {};
	o.init = function(_gridid) {
		gridid = _gridid;
		// create grid
		var bar = [
			//{type:"select",id:"status-"+gridid,value:0,label:'状态',
			 //options:dict.get_egstatus_options({text:'全部',value:'0'}),handler:o.query},
			{html:'<label id="db-'+gridid+'" style="font-size:12px;color:#FF5722;"></label>'},
			'->',
            {type:'search',id:'so-key-'+gridid,width:200,placeholder:'查询数据表',handler:o.query}
        ];
		store = new MWT.Store({
			url: ajax.getAjaxUrl('db&action=query_table'),
			beforeLoad: store_before_load,
			afterLoad: store_after_load
  		});
		grid = new MWT.Grid({
			render: gridid,
			store: store,
			pagebar: true,
			pageSize: 50,
			bordered: false,
			position: 'fixed',
			multiSelect:false,
			tbar: bar,
			tbarStyle: 'margin-bottom:-1px;border:none;background:none;',
			cm: new MWT.Grid.ColumnModel([
				{head:"数据表",dataIndex:"Name",align:'left',sort:true,width:230,render:function(v,item){
					return '<i class="fa fa-table" style="color:#00c1de;vertical-align:middle;"></i> '+v;
				}},
				{head:'备注',dataIndex:'Comment',align:'left',render:function(v,item){
					return '<span style="font-size:12px;color:#666">'+v+'</span>';
				}},
				{head:"操作", dataIndex:"Name",width:170,align:'right', render:function(v,item){
					var viewbtn = '<a class="grida" href="javascript:;" name="vbtn-'+gridid+'" '+
							'data-tname="'+v+'">查看字段</a>';
					var cratebtn = '<a class="grida" href="javascript:;" name="cratebtn-'+gridid+'" '+
							'data-tname="'+v+'" data-tcomment="'+item.Comment+'">创建数据集</a>';
					var btns = [cratebtn,viewbtn];
					return btns.join("&nbsp;&nbsp;");
				}}
      		])
        });
		grid.create();
		jQuery('#'+gridid+'-tab').css({background:'none'});
		store.on('load',function(res){
			// 帮助信息
			mwt.popinit();
			// 创建数据集
			jQuery('[name="cratebtn-'+gridid+'"]').unbind('click').click(function(){
				var params = {
					dbid: dbid,
					ttype: 1,
					tname: jQuery(this).data('tname'),
					tcomment: jQuery(this).data('tcomment')
				};
				ajax.post('t_datacube_table&action=create_table',params,function(res){
					if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
					else { 
						mwt.notify("创建成功",1500,'success');
						window.location = '#/db/dataset';
					}
				});
			});
			// 查看字段
			jQuery('[name="vbtn-'+gridid+'"]').unbind('click').click(function(){
				var params = {dbid:dbid,tname:jQuery(this).data('tname')};
				require('./table_dialog').open(params);
			});
		});
		//o.query();
	};

	o.query=function() {
		store.baseParams = {
			dbid: dbid,
			//day: get_value('dt-'+gridid),
			//status: get_select_value('status-'+gridid),
            key: get_value("so-key-"+gridid)
        };
        grid.load();
	};

	o.query_db_table=function(db) {
		dbid = db.dbid;
		jQuery('#db-'+gridid).html('<span style="color:gray;">数据源：</span>'+db.dbdesc+' ('+db.dbname+')');
		o.query();
	};

    return o;
});
