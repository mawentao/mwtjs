/* swiper.js, (c) 2017 mawentao */
define(function(require){
	var o={};

	o.init=function(domid,report) {
		if (!report || !report.slices || !report.slices.length) {
			return;
		}
		//1. 初始化幻灯片
		var n = report.slices.length;
		var slices = [];
		for (var i=0;i<n;++i) {
			var page = i+1;
			var code = '<div class="swiper-slide">'+
			  '<div class="slice">'+
				'<div id="slice-'+i+domid+'" class="slice-body">Slice'+i+'</div>'+
				'<div class="slice-page">'+page+' / '+n+'</div>'+
			  '</div>'+
			'</div>';
			slices.push(code);
		}
		var code = ''+
		  '<div class="swiper-container" style="width:100%;height:100%;">'+
    		'<div class="swiper-wrapper">'+
			  '<div class="swiper-slide">'+
				'<div class="slice slice-cover">'+
				  '<div class="slice-title" style="background:none;">'+
				    '<img src="source/plugin/datacube/template/static/logo.png" style="width:35px;">'+
				  '</div>'+
				  '<h1>'+report.report_title+'</h1>'+
				  '<h2>'+report.username+'</h2>'+
				'</div>'+
			  '</div>'+
			  slices.join('')+
    		'</div>'+
//			'<div class="swiper-button-prev"></div>'+
//		    '<div class="swiper-button-next"></div>'+
    	    '<div class="swiper-pagination"></div>'+
		  '</div>';
		jQuery('#'+domid).html(code);
		//2. init swiper
		var mySwiper = new Swiper ('.swiper-container', {
			pagination: '.swiper-pagination',
//			nextButton: '.swiper-button-next',
//			prevButton: '.swiper-button-prev',
			direction: 'vertical',
			slidesPerView: 1,
			paginationClickable: true,
			spaceBetween: 30,
			mousewheelControl: true
  		});
		// 方向键控制slice
		jQuery(document).keyup(function(e){
			var key = e.keyCode;
			if (key==38 || key==37) {
				mySwiper.slidePrev();
			}
			if (key==39 || key==40) {
				mySwiper.slideNext();
			}
		});
		//3. 逐个slice渲染
		for (var i=0;i<n;++i) {
			var slice_dom = 'slice-'+i+domid;
			var slice = report.slices[i];
			require('./slice').init(slice_dom,slice);
		}
	};

	return o;
});
