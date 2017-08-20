/* 维度定义 */
define(function(require){
	var dim_dialog = require('./dim_dialog');
	var store,grid;
	var domid,cubeInfo;

	var o={};
	o.init = function(_domid,_cubeInfo) {
		domid = _domid;
		cubeInfo = _cubeInfo;
		store = new MWT.Store({
            url: ajax.getAjaxUrl("t_datacube_cube_dims&action=query&cubeid="+cubeInfo.cubeid)
        });
		grid = new MWT.Grid({
            render   : domid,
            store    : store,
            pagebar  : false,
            bordered : false,
            cm: new MWT.Grid.ColumnModel([
              {head:"显示顺序", dataIndex:"displayorder", width:80, render:function(v,item){
				  var code = '<input type="number" style="text-align:center;" class="form-control" '+
                             'name="filter_dorder_txt" value="'+v+'" data-value="'+v+'" data-id="'+item.dimid+'">';
				  return code;
			  }},
              {head:"列名", dataIndex:"dimkey", align:'left', width:120},
              {head:"维度名称", dataIndex:"dimname", align:'left', width:120},
			  {head:"维度说明", dataIndex:"dimdesc", align:'left'},
              {head:"维度表", dataIndex:"dimtable", align:'left', width:180, render:function(v){
				  var icon = '<i class="sicon-hourglass gridi"></i> ';
				  switch(v) {
				      case 'date': return icon+'日期维度';
				  }
                  return icon+v;
              }},
              /*{head:"可分组"+help.get("分组维度将被用于GROUP BY子句"),
			   dataIndex:"is_group", align:'left', width:150, render:function(v){
				  switch (parseInt(v)) {
					  case 0: return '不可分组';
					  case 1: return '可选分组';
					  case 2: return '强制分组';
				  }
                  return v;
              }},*/
              {head:"启用", dataIndex:"isdel", width:80, align:'center', render:function(v,item){
				  var checked = v==0 ? 'checked' : '';
		          var code = '<label class="mwt-cbx-switch-plain" style="width:40px;height:18px;">'+
			          '<input name="filter_disable_switch" data-id="'+item.dimid+'" type="checkbox" '+checked+'>'+
                      '<span><i></i></span></label>';
				  return code;
              }},
              {head:"操作", dataIndex:"dimid", width:100, align:'right', render:function(v,item){
				  var editbtn = '<a class="grida" href="javascript:;" name="editbtn-'+domid+'" data-id="'+v+'">编辑</a>';
				  var delbtn = '<a class="grida" href="javascript:;" name="delbtn-'+domid+'" data-id="'+v+'">删除</a>';
				  var btns = [editbtn,delbtn];
				  return btns.join("&nbsp;&nbsp;");
              }}
            ]),
			tbarStyle: 'background:#ECF5F7;color:#016A77;border:none;',
            tbar: [
			  {html:'<label><i class="sicon-hourglass"></i> <b>维度</b></label>'},
			  '->',
              {label:btn.sync("同步维度"),class:'mwt-btn mwt-btn-primary',handler:sync_from_dataset}
            ]
        });
        grid.create();
		help.init();
		store.on('load',function(){
			// 设置显示顺序
			jQuery('[name=filter_dorder_txt]').unbind('change').change(function(){
				var jts = jQuery(this);
				var id = jts.data('id');
				var nv = parseInt(jts.val());
				var ov = jts.data('value');
				if (nv!=ov) {
					ajax.post('t_datacube_cube_dims&action=set_displayorder',{id:id,value:nv},function(res){
						if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
						else mwt.notify('已保存',1500,'success');
					});
				}
			});
			// 启用开关
			jQuery("[name=filter_disable_switch]").unbind('change').change(function(){
				var id = jQuery(this).data('id');
				var ckd = jQuery(this).is(':checked');
				var v = ckd ? 0 : 1;
				ajax.post("t_datacube_cube_dims&action=set_enable",{id:id,value:v},function(res){
					if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
					else mwt.notify('已保存',1500,'success');
				});
			});
			// 编辑
			jQuery("[name=editbtn-"+domid+"]").unbind('click').click(function(){
				var dimid = jQuery(this).data('id');
				var item = grid.getRecord('dimid',dimid);
				dim_dialog.open(item);
			});
			// 删除
			jQuery("[name=delbtn-"+domid+"]").unbind('click').click(function(){
				var dimid = jQuery(this).data('id');
				mwt.confirm('确定要删除此维度吗？',function(res){
					if (!res) {return;}
					ajax.post("t_datacube_cube_dims&action=remove",{dimid:dimid},function(res){
						if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
						else o.query();
					});
				});
			});
		});
		o.query();
	};
	o.query = function() {
		store.baseParams = {
		};
        grid.load();
	}
	o.getRecord = function(id) {
		return grid.getRecord('fid',id);
	};

	// 从数据集同步维度列表
	function sync_from_dataset()
	{/*{{{*/
		var cubeid = cubeInfo.cubeid;
		ajax.post('t_datacube_cube_dims&action=sync_from_dataset',{cubeid:cubeid},function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				mwt.notify('同步完成',1500,'success');
				o.query();
			}
		});
	}/*}}}*/

	return o;
});
