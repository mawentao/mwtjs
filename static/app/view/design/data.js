/* board数据结构 */
define(function(require){
	var data={};



	var o={};
	o.set=function(d) {
		data = d;
		o.setTitle(d.board_title);
	};
	o.get=function() {
		return data;
	};

	o.getTitle=function(){return data.board_title;}
	o.setTitle=function(title) {
		data.board_title = title;
		jQuery('#design-board-title').html('设计器 - '+title);
	};


	return o;
});
