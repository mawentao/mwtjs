define(function(require){
	/* 顶部面板 */
	var canvas=require('./canvas_panel');
	var data = require('./data');
	var previewurl='';
	var o = {};

	o.init = function(domid,board) {
		previewurl = '#/opus/dashboard~b='+board.board_id;
		var tbar = new MWT.Bar({
			render : domid,
			style  : "background:none;border:none;",
			items  : [
				{html:'<span id="design-board-title" style="white-space:nowrap;font-size:13px;color:#3583A9;"></span>'},
                '->',
				{label:'<i class="fa fa-plus-square-o"> 插入',class:'mwt-btn mwt-btn-default',handler:insert},
				{label:'<i class="fa fa-save"> 保存',class:'mwt-btn mwt-btn-default',handler:save},
				{label:'<i class="fa fa-toggle-right"> 预览',class:'mwt-btn mwt-btn-default',handler:preview}
			]
		});
		tbar.create();
	};

	// 插入cube
	function insert() {
		require('./cubemart').open(function(res){
			canvas.insert_box(res);
		});
	}

	// 保存
	function save() {
		var params = data.get();
		params.options = canvas.get_cubes();
		ajax.post('t_datacube_board&action=save',params,function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				mwt.notify('已保存',1500,'success');
			}
		});
	}

	// 预览
	function preview() { 
		var params = data.get();
		params.options = canvas.get_cubes();
		ajax.post('t_datacube_board&action=save',params,function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				//window.open(previewurl); 
				window.location = previewurl;
			}
		});
	}

	return o;
});
