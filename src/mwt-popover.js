/* 弹出框 */
MWT.Popover=function(opt)
{
    this.listeners={};
    var anchor;
    var html='';
    var cls='';
    var domid;
    var mode=0;
    
    if(opt){
        if(opt.anchor)anchor=opt.anchor;
        if(opt.html) html=opt.html;
        if(opt.cls) cls=opt.cls;
    }

    function create() {
        domid=MWT.gen_domid(anchor+'-');
        MWT.create_div(domid);
        var dom=MWT.$(domid);
        dom.className = "mwt-popover top "+cls;
        dom.innerHTML='<div class="arrow"></div>'+
            '<div class="content">'+html+'</div>';
    };

    this.setHtml = function(c) {
        jQuery("#"+domid+" .content").html(c);
    };

    this.toggle = function() {
        if(mode==0) this.pop();
        else this.hide();
    };
    this.pop = function() {
        if (!domid) create();
        var jom=jQuery('#'+domid);
        jom.show();
        locate();
        mode^=1;
    };
    this.hide = function() {
        jQuery('#'+domid).fadeOut('fast');
        mode^=1;
    };

    function locate() {
        var andom = jQuery('#'+anchor);
        var anpos = andom.offset();
        var antop = anpos.top;
        var anleft = anpos.left;
        var anwidth = andom.outerWidth();
        var anheight = andom.outerHeight();

        var dom = jQuery('#'+domid);
        var width = dom.outerWidth();
        var height = dom.outerHeight()+11;

        var top= antop-height;
        var left= anleft+(0.5*(anwidth-width));

        //if (top<0) top=antop+anheight;
        
        dom.css({top:top,left:left});
    };
};
MWT.extends(MWT.Popover, MWT.Event);
