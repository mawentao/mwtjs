/* 设计器画布, (c) 2017 mawentao */
define(function(require){
	var cubic=require('./cubic');
	var ds,board; //!< 设计器


	// 点击box,显示Cube的配置
	function click_box(domid,cubeid,cubicid) {
		//alert(domid+' '+cubeid+' '+cubicid);
		require('./property_panel').load({cubeid:cubeid,cubicid:cubicid});
	}

	// 编辑box(从cube集市选择一个新的cube)
	function edit_box(domid,cubeid,cubicid) {
		//alert(domid+' '+cubeid+' '+cubicid);
		require('./cubemart').open(function(res){
			if (res.cubeid==cubeid) return;
			//require('view/cube').showInBox(domid,res.cubeid,cubicid); //!< 刷新cubic box
			var data = {
				cubicid: cubicid,
				cubeid: res.cubeid
			};
			ajax.post('design&action=edit_cubic',data,function(res){
				if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
				else {
					//require('view/cube').showInBox(domid,data.cubeid,cubicid); //!< 刷新cubic box
					window.location.reload();
				}
			});
		});
	};

	// 复制box 
	function copy_box(domid,cubeid,cubicid) {
		var data = {
			cubicid: cubicid
		};
		ajax.post('design&action=copy_cubic',data,function(res){
			if (res.retcode!=0)mwt.notify(res.retmsg,1500,'danger');
			else {
				ds.insert(res.data);
			}
		});
	}

	// 删除box
	function remove_box(domid,cubeid,cubicid) {
		ajax.post('t_datacube_board_cubic&action=remove_cubic',{cubicid:cubicid},function(res){
			if (res.retcode!=0) {
				mwt.notify(res.retmsg,1500,'danger');
			} else {
				mwt.notify('已删除',1500,'success');
			}
		});
	}

	var o={};

	o.init=function(_board){
		board=_board;
		ds = new DesignCanvas({
			render: 'design-body-canvas',
			mode: 1,
			boxRenderFun: cubic.showInBox,
			boxClickFun: click_box,
			boxRemoveFun: remove_box,
			boxEditFun: edit_box,
			boxCopyFun: copy_box
		});
		ds.init();
		cubic.init();
	};

	// 显示全部box
	o.show_boxes=function(boxes) {
		ds.show_boxes(boxes);
	};

	// 插入一个新的box
	o.insert_box=function(box) {
		var params = ds.getNewInsertPosition();   //!< 获取插入位置
		params['cubeid'] = box.cubeid;
		params['board_id'] = board.board_id;
		ajax.post('design&action=create_cubic',params,function(res){
			if (res.retcode!=0) mwt.alert(res.retmsg);
			else {
				params.cubicid = res.data;
				ds.insert(params);
			}
		});
	};

	// 获取所有cubic
	o.get_cubes=function(){
		var boxes = ds.get_boxes();
		return boxes;
	};

	return o;
});
