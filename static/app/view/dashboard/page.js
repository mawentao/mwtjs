define(function(require){
    var o = {};
	o.execute = function(domid,board) {
		var adminbtn = '';
		if (dz.uid==board.uid) {
			adminbtn = '<a style="margin-left:16px;" class="adminbtn" href="#/design~b='+board.board_id+'">[编辑]</a>';
		}

		var code = '<div class="dashboard-title">'+
				'<i class="sicon sicon-screen-desktop"></i>'+board.board_title+adminbtn+
            	'<span id="fav"></span>'+
				'<span class="dashboard-author">作者：'+board.username+'<img src="'+avatar(board.uid)+'"/></span>'+
            	'<span class="dashboard-view"><i class="icon icon-preview"></i>'+board.views+'</span>'+
			'</div>'+
            '<div class="fill" style="top:50px;overflow:auto;background:url('+dz.watermask_url+');">'+
			  '<div id="canvas-'+domid+'" class="dashboard-canvas"></div>'+
            '</div>';
		jQuery('#'+domid).html(code);
        require('view/fav/page').button('fav', 2, board.board_id, 'link');
        require('view/dashboard/pv').execute(board);

		var ds = new DesignCanvas({
			render: 'canvas-'+domid,
			boxRenderFun: require('view/cube').showInBox
		});
		ds.init();
		var boxes = board.options;/*[
			{x:0,y:0,w:4,h:3},
			{x:4,y:0,w:4,h:3},
			{x:0,y:3,w:7,h:4},
		];*/
		ds.show_boxes(boxes);
	};
    return o;
});
