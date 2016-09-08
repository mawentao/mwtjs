/* 导航 */
MWT.Nav=function(opt)
{
    this.listeners={};
    this.render=null;
    this.items=[];
    this.cls='';
    this.style='';
    if (opt) {
        if (opt.render)this.render=opt.render;
        if (opt.items)this.items=opt.items;
        if (opt.cls)this.cls=opt.cls;
        if (opt.style)this.style=opt.style;
    }

    // 创建
    this.create=function(){
        var ulid = this.render+"-ul";
        var code = '<ul id="'+ulid+'" class="mwt-nav '+this.cls+'">';
        for(var i=0;i<this.items.length;++i){
            var im=this.items[i];
            var href=im.href ? im.href : "javascript:void(0);";
            var target = im.target ? 'target="'+im.target+'"' : '';
            code += '<li><a href="'+href+'" data-idx="'+i+'" '+target+' style="'+this.style+'">'+im.title+'</a></li>';
        }
        code += '</ul>';
        jQuery("#"+this.render).html(code);

        var thiso=this;
        jQuery("#"+ulid).children("li").children("a").click(function(){
            var idx = jQuery(this).data("idx");
            var im = thiso.items[idx];
            //print_r(im);
            if (im.target!='_blank') {
			    jQuery("#"+ulid).children("li").removeClass('mwt-active');
			    jQuery(this).parent().addClass('mwt-active');
                if (im.handler) {
                    im.handler();
                }
            }
        });
    };

    this.active=function(idx) {
        var ulid = this.render+"-ul";
        jQuery("#"+ulid).children("li").removeClass('mwt-active');
        jQuery("#"+ulid).children("li:eq("+idx+")").addClass('mwt-active');
    };
};
MWT.extends(MWT.Bar, MWT.Event);
