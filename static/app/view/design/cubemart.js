/* cube集市-cube选择对话框 */
define(function(require){
	var dialog,cubemart_inited=false,callfun;

	function init() {
		dialog = new MWT.Dialog({
			title   : '选择DataCube',
			width   : 800,
			height  : 600,
			top     : 20,
			animate : 'zoomIn',
			bodyStyle: 'position:relative;background:#fff;',
			body    : '<div id="design-cubemart-dialog-div" class="fill-layout"></div>'
		});
		dialog.create();
		mwt.popinit();
		// 打开窗口事件
		dialog.on('open',function(){
			//set_status(-1);
			if (!cubemart_inited) {
				require('../cubemart/page').execute('design-cubemart-dialog-div',choose);
				cubemart_inited=true;
			}
		});
	}

	// 选择cube
	function choose(item) {
		if (callfun) callfun(item);
		dialog.close();
	}

	var o={};
	o.open=function(_callfun) {
		callfun=_callfun;
		if (!dialog) init();
		dialog.open();
	};
	return o;
});
