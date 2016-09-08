/* mwt-h5page.js, (c) 2016 mawentao */
MWT.H5Page = function(opt)
{
    this.listeners = {};
	var render;
    var header = "";
    var footer = "";
    var pagebody = "";
    var bodyStyle=null;
    var animate = "";     //!< 显示动画:slideLeft, slideRight, slideTop, slideBottom
	//var iscroll=false;

    if (opt) {
        if (opt.render) render = opt.render;
        if (opt.header) header=opt.header;
        if (opt.footer) footer=opt.footer;
        if (opt.pagebody) pagebody=opt.pagebody;
        if (opt.bodyStyle) bodyStyle=opt.bodyStyle;
        if (opt.animate) animate=opt.animate;
		//if (opt.iscroll) iscroll=true;
    }

    // 创建
    this.create=function(){
        if (!render) render=MWT.gen_domid('h5page-');
        MWT.create_div(render);
        var dom = MWT.$(render);
        dom.className = "mwt-h5page";
        //var code = '<div class="mwt-h5page">';

        // body
        var bodytop = header ? header.getHeight() : 0;
        var bodybottom = footer ? footer.getHeight() : 0;
        var style = 'top:'+bodytop+"px;bottom:"+bodybottom+"px;";
        if (bodyStyle) style+=bodyStyle;
        var code = "<div id='iscroll-"+render+"' class='mwt-h5page-body' style='"+style+"'><div>"+pagebody+"</div></div>";

/*
        // header
        if (header) {
            code+=header.get(render+"-head");
            bodytop=header.getHeight();
        }
        
        // footer
        if (footer) code+=footer.get(render+"-foot");
*/
        //code += '</div>';
        // animate

		if (animate=='fadeIn') {
        	jQuery("#"+render).hide().html(code).fadeIn('slow');
		} else {
			var $html = jQuery(code).addClass(animate);
			jQuery("#"+render).html($html);
		}

		if (header) header.create(render+'-head');
		if (footer) footer.create(render+'-footer');

        // bind
        //if (header) header.bind();
        //if (footer) footer.bind();

		
/*
		if (iscroll) {
		var myScroll = new IScroll('#iscroll-'+render, {
        	mouseWheel: true,
        	scrollX:false,
			//preventDefault: false,
			preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|IMG|DIV|LABEL|I|SPAN|A|LI|P)$/ },
        	directionLockThreshold: 5
    	});
		}
*/
    };

	this.iscroll = function() {
		var myScroll = new IScroll('#iscroll-'+render, {
        	mouseWheel: true,
        	scrollX:false,
			//preventDefault: false,
			preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|IMG|DIV|LABEL|I|SPAN|A|LI|P)$/ },
        	directionLockThreshold: 5
    	});
	};

    // header
    this.getHeader = function(){ return header; }
    // footer
    this.getFooter = function(){ return footer; }

    // 设置动画
    this.setAnimate = function(anm) { animate=anm; return this; }

    // 打开
    this.open = function() {
        this.create();
        this.fire('open');
    };

    // 关闭
    this.close = function() {
        var outanim = 'slideLeftOut';
        if (animate=='slideRight') outanim='slideRightOut';
        else if (animate=='slideTop') outanim='slideTopOut';
        else if (animate=='slideBottom') outanim='slideBottomOut';

		jQuery("#"+render+">div").addClass(outanim).on('animationend', function () {
            jQuery("#"+render).remove();
            jQuery("#"+render+"-head").remove();
            jQuery("#"+render+"-footer").remove();
        }).on('webkitAnimationEnd', function () {
            jQuery("#"+render).remove();
            jQuery("#"+render+"-head").remove();
            jQuery("#"+render+"-footer").remove();
        });
    };
};

MWT.extends(MWT.H5Page, MWT.Event);
