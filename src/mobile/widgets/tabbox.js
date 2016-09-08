/* 九宫格组件 */
MWT.TabBox=function(opt)
{
    this.listeners={};
	var thiso = this;
	var border=false;
	var items=[];
	var rows = 3;
	var cols = 3;
	var cellStyle='';
	if (opt) {
        this.construct(opt);
		if (opt.items) items=opt.items;
		if (opt.size) {
			var arr = opt.size.split('x');
			rows = parseInt(arr[0]);
			cols = parseInt(arr[1]);
		}
		if (opt.border) border=true;
		if (opt.cellStyle) cellStyle=opt.cellStyle;
	}
	
	function getcell(idx) {
		var im = items[idx];
		var code = '<div name="'+thiso.render+'-cell" style="width:100%;" data-idx="'+idx+'">'+im.html+'</div>';
		return code;
	}

	this.create = function() {
		var code = "";
		var idx = -1;
		for (var i=0; i<rows; ++i) {
			code += '<div class="mwt-border-bottom mwt-flex">';
			for (var k=0; k<cols; ++k) {
				var bcls = (k==0 || !border) ? '' : 'mwt-border-left';
				code += '<div class="mwt-flex-cell '+bcls+'" style="'+cellStyle+'">';
				++idx;
				if (idx<items.length) {
					code += getcell(idx);
				}
				code += '</div>';
			}
			code += '</div>';
		}
		jQuery('#'+this.render).html(code);

		jQuery('[name='+this.render+'-cell]').click(function(){
			var idx = jQuery(this).data('idx');
			if (idx<items.length && items[idx].handler) {
				items[idx].handler(idx);
			}
		});
	};
};
MWT.extends(MWT.TabBox,MWT.Widget);
