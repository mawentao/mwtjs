/* mwt-h5page.js, (c) 2016 mawentao */
MWT.H5Page = function(opt)
{
    this.listeners = {};
	var render = "";
    var header = "";
    var footer = "";
    var pagebody = "";
    var bodyStyle=null;
    var animate = "";

    if (opt) {
        render = opt.render;
        if (opt.header) header=opt.header;
        if (opt.footer) footer=opt.footer;
        if (opt.pagebody) pagebody=opt.pagebody;
        if (opt.bodyStyle) bodyStyle=opt.bodyStyle;
        if (opt.animate) animate=opt.animate;
    }

    // 创建
    this.create=function(){
        var code = "";

        // header
        var bodytop = 0;
        if (header) {
            code+=header.get(render+"head");
            bodytop=header.getHeight();
        }

        // body
        var style = 'top:'+bodytop+"px;";
        if (bodyStyle) style+=bodyStyle;
        code += "<div class='mwt-h5page-body' style='"+style+"'>"+pagebody+"</div>";
        
        // footer
        if (footer) code+=footer.get(render+"foot");

        // animate
        var $html = jQuery(code).addClass(animate);
        jQuery("#"+render).html($html);

        // bind
        if (header) header.bind();
        if (footer) footer.bind();
    };

    // header
    this.getHeader = function(){ return header; }
    // footer
    this.getFooter = function(){ return footer; }
};

MWT.extends(MWT.H5Page, MWT.Event);
