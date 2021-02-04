/**
 * 单选输入控件-支持输入查找选项
 **/
MWT.SelectComboxField=function(opt)
{
	this.listeners={};
	var errpop;           //!< 错误弹框
    var errmsg;           //!< 错误信息
    var empty=false;      //!< 是否允许为空
    var checkfun;         //!< 自定义校验函数
    var btnid,txtid,optdivid;
    var width = '100%';   //!< 控件宽度
    var popWidth = 400;   //!< 弹出层宽度
    var popHeight = 300;  //!< 弹出层高度
	var placeholder = "请选择";
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
		if(opt.options) options=opt.options;
        btnid = this.render+'-btn';
        txtid = this.render+'-btn-txt';
		optdivid = this.render+'-opt';
		if(opt.id) elid=opt.id;
		if(opt.placeholder) placeholder=opt.placeholder;
    }
	var thiso=this;
	var activeOptionIdx=0,queryLen=0;

	// create 
	this.create = function() {
		var code = '<div class="mwt-search" style="width:'+width+'"><input type="text" id="'+btnid+'" class="mwt-field" placeholder="'+placeholder+'"><i class="fa fa-caret-down"></i><input type="hidden" id="'+elid+'"></div>';
		jQuery("#"+this.render).html(code);
		// 事件绑定
		jQuery("#"+btnid).click(function(event){
            mwt.showPop(btnid,optdivid,popWidth,popHeight,function(){
				// 首次弹出
				if (!jQuery('#'+optdivid).hasClass('mwt-nav-ul')) {
					jQuery('#'+optdivid).addClass('mwt-nav-ul');
					query("");
				}
            });
            jQuery(document).on("click", function(){
                jQuery("#"+optdivid).hide();
				//todo setvalue
            });
            event.stopPropagation();
        });
        jQuery("#"+optdivid).click(function(event){
            event.stopPropagation();
        });
		// 输入事件
		jQuery('#'+btnid).unbind('keyup').keyup(function(e){
			jQuery("#"+optdivid).show();
			if (e.which==40) {
				++activeOptionIdx;
				activeOption();
			} else if (e.which==38) {
				--activeOptionIdx;
				activeOption();
			} else if (e.which==13) {	//enter键
				var jactive = jQuery('[name=li-'+optdivid+']').eq(activeOptionIdx);
				if (jactive) {
					thiso.setValue(jactive.data('v'));
					return;
				}
			} else {
				query(jQuery(this).val());
			}
		});
		// 输入框
		jQuery('#'+btnid).unbind('change').change(function(e){
			var val = jQuery(this).val().trim();
			var opt = getOption(val);
			if (!opt) {
				thiso.setValue(thiso.value);
				query("");
			}
			else thiso.setValue(opt.value);
		});
		this.setValue(this.value);
	};
	
	// 弹出层divid
	this.getPopDivId = function() { return optdivid; }

	this.setValue=function(v){
        this.value=v;
		jQuery('#'+elid).val(v);
		var index = -1;
		for (var i=0;i<options.length;++i) {
			if (options[i].value==v) {
				index = i;
				break;
			}
		}
		if (index>=0) this.setText(options[index].text);
		else this.setText("");
		this.fire('change');
    };

	this.setText=function(v) {
		jQuery('#'+btnid).val(v);
		jQuery("#"+optdivid).hide();
	};

	this.validate=function() {
        /*errpop.hide();
        var v = this.value;
        if ( (!empty && v=='')  || (checkfun && !checkfun(this.value))) {
            errpop.pop();
            setTimeout(errpop.hide,2000);
            return false;
        }*/
        return true;
    };

	// 根据字面获取选项
	function getOption(v) {
		for (var i=0;i<options.length;++i) {
			if (options[i].value==v) {
				return options[i];
			}
		}
		return null;
	}

	// 本地搜索
	function query(key) {
		var lis = [];
		for(var i=0;i<options.length;++i){
			var im = options[i];
			if (key!='' && im.text.indexOf(key)<0) continue;
			var code = '<a href="javascript:;" name="li-'+optdivid+'" class="mwt-nav-li" data-v="'+im.value+'">'+im.text+'</a>';
			lis.push(code);
        }
		jQuery('#'+optdivid).html(lis.join(''));
		activeOptionIdx = 0;
		queryLen = lis.length;
		activeOption();
		jQuery('[name=li-'+optdivid+']').unbind('click').click(function(){
			var value = jQuery(this).data('v');
			var text = jQuery(this).html();
			thiso.setValue(value);
		});
	}

	// 激活下拉选项
	function activeOption() {
		if (activeOptionIdx<=0) activeOptionIdx=0;
		if (activeOptionIdx>=queryLen) activeOptionIdx=queryLen-1;
		var jOpts = jQuery('[name=li-'+optdivid+']');
		jOpts.removeClass('active');
		jOpts.eq(activeOptionIdx).addClass('active');
	}
};
MWT.extends(MWT.SelectComboxField, MWT.Field);
