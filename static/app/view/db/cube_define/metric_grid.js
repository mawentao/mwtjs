/* 指标定义 */
define(function(require){
	var metric_dialog = require('./metric_dialog');
	var store,grid;
	var domid,cubeInfo;

	var o={};
	o.init = function(_domid,_cubeInfo) {
		domid = _domid;
		cubeInfo = _cubeInfo;
		store = new MWT.Store({
            url: ajax.getAjaxUrl("t_datacube_cube_metrics&action=query&cubeid="+cubeInfo.cubeid)
        });
		grid = new MWT.Grid({
            render  : domid,
            store   : store,
            pagebar : false, //!< false 表示不分页
            bordered: false,
            cm: new MWT.Grid.ColumnModel([
              {head:"显示顺序", dataIndex:"displayorder", width:80, render:function(v,item){
				  var code = '<input type="number" style="text-align:center;" class="form-control" '+
				  		'name="metric_dorder_txt" value="'+v+'" data-value="'+v+'" data-mid="'+item.mid+'">';
				  return code;
			  }},
              {head:"字段名"+help.get('不强求与物理表中的字段名一致'), dataIndex:"mkey", width:120, align:'left'},
              {head:"指标显示名称", dataIndex:"mname", width:120, align:'left'},
			  {head:"指标说明"+help.get('通常为指标的计算公式'), dataIndex:"mdesc", width:200, align:'left'},
			  {head:"格式化显示", dataIndex:"mformat", width:120, align:'left', render:function(v){
				  switch (parseInt(v)) {
				      case 1: 
				      case 2:
				      case 3:
				      case 4:
				      case 5: return "保留"+v+"位小数"; break;
					  case 100: return "百分比"; break;
					  default: return "整数"; break;
				  };
			  }},
              {head:"指标计算表达式", dataIndex:"mexpression", align:'left', render:function(v){
                  return '<div style="word-break:break-all;">'+v+'</div>';
              }},
			  {head:"启用", dataIndex:"isdel", width:80, align:'center', render:function(v,item){
				  var checked = v==0 ? 'checked' : '';
		          var code = '<label class="mwt-cbx-switch-plain" style="width:40px;height:18px;">'+
			          '<input name="metric_disable_switch" data-id="'+item.mid+'" type="checkbox" '+checked+'>'+
                      '<span><i></i></span></label>';
				  return code;
              }},
              {head:"操作", dataIndex:"mid", width:100, align:'right', render:function(v,item){
				  var editbtn = '<a class="grida" href="javascript:;" name="editbtn-'+domid+'" data-id="'+v+'">编辑</a>';
				  var delbtn = '<a class="grida" href="javascript:;" name="delbtn-'+domid+'" data-id="'+v+'">删除</a>';
				  var btns = [editbtn,delbtn];
				  return btns.join("&nbsp;&nbsp;");
              }}
            ]),
			tbarStyle: 'background:#ECF5F7;color:#016A77;border:none;',
            tbar: [
			  {html:'<label><i class="sicon-bar-chart"></i> <b>指标</b></label>'},
              '->',
              {label:btn.plus("添加指标"),class:'mwt-btn mwt-btn-success',handler:function(){
				  var item = {mid:0,cubeid:cubeInfo.cubeid};
				  metric_dialog.open(item);
			  }},
              {label:btn.sync("同步指标"),class:'mwt-btn mwt-btn-primary',handler:sync_from_dataset}
            ]
        });
        grid.create();
		store.on('load',function(){
			// 设置显示顺序
			jQuery('[name=metric_dorder_txt]').unbind('change').change(function(){
				var jts = jQuery(this);
				var mid = jts.data('mid');
				var nv = parseInt(jts.val());
				var ov = jts.data('value');
				if (nv!=ov) {
					ajax.post('t_datacube_cube_metrics&action=set_displayorder',{mid:mid,value:nv},function(res){
						if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
						else mwt.notify('已保存',1500,'success');
					});
				}
			});
			// 启用开关
			jQuery("[name=metric_disable_switch]").unbind('change').change(function(){
				var mid = jQuery(this).data('id');
				var ckd = jQuery(this).is(':checked');
				var v = ckd ? 0 : 1;
				ajax.post("t_datacube_cube_metrics&action=set_enable",{mid:mid,value:v},function(res){
					if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
					else mwt.notify('已保存',1500,'success');
				});
			});
			// 编辑
			jQuery("[name=editbtn-"+domid+"]").unbind('click').click(function(){
				var mid = jQuery(this).data('id');
				var item = grid.getRecord('mid',mid);
				metric_dialog.open(item);
			});
			// 删除
			jQuery("[name=delbtn-"+domid+"]").unbind('click').click(function(){
				var mid = jQuery(this).data('id');
				mwt.confirm('确定要删除此指标吗？',function(res){
					if (!res) {return;}
					ajax.post("t_datacube_cube_metrics&action=remove",{mid:mid},function(res){
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
	};

	o.getRecord = function(mid) {
		return grid.getRecord("mid", mid);
	};

	o.remove = function(ids) {
		if (!ids) {
			var records = grid.getSelectedRecords();
			if (records.length>0) {
				ids = '';
				var sp = '';
				for (var i=0; i<records.length; ++i) {
					ids += sp+records[i].mid;
					sp = ',';
				}
			}
		}
		if (!ids || ids=='') {
			MWT.flash_danger("未选择记录");
			return;
		}
		MWT.confirm("确定删除吗?",function(res){
			if (res) {
				ajax.post('schema_report&action=remove_metrics',{ids:ids},function(res){
					o.query();
				});
			}
		});
	};

	
	// 从数据集同步维度列表
	function sync_from_dataset()
	{/*{{{*/
		var cubeid = cubeInfo.cubeid;
		ajax.post('t_datacube_cube_metrics&action=sync_from_dataset',{cubeid:cubeid},function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				mwt.notify('同步完成',1500,'success');
				o.query();
			}
		});
	}/*}}}*/

	return o;
});
