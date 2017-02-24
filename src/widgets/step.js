/* 步骤流程组件 */
MWT.StepWidget=function(opt)
{
    this.listeners={};
	var thiso = this;
	var cls='default';
/*
    var justify=false;
    var border=false;
    var headerStyle='';
*/
	var panels=[];
	var activeIndex=-1;
    if (opt) {
        this.construct(opt);
        if(opt.panels) panels=opt.panels;
		if(opt.cls) cls=opt.cls;
/*
        if(opt.justify) justify=true;
        if(opt.border) border=true;
        if(opt.headerStyle) headerStyle=opt.headerStyle;
*/
    }
    this.create = function() {
		var pagenum = panels.length;
		if (!pagenum) return this;
		var tdwidth = 100/pagenum;
		var tds = [];
		var pas = [];
		var tbname = this.render+'-head-';
		var paname = this.render+'-panel-';
		for (var i=0;i<pagenum;++i) {
			var panel = panels[i];
			// StepBar
			var tabheadid = tbname+i;
			var code = '<td width="'+tdwidth+'%">'+
				'<button name="'+tbname+'" data-index="'+i+'" id="'+tbname+i+'" class="mwt-btn mwt-btn-sm round">'+panel.title+'</button></td>';
			tds.push(code);
			// StepPanel
			code = '<div id="'+paname+i+'" class="step-panel">'+panel.html+'</div>';
			pas.push(code);
		}
		var code = '<table class="step-tb '+cls+'"><tr>'+tds.join('')+'</tr></table>'+
				   pas.join('');
		jQuery('#'+this.render).html(code);
		// 节点点击事件
		jQuery('[name="'+tbname+'"]').unbind('click').click(function(){
			var idx = jQuery(this).data('index');
			thiso.active(idx);
		});
		// 创建后事件通知
		this.fire('create');
		return this;
    };

    // 选择tab
    this.active = function(idx) {
        if (activeIndex==idx) return;
		if (idx<0 || idx>=panels.length) return;
		var panel = panels[idx];
		if (panel.beforeShow) panel.beforeShow(activeIndex);
		if (panel.showfun) panel.showfun();
		activeIndex=idx;
		for (var i=0;i<panels.length;++i) {
			var panel = panels[i];
			var tabheadid = this.render+'-head-'+i;
			var tabpanelid = this.render+'-panel-'+i;
			if (idx==i) {
				jQuery('#'+tabheadid).addClass('active');
				jQuery('#'+tabpanelid).addClass('active');
			} else {
				jQuery('#'+tabheadid).removeClass('active');
				jQuery('#'+tabpanelid).removeClass('active');
			}
		}
    };
};
MWT.extends(MWT.StepWidget,MWT.Widget);
