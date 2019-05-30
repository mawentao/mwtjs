/**
 * 自定义单选择输入控件
 **/
MWT.SelboxField=function(opt)
{
	this.listeners={};
	var errpop;           //!< 错误弹框 
    var errmsg;           //!< 错误信息 
    var empty=false;      //!< 是否允许为空   
    var checkfun;         //!< 自定义校验函数
    var btnid,txtid,optdivid;
    var width = 100;   //!< 控件宽度
    var popWidth = 130;   //!< 弹出层宽度
    var popHeight = 170;  //!< 弹出层高度
	var text="请选择";
	var elid='';
	var options=[];
	if(opt) {
		this.construct(opt);
        if(opt.errmsg) errmsg=opt.errmsg;
        if(opt.checkfun) checkfun=opt.checkfun;
        if(opt.empty) empty=opt.empty;
        if(opt.width) width=opt.width;
        if(opt.popWidth) popWidth=opt.popWidth;
        if(opt.popHeight) popHeight=opt.popHeight;
        if(opt.text) text=opt.text;
		if(opt.options) options=opt.options;
        btnid = this.render+'-btn';
        txtid = this.render+'-btn-txt';
		optdivid = this.render+'-opt';
		if(opt.id) elid=opt.id;
    }
	var thiso = this;

	// create 
	this.create = function() {
		var spanwidth = width-30;
		var code = '<div>'+
			'<a id="'+btnid+'" class="mwt-field mwt-selbox" href="javascript:;" '+
			    'style="width:'+width+'px;">'+
				'<span id="'+txtid+'" style="width:'+spanwidth+'px;">'+text+'</span><i class="fa fa-caret-down"></i>'+
			'</a>'+
			'<input type="hidden" id="'+elid+'">'+
		'</div>';
		jQuery("#"+this.render).html(code);
		// 浮层效果
		jQuery("#"+btnid).click(function(event){
            mwt.showPop(btnid,optdivid,popWidth,popHeight,function(){
				// 首次弹出
				if (!jQuery('#'+optdivid).hasClass('mwt-selbox-pop')) {
					jQuery('#'+optdivid).addClass('mwt-selbox-pop');
					initPop();
				}
            });
            jQuery(document).on("click", function(){
                jQuery("#"+optdivid).hide();
            }); 
            event.stopPropagation();
        }); 
        jQuery("#"+optdivid).click(function(event){
            event.stopPropagation();
        });
		//
		this.setValue(this.value);
	};
	
	// 弹出层divid
	this.getPopDivId = function() { return optdivid; }

	this.setValue=function(v){
        this.value=v;
		jQuery('#'+elid).val(v);
		for (var i=0;i<options.length;++i) {
			if (options[i].value==v) {
				this.setText(options[i].text);
				break;
			}
		}
		this.fire('change');
    };

	this.setText=function(v) {
		jQuery('#'+txtid).html(v);
		jQuery("#"+optdivid).hide();
	};

	this.validate=function() {
		/*
        errpop.hide();
        var v = this.value;
        if ( (!empty && v=='')  || (checkfun && !checkfun(this.value))) {
            errpop.pop();
            setTimeout(errpop.hide,2000);
            return false;
        }*/
        return true;
    };

	// 初始化弹出层
	function initPop() {
		var txtwd = popWidth - 16;
		var code = '<div class="mwt-selbox-bar">'+
			'<div class="mwt-search">'+
			  '<input id="so-'+optdivid+'" type="text" class="mwt-field" style="width:'+txtwd+'px;">'+
			  '<i id="sobtn-'+optdivid+'" class="fa fa-search"></i>'+
			'</div>'+
		'</div>'+
		'<div class="mwt-layout-fill" style="top:33px;" id="opts-'+optdivid+'"></div>';
		jQuery('#'+optdivid).html(code);
		jQuery('#so-'+optdivid).unbind('change').change(query);
		jQuery('#sobtn-'+optdivid).unbind('click').click(query);
		query();
	}

	// 本地搜索
	function query() {
		var key = mwt.get_value('so-'+optdivid);
		var lis = [];
		for(var i=0;i<options.length;++i){
			var im = options[i];
			if (key!='' && im.text.indexOf(key)<0) continue;
			var code = '<a href="javascript:;" name="li-'+optdivid+'" class="mwt-nav-li" data-v="'+im.value+'">'+im.text+'</a>';
			lis.push(code);
        }
		jQuery('#opts-'+optdivid).html(lis.join(''));
		jQuery('[name=li-'+optdivid+']').unbind('click').click(function(){
			var value = jQuery(this).data('v');
			var text = jQuery(this).html();
			thiso.setValue(value);
		});
	}
};
MWT.extends(MWT.SelboxField, MWT.Field);
