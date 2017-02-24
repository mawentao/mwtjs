/* 文本输入控件 */
MWT.TextField=function(opt)
{
    this.listeners={};
	var thiso=this;
    var tid;
    var type="text";      //!< 
    var placeholder="";   //!< 
    var errpop;           //!< 错误弹框
    var errmsg;           //!< 错误信息
    var empty=false;      //!< 是否允许为空
    var checkfun;         //!< 自定义校验函数
    var optdivid,popStyle='max-height:100px;';
	var storekey;         //!< localStorage存储的key
    if(opt)
	{
        this.construct(opt);
        if(opt.type) type=opt.type;
        if(opt.placeholder) placeholder=opt.placeholder;
        if(opt.errmsg) errmsg=opt.errmsg;
        if(opt.checkfun) checkfun=opt.checkfun;
        if(opt.empty) empty=opt.empty;
        tid=this.render+"txt";
		optdivid=this.render+"pop";
		if(opt.popStyle)popStyle=opt.popStyle;
        storekey=this.render+"skey";
	}

    // create
    this.create=function(){
        var code;
        if (type=='textarea') {
            code = '<textarea id="'+tid+'" class="form-control '+this.cls+'" placeholder="'+placeholder+'"'+
             ' style="'+this.style+'"></textarea>';
        } else {
			code = '<div style="position:relative">'+
				'<input type="'+type+'" id="'+tid+'" class="form-control '+this.cls+'" placeholder="'+placeholder+'"'+
                  ' style="'+this.style+';padding:0 20px 0 5px;">'+
				'<i id="'+tid+'-clear" class="fa fa-times-circle" '+
                    'style="display:none;color:#999;font-size:14px;margin-left:-20px;vertical-align:middle;"></i>'+
				'<div id="'+optdivid+'" class="mwt-field-pop" style="'+popStyle+'">'+
			'</div>';
        }
        jQuery("#"+this.render).html(code);
        errpop = new MWT.Popover({anchor:tid,html:errmsg,cls:"mwt-popover-danger"});

        this.setValue(this.value);
        // bundle event
		var $txt = jQuery("#"+tid);
        var $clr = jQuery("#"+tid+'-clear');
		var $pop = jQuery("#"+optdivid);
        $txt.change(change);
		$txt.focus(function(){
			$clr.show();
			show_pop();
			jQuery(document).unbind('click').on("click", function(){
				var act=document.activeElement.id;
				if (act!=tid) {
					$pop.hide();
					$clr.hide();
				}
            }); 
            event.stopPropagation();
		});
		//$txt.blur(function(){$clr.hide();});
		$pop.click(function(event){
            event.stopPropagation();
        });
		$clr.click(function(){
			$txt.val('').focus();
		});
    };

    function change() {
        errpop.hide();
        thiso.value = get_value(tid);
        thiso.fire("change");
		if (thiso.value!='') jQuery("#"+tid+'-clear').show();
    };

    this.setValue=function(v){
        set_value(tid,v);
        this.value=v;
    };

    this.validate=function() {
        errpop.hide();
        var t = empty ? get_value(tid) : get_text_value(tid);
        if (checkfun && !checkfun(t)) {
            errpop.pop();
            jQuery("#"+tid).focus();
            setTimeout(errpop.hide,2000);
            return false;
        }
        return true;
    };

    this.readOnly = function(rd) {
        if (rd) jQuery('#'+tid).attr('readonly',true);
        else jQuery('#'+tid).removeAttr('readonly');
    };

	// 显示pop
    function show_pop() {
		var v = localStorage.getItem(storekey);
		if (!v) return;
		var words = v.split('||');
		if (words.length==0) return;
		var code = '<div class="mwt-pop-words"><a id="'+this.render+'-pop-clrbtn" href="javascript:;">清空</a>'+
             '<ul id="'+this.render+'-wdul">';
		for (var i=0;i<words.length;++i) {
			code += '<li name="'+thiso.render+'-wd">'+words[i]+'</li>';
		}
		code += '</ul></div>';
		jQuery('#'+optdivid).show().html(code);
		jQuery('[name='+thiso.render+'-wd]').click(function(){
			var word = jQuery(this).html();
			jQuery('#'+tid).val(word);
			change();
		});
		jQuery('#'+this.render+'-pop-clrbtn').click(function(){
			thiso.clearwords();
			jQuery('#'+this.render+'-wdul').html("");
		});
	};

	// 添加词到历史记录
	this.addword = function(word) {
		var cw = localStorage.getItem(storekey);
		var arr = cw ? cw.split("||") : [];
		if (!in_array(word,arr)) {
			arr.push(word);
			localStorage.setItem(storekey,arr.join("||"));
		}
	};

	// 清空
	this.clearwords = function() {
		localStorage.removeItem(storekey);
	};
};
MWT.extends(MWT.TextField, MWT.Field);
