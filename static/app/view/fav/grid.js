define(function(require){
	var store,grid,gridid;

    var o = {};
	o.init = function(_gridid) {
		gridid = _gridid;
		var typeopt = [
			{value:-1, text:'不限'},
			{value:1, text:'Cube'},
			{value:2, text:'分析看板'},
			{value:3, text:'报告'}
		];

		function getUrl(item){
            var url;
            switch(item.type){
                case '1':
                    url = '#/mart/cube~cubeid='+item.oid;
                    break;
                case '2':
                    url = '#/opus/dashboard~b='+item.oid;
                    break;
                case '3':
                    url = '#/report~r='+item.oid;
                    break;
                default:
                    url = '';
            }
            return url;
		}

		// create grid
		var bar = [
            {label:"收藏类型",id:"fav-type",type:'select',value:'-1',options:typeopt,handler:o.query},
            {type:'search',id:'so-key-'+gridid,width:300,placeholder:'查询名称',handler:o.query}
        ];
		store = new MWT.Store({
			url: ajax.getAjaxUrl('fav&action=query'),
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
                {head:"名称",dataIndex:"title",align:'left', width: 800, sort:true,render:function(v,item){
                    var icon = '<i class="fa fa-cube gridi"></i>';
                    if(item.type === '3'){
                    	icon = '<i class="sicon-book-open gridi"></i>';
					}
					if(item.type == '2'){
						icon = '<i class="fa fa-desktop gridi"></i>';
					}
                    var url = getUrl(item);
                    return '<a href="'+url+'" target="_blank" class="grida" style="color:#000;">'+icon+' '+v+'</a>';
                }},
                {head:'作者',dataIndex:'authorname',align:'left',width:100,sort:true,render:function(v,item){
                	return v;
                }},
                {head:"类型",dataIndex:'type',align:'left', width: 100, sort:true,render:function(v,item){
                	var type;
                	switch (item.type){
						case '1': type = 'Cube'; break;
						case '2': type = '分析看板'; break;
						case '3': type = '报告'; break;
						default : type = '未知类型'; break;
					}
                	return '<span>'+type+'</span>';
                }},
                {head:'收藏时间',dataIndex:'ctime',align:'center',width:150,sort:true,render:function(v,item){
                    var tm = strtotime(v);
                    return '<span style="color:gray;font-size:12px;">'+date('Y-m-d H:i',tm)+'</span>';
                }},
				{head:"操作", dataIndex:"favid",width:150,align:'right', render:function(v,item){
					url = getUrl(item);
					var viewbtn = '<a class="grida" href="'+url+'" target="_blank">查看</a>';
					var delbtn ='<a class="grida" href="javascript:;" name="delbtn-'+gridid+'" data-id="'+v+'">取消收藏</a>';
					var btns = [viewbtn,delbtn];
					return btns.join("&nbsp;&nbsp;");
				}}
      		])
        });
		grid.create();
		store.on('load',function(res){
			// 帮助信息
			mwt.popinit();
			// 取消收藏
			jQuery('[name="delbtn-'+gridid+'"]').unbind('click').click(function(){
				var id=jQuery(this).data('id');
				mwt.confirm('确定要取消收藏吗？',function(res){
					if (!res) return;
					ajax.post('fav&action=remove',{id:id},function(res){
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
            key: get_value("so-key-"+gridid),
            type: get_value("fav-type")
        };
        grid.load();
	};

    return o;
});
