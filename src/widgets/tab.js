/* tab框架组件 */
MWT.TabPanel=function(opt)
{
    this.listeners={};
    this.title;
    this.body;
    if (opt) {
        if(opt.title) this.title=opt.title;
        if(opt.body) this.body=opt.body;
    }
};
MWT.extends(MWT.TabPanel,MWT.Event);

MWT.TabWidget=function(opt)
{
    this.listeners={};
	var thiso = this;
    var justify=false;
    var border=false;
    var headerStyle='';
	var panels=[];
	var activeIndex=-1;
    if (opt) {
        this.construct(opt);
        if(opt.panels) panels=opt.panels;
        if(opt.justify) justify=true;
        if(opt.border) border=true;
        if(opt.headerStyle) headerStyle=opt.headerStyle;
    }

    this.create = function() {
        var jsy = justify ? 'mwt-nav-justify' : '';
        var bd = border ? 'bordered' : '';
        var code = '<div class="mwt-tabpanel '+bd+'" style="'+this.style+'">'+
            '<div class="mwt-tabhead" style="'+headerStyle+'">'+
              '<ul class="mwt-nav mwt-nav-tabs '+jsy+'">';
        var bodycode = '';
        var nm = this.render+'-nm';
        for (var i=0;i<panels.length;++i) {
            var panel = panels[i];
            var tabheadid = this.render+'-tab-head-'+i;
            var style = i==0 ? 'style="padding-left:5px;"' : '';
            code += '<li id="'+tabheadid+'" '+style+'><a name="'+nm+'" data-idx="'+i+'" href="javascript:;">'+panel.title+'</a></li>';
            var tabbodyid = this.render+'-tab-body-'+i;
            bodycode += '<div id="'+tabbodyid+'" class="mwt-tabpanel-body">'+panel.body+'</div>';
        }
        code += '</ul></div>'+bodycode+'</div>';
        jQuery('#'+this.render).html(code);
		jQuery('[name='+nm+']').click(function(){
            var ix = jQuery(this).data('idx');
            thiso.active(ix);
		});
    };

    // 选择tab
    this.active = function(idx) {
        if (activeIndex==idx) return;
        activeIndex=idx;
        for (var i=0;i<panels.length;++i) {
            var panel = panels[i];
            var tabheadid = this.render+'-tab-head-'+i;
            var tabbodyid = this.render+'-tab-body-'+i;
            if (idx==i) {
                jQuery('#'+tabheadid).addClass('mwt-active');
                jQuery('#'+tabbodyid).show();
                panel.fire('show');
            } else {
                jQuery('#'+tabheadid).removeClass('mwt-active');
                jQuery('#'+tabbodyid).hide();
            }
        }
    };
};
MWT.extends(MWT.TabWidget,MWT.Widget);
