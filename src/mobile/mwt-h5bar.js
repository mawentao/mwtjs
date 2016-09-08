/**
 * 工具栏
 **/
MWT.H5Bar=function(opt)
{
    this.listeners={};
    var render=null;
    var cls='';
    var style=null;
    var items=[];
    if(opt){
        if(opt.render)render=opt.render;
        if(opt.items)items=opt.items;
        if(opt.style)style=opt.style;
		if(opt.cls)cls=opt.cls;
    }

	// 获取元素ID
    function getItemId(i){
		var item=items[i];
        if(isset(item.id)&&item.id!="")return item.id;
        return render+"_item_"+i;
    };
	function get_width_percent() {
		var wc = 0;
		for (var i=0;i<items.length;++i) {
			if (items[i]=='-') continue;
            if (items[i].width) return '';
            ++wc;
        }
        if (wc==0) return "";
        var percent = 100/wc;
        return percent+"%";
	}

    // 返回按钮控件
	function renderBack(i) {
		var item=items[i];
		var code = ''; 
		var btnid=getItemId(i);
		var style=item.style?' style="'+item.style+'"':'';
		var icon = "<i class='icon icon-left'"+style+"></i>";
		code = "<button data-i='"+i+"' id='"+btnid+"'>"+icon+"</button>";
		jQuery("#"+render+'-td-'+i).html(code);
		// bind event
		jQuery("#"+btnid).click(function(){
			var idx=jQuery(this).data("i");
			if (item.handler) { item.handler(); }
			else {
				if (window.history.length>1) {
					window.history.back();
				}
			}
		});
	}

	// button控件
    function renderButton(i) {
		var item=items[i];
		var code = '';
		if (item.html) {
			code = "<div data-i="+i+">"+item.html+"</div>";
			jQuery("#"+render+'-td-'+i).html(code);
			return;
		}
		// button
		var btnid=getItemId(i);
		var label = item.label ? item.label : '';
		var icon = "";
		if (item.icon) {
			var iconStyle = 'display:block;';
			if (label=='') iconStyle = "font-size:22px;";
			if (item.iconStyle) iconStyle+=item.iconStyle;
			icon = "<i class='fa "+item.icon+"' style='"+iconStyle+"'></i>";
		}
		code = "<button data-i='"+i+"' id='"+btnid+"'>"+icon+label+"</button>";
		jQuery("#"+render+'-td-'+i).html(code);
		// bind event
		if (item.handler) {
		    jQuery("#"+btnid).click(function(){
			    var idx=jQuery(this).data("i");
			    item.handler();
		    });
		}
	}

	// search控件
	function renderSearch(i) {
		var item=items[i];
		var code = '';
		var imid=getItemId(i);
		var btnid=imid+"btn";
        var value=isset(item.value)?item.value:"";
        var placeholder=isset(item.placeholder)?item.placeholder:"";
        var style = isset(item.style) ? item.style : "";
		var icon = item.icon ? item.icon : "fa fa-search";
		var iconStyle = icon.iconStyle ? icon.iconStyle : '';
		var code = '<div class="mwt-text-search" style="'+style+'">'+
                '<input id="'+imid+'" type="text" value="'+value+'" placeholder="'+placeholder+'">'+
                '<i id="'+btnid+'" class="'+icon+'" style="'+iconStyle+'"></i>'+
              '</div>';
		jQuery("#"+render+'-td-'+i).html(code);
		// bind event
		if (item.handler) {
			jQuery("#"+btnid).click(function(){
				var v = jQuery("#"+imid).val();
				item.handler(v);
			});
			jQuery("#"+imid).change(function(){
				var v = jQuery("#"+imid).val();
				item.handler(v);
			});
		}
	}

	// select 控件
	function renderSelect(i) {
		var item=items[i];
		var id=getItemId(i);
		var field=new MWT.SelectField({
            render:render+'-td-'+i,
            id:id,
            options:item.options,
            value:item.value,
            cls:item.cls,
            style:item.style
        });
        field.create();
        if(isset(item.handler)){
			jQuery("#"+id).change(function(){
				var v=jQuery(this).val();
				item.handler(v);
			});
            //field.on("change",item.handler);
        };
	}

	// radio 控件
	function renderRadio(i) {
		var item=items[i];
		var code = '<div class="mwt-rdo-btns">';
		var name = item.name ? item.name : getItemId(i);
		var width = item.itemWidth ? 'width:'+item.itemWidth+'px;' : '';
		for (var k=0; k<item.options.length;++k) {
			var im=item.options[k];
			var checked=im.value==item.value ? 'checked' : '';
			code += '<label>'+
              '<input type="radio" name="'+name+'" value="'+im.value+'" '+checked+'>'+
              '<span style="'+width+'">'+im.text+'</span></label>';
		}
		code+='</div>';
		jQuery("#"+render+'-td-'+i).html(code);
		//bind event
		if (isset(item.handler)) {
			jQuery("[name='"+name+"']").change(function(){
				var v=jQuery(this).val();
				item.handler(v);
			});
		}
	}

    // 创建
    this.create=function(){
        //1. create frame
        var tdstyle = style ? " style='"+style+"'" : "";
        var code='<table class="mwt-bar-tb '+cls+'"><tr>';
		var width_percent = get_width_percent();
        for(var i=0;i<items.length;++i){
            var item=items[i];
            if (item=='-') {
				code+='<td style="width:1px;"><hr></td>';
				continue;
			}
			var tdwd = item.width ? item.width : width_percent;
			code+='<td name="'+render+'-td" width="'+tdwd+'" id="'+render+'-td-'+i+'"'+tdstyle+'></td>';
		}	
        code+="</tr></table></div>";
        jQuery("#"+render).html(code);

		//2. create element
		for(var i=0;i<items.length;++i){
			var item=items[i];
			if (item=='-') continue;
			var type=isset(item.type)?item.type:'button';
			switch(type) {
				case 'search': renderSearch(i); break;
				case 'select': renderSelect(i); break;
				case 'radio': renderRadio(i); break;
				case 'back': renderBack(i); break;
				case 'button':
				default: renderButton(i); break;
			}
		}
    };

    // 选中nav（idx从0开始）
    this.active = function(idx) {
        jQuery("[name='"+render+"-td']").removeClass("active");
        jQuery("[name='"+render+"-td']:eq("+idx+")").addClass("active");
    };
};
MWT.extends(MWT.H5Bar, MWT.Event);
