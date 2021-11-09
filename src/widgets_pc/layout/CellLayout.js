/**
 * 格子布局
 **/
MWT.CellLayout=function(opt)
{
    this.listeners={};
    var items=[];
    var rowCells=3;		//一行个数
	var cellHeight=100;	//格子高度
	var cellSpacing=0;	//格子间隔
    if(opt){
        this.construct(opt);
        if(opt.items)items=opt.items;
        if(opt.rowCells)rowCells=opt.rowCells;
		if(opt.cellHeight)cellHeight=opt.cellHeight;
		if(opt.cellSpacing)cellSpacing=opt.cellSpacing;
    }

    this.init=function()
    {
		if (!items || items.length<=0) return;
		var n = items.length;
		var trs = [];
		var code = '<table class="mwt-cell-tab" style="border-spacing:'+cellSpacing+'px;"><tr>';
		var w = 100/rowCells;
		for (var i=0;i<n;++i) {
            var item = items[i];
			var cellId = item.id ? item.id : this.render+'-cell-'+i;
            if (i>0 && i%rowCells==0) { code += '</tr><tr>'; }
			var style = 'height:'+cellHeight+'px';
			if (item.style) style += ';'+item.style;
            code += '<td width="'+w+'%"><div id="'+cellId+'" class="mwt-cell" style="'+style+'">'+(item.html?item.html:'')+'</div></td>';
        }
		code+='</tr></table>';
		jQuery('#'+this.render).html(code);
    };
};
MWT.extends(MWT.CellLayout,MWT.Layout);
