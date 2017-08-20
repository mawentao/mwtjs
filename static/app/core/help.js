define(function(require){
return {
	get: function(msg,css) {
		var cls = css ? 'mwt-popover-'+css : 'mwt-popover-danger';
		return '<i class="sicon-question" pop-title="'+msg+'" pop-cls="'+cls+'" style="cursor:pointer;padding-left:3px;color:#888;"></i>';
	},
	// 初始化
	init: function() {
		mwt.popinit();
	}
};
});
