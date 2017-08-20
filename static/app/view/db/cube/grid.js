define(function(require){
	var dialog=require('./dialog');
	var store,grid,gridid;

    var o = {};
	o.init = function(_gridid) {
		gridid = _gridid;
		// create grid
		var cvidopts = dict.get_cube_view_options({text:'全部',value:0});
		var subjectopts = dict.get_wordlist_options('cube_subject',{text:'全部',value:0});
		var statopts = [
			{text:'全部',value:0},
			{text:'上架',value:2},
			{text:'下架',value:1}
		];
		var bar = [
			{type:"select",id:"subject-"+gridid,value:0,label:'主题',options:subjectopts,handler:o.query},
			{type:"select",id:"status-"+gridid,value:0,label:'上架状态',options:statopts,handler:o.query},
            {type:'search',id:'so-key-'+gridid,width:300,placeholder:'查询cube',handler:o.query},
			'->',
			{label:btn.plus("创建Cube"),handler:function(){
				dialog.open();
			}}
        ];
		store = new MWT.Store({
			url: ajax.getAjaxUrl('t_datacube_cube&action=query_mine'),
			beforeLoad: store_before_load,
			afterLoad: store_after_load
  		});
		var subjectMap = dict.get_wordmap('cube_subject');
		var cubeviewMap = dict.get_cube_view_map();
		grid = new MWT.Grid({
			render: gridid,
			store: store,
			pagebar: true,
			pageSize: 20,
			bordered: false,
			position: 'fixed',
			multiSelect:false, 
			tbar: bar,
			striped: true,
			tbarStyle: 'margin-bottom:-1px;border:none;background:#fff;',
			bodyStyle: 'top:75px;bottom:37px;background:#fff;',
			cm: new MWT.Grid.ColumnModel([
				{head:"",dataIndex:"dbid",width:1,render:function(v){return '';}},
				{head:"Cube名称",dataIndex:"cubename",align:'left',width:200,sort:true,render:function(v,item){
					var icon = '<i class="fa fa-cube gridi"></i>';
					return '<a href="#/mart/cube~cubeid='+item.cubeid+'" target="_blank" class="grida" style="color:#000;">'+
							icon+' <span style="font-size:12px;">'+v+'</span></a>';
				}},
				{head:'Cube描述',dataIndex:'cubedesc',align:'left',render:function(v,item){
					return '<span style="font-size:12px;color:gray;">'+v+'</span>';
				}},
				{head:"主题",dataIndex:"subject",align:'left',width:80,render:function(v,item){
					return subjectMap[v];
				}},
				{head:'数据集',dataIndex:'tcomment',align:'left',width:180,sort:true,render:function(v,item){
					return '<span style="font-size:12px;">'+v+'</span>';
				}},
				{head:'所有者',dataIndex:'username',align:'center',width:100,sort:true,
				 render:function(v,item){
					return v;
				}},
				{head:'上架状态',dataIndex:'state',align:'center',width:100,sort:true,render:function(v,item){
				    var checked = v==2 ? 'checked' : '';
		            var code = '<label class="mwt-cbx-switch-plain" style="width:40px;height:18px;">'+
			          '<input name="cube_state_switch-'+gridid+'" data-id="'+item.cubeid+'" type="checkbox" '+checked+'>'+
                      '<span><i></i></span>'+
					'</label>';
				    return code;
				}},
				{head:"操作", dataIndex:"cubeid",width:130,align:'right', render:function(v,item){
					var viewbtn = '<a class="grida" href="#/mart/cube~cubeid='+v+'" target="_blank">查看</a>';
					var defbtn = '<a class="grida" href="#/db/cube_define~cubeid='+v+'">配置</a>';
					//var copybtn = '<a class="grida" href="javascript:;" name="copybtn-'+gridid+'" data-id="'+v+'">复制</a>';
					var delbtn ='<a class="grida" href="javascript:;" name="delbtn-'+gridid+'" data-id="'+v+'">删除</button>';
					var btns = [viewbtn];
					if (item.uid==dz.uid) {
						btns.push(defbtn);
						//btns.push(copybtn);
						btns.push(delbtn);
					}
					return btns.join("&nbsp;&nbsp;");
				}}
      		])
        });
		grid.create();
		store.on('load',function(res){
			// 帮助信息
			mwt.popinit();
			// 上架开关
			jQuery('[name="cube_state_switch-'+gridid+'"]').unbind('change').change(function(){
				var cubeid = jQuery(this).data('id');
				var ckd = jQuery(this).is(':checked');
				var v = ckd ? 2 : 1;
				ajax.post("t_datacube_cube&action=set_state",{cubeid:cubeid,state:v},function(res){
					if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
					else mwt.notify('已保存',1500,'success');
				});
			});
			// 复制
			jQuery('[name="copybtn-'+gridid+'"]').unbind('click').click(function(){
				var id=jQuery(this).data('id');
				ajax.post('t_datacube_cube&action=copy_cube',{cubeid:id},function(res){
					if (res.retcode!=0) { mwt.notify(res.retmsg,1500,'danger'); }
					else { store.load();}
				});
			});
			// 删除
			jQuery('[name="delbtn-'+gridid+'"]').unbind('click').click(function(){
				var id=jQuery(this).data('id');
				mwt.confirm('确定要删除吗？',function(res){
					if (!res) return;
					ajax.post('t_datacube_cube&action=remove',{cubeid:id},function(res){
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
			subject: get_select_value('subject-'+gridid),
			state: get_select_value('status-'+gridid),
            key: get_value("so-key-"+gridid)
        };
        grid.load();
	};

    return o;
});
