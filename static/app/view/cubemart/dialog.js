/* dialog.js, (c) 2017 mawentao */
define(function(require){
	var item,dialog;

	function init_dialog() {
		dialog = new MWT.Dialog({
            title  : 'Cube',
			fullscreen : true,
            height : "99%",
            bodyStyle: 'padding:10px;',
			animate : 'zoomIn',
            body : '<div class="fill" style="top:42px;" id="cube-info-dia">ss</div>'
        });
		dialog.on('open',function(){
			//console.log(item);
			dialog.setTitle(item.cubename);
			require('view/cube').showInBox('cube-info-dia',item.cubeid);
		});
	}

	var o={};

	o.open=function(_item){
		item = _item;
		if (!dialog) {
			init_dialog();
		}
		dialog.open();
	};

	return o;
});
