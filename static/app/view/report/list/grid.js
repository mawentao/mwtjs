define(function(require){
	var store,grid,gridid;

    var o = {};
	o.init = function(_gridid) {
		gridid = _gridid;
		// create grid
		var bar = [
            {type:'search',id:'so-key-'+gridid,width:300,placeholder:'查询数据报告名称',handler:o.query},
			'->',
			{label:btn.plus("创建数据报告"),id:'create_report_button',handler:o.create}
        ];
		store = new MWT.Store({
			url: ajax.getAjaxUrl('t_datacube_report&action=query'),
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
				{head:"数据报告名称",dataIndex:"name",align:'left',sort:true,render:function(v,item){
					var icon = '<i class="fa fa-desktop gridi"></i>';
					return '<a href="#/report~r='+item.id+'&ispreview=1" target="_blank" class="grida" style="color:#000;">'+icon+' '+v+'</a>';
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
                {head:'发布状态',dataIndex:'state',align:'center',width:100,sort:true,render:function(v,item){
                    var checked = v==2 ? 'checked' : '';
                    var code = '<label class="mwt-cbx-switch-plain" style="width:40px;height:18px;">'+
                        '<input name="report_state_switch-'+gridid+'" data-id="'+item.id+'" type="checkbox" '+checked+'>'+
                        '<span><i></i></span>'+
                        '</label>';
                    return code;
                }},
				{head:"操作", dataIndex:"id",width:130,align:'right', render:function(v,item){
                    var btns = [];

                    var url = "#/report~r="+v;
                    var editbtn = '<a class="grida" href="' + url + '">编辑</a>';
                    if(item.isnew == 1) {
                        btns.push(editbtn);
                    }

					url = "#/report~r="+v+"&ispreview=1";
					var viewbtn = '<a class="grida" href="'+url+'" target="_blank">查看</a>';
					btns.push(viewbtn);

					var delbtn ='<a class="grida" href="javascript:;" name="delbtn-'+gridid+'" data-id="'+v+'">删除</a>';
                    btns.push(delbtn);
					if (item.uid!=dz.uid){btns=[viewbtn];}
					return btns.join("&nbsp;&nbsp;");
				}}
      		])
        });
		grid.create();
		store.on('load',function(res){
			// 帮助信息
			mwt.popinit();
            // 发布开关
            jQuery('[name="report_state_switch-'+gridid+'"]').unbind('change').change(function(){
                var rid = jQuery(this).data('id');
                var ckd = jQuery(this).is(':checked');
                var v = ckd ? 2 : 1;
                ajax.post("t_datacube_report&action=publish",{rid:rid,state:v},function(res){
                    if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
                    else mwt.notify('已保存',1500,'success');
                });
            });
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
					ajax.post('t_datacube_report&action=remove',{rid:id},function(res){
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

	o.create=function() {
        var msgid=mwt.notify('数据报告创建中...');
        jQuery('#create_report_button').attr('disabled', true);
		ajax.post('t_datacube_report&action=create',{},function(res){
            mwt.notify_destroy(msgid);
            jQuery('#create_report_button').removeAttr('disabled');
			if (res.retcode!=0){
				mwt.notify(res.retmsg,1500,'danger');
			}
			else{
				if(res.data.report_id){
					window.location = "#/report~r="+res.data.report_id;
				}else{
                    mwt.notify("创建失败",1500,'danger');
				}
			}
		});
	};

    return o;
});
