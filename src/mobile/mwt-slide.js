/* mwt-slide.js, (c) 2016 mawentao */
MWT.Slide=function(opt)
{
    this.listeners={};

    var render=null;
    var images=[];
    var swiper;
    var autoplay=2500;
    if(opt){ 
        if(opt.render)render=opt.render;
        if(opt.images)images=opt.images;
        if(opt.autoplay)autoplay=opt.autoplay;
    }
    
    // 创建
    this.create=function(){
        var spid = render+"-swiper";
        var code = '<div id="'+spid+'" class="swiper-container" style="width:100%;height:100%;">'+
            '<div class="swiper-wrapper">';
        var imgname = render+"-img";
        for (var i=0;i<images.length;++i) {
            var im=images[i];
            var style=im.style ? im.style : 'width:100%;height:100%;';
            var href = im.href ? im.href : '';
            var title = im.title ? '<div class="slide-title"><span>'+im.title+'</span></div>' : '';
            code += '<div class="swiper-slide" name="'+imgname+'" data-idx="'+i+'" data-href="'+href+'">'+
                title+
                '<img data-src="'+im.url+'" style="'+style+'" class="swiper-lazy">'+
                '<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>'+
              '</div>';
        }
        code += '</div>';
        // Add Pagination
        var paginationid= render+'-p';
        code += '<div id="'+paginationid+'" class="swiper-pagination swiper-pagination-white"></div>';
        code += '</div>';
        jQuery("#"+render).html(code);
        var opts = {
            pagination: '#'+paginationid,
            paginationClickable: true,
            preloadImages: false,
            lazyLoading: true
        }
        if (autoplay) {
            opts.autoplay=autoplay;
            opts.autoplayDisableOnInteraction = false;
        }
        swiper=new Swiper("#"+spid,opts);
        // 
        jQuery('[name='+imgname+']').click(function(){
            var idx=jQuery(this).data("idx");
            var item = images[idx];
			var href = jQuery(this).data("href");
			if (href!='') {
				window.location=href;
				return;
			}
            if (item.handler) item.handler(idx);
        });
    };
};
MWT.extends(MWT.Slide, MWT.Event);
