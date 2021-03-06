/**
 * 对话框
 * author: mawentao
 * create: 2013-12-23 09:23:11
 */
require('./dialog.css');

mwt.Dialog = function(opt)
{
	this.listeners = {};
	var title = "新建窗口";
	var dom = null;
	var dialog_body_id = "";
	var dialog_title_id = "";
	var dialog_content_id = "";
	var render = null;
    var animate = "bounceInDown";  //!< 动画效果：bounceInDown, zoomIn, flipInX, rubberBand
	var width = "500px";
	var height = "auto";
	var top = 100;
	var fullscreen=false;
    var buttons=null;
    var form;                      //!< MWT.Form
    var body=null;
    var bodyStyle;
    var style;
	var buttonStyle = 'pc';
	
	if (opt)
	{
		if (opt.render) render = opt.render;
		if (opt.title) title = opt.title;
		if (opt.width) width = /%$/.test(opt.width) ? opt.width : opt.width+"px";
		if (opt.height) height = opt.height+"px";
		if (opt.top) top = opt.top;
        if (opt.form) form=opt.form;
        if (opt.buttons)buttons=opt.buttons;
        if (opt.animate) animate = opt.animate;
        if (opt.body) body = opt.body;
        if (opt.bodyStyle) bodyStyle=opt.bodyStyle;
		if (opt.fullscreen) fullscreen=true;
        if (opt.style) style=opt.style;
		if (opt.buttonStyle) buttonStyle=opt.buttonStyle;
	}

    function dig_mdown(e){
		if (e.which!=1)return;
		var obj=document.getElementById(dialog_body_id);
		obj.style.cursor = "move";
		jQuery("#"+dialog_body_id).data("mdown","1");
		jQuery("#"+dialog_body_id).data("objX", obj.style.left);  
		jQuery("#"+dialog_body_id).data("objY", obj.style.top);  
		jQuery("#"+dialog_body_id).data("mouseX", e.clientX);
		jQuery("#"+dialog_body_id).data("mouseY",e.clientY);
    }
    function dig_mmove(e){
		if (e.which!=1)return;
		if (jQuery("#"+dialog_body_id).data("mdown")==1) {
			var objX = jQuery("#"+dialog_body_id).data("objX");
			var objY = jQuery("#"+dialog_body_id).data("objY");
			var mouseX = jQuery("#"+dialog_body_id).data("mouseX");
			var mouseY = jQuery("#"+dialog_body_id).data("mouseY");
			var obj=document.getElementById(dialog_body_id);
			var x = e.clientX;  
			var y = e.clientY;  
			obj.style.left = parseInt(objX) + parseInt(x) - parseInt(mouseX) + "px";  
			obj.style.top = parseInt(objY) + parseInt(y) - parseInt(mouseY) + "px";  
		}
	}
	function dig_mup(e){
		if (e.which!=1)return;
		var obj=document.getElementById(dialog_body_id);
		obj.style.cursor = "default";
		jQuery("#"+dialog_body_id).data("mdown","0");
	}

	/* 创建Dialog */
	this.create = function()
	{
        //1. create div
        if (!render) render=MWT.genId('dg-');
        MWT.createDiv(render);
        dom=MWT.$(render);
        dom.className = "mwt-dialog";
        if (body) dom.innerHTML=body;

        //2. set html code
        var thiso=this;
		var eleid = render;
		dialog_body_id = eleid+"-dialog-body";
		dialog_title_id = eleid+"-dialog-title";
		dialog_content_id = eleid+"-dialog-content";
        var a_close_id = eleid+"-close";
		var content_html = dom.innerHTML;
		if (fullscreen) {
			var htmlcode = "<div id='"+render+"-modal' class='modaldiv'></div>"+
			  "<div id='"+dialog_body_id+"' class='dialog-body "+animate+"' "+
                "style='position:fixed;top:0;bottom:0;left:0;right:0;display:block;border-radius:0;"+style+"'>"+
                "<div class='dialog-head mwt-border-bottom' id='d-head-"+eleid+"'>"+
			      "<span id='"+dialog_title_id+"'>"+title+"</span>"+
			      "<a id='"+a_close_id+"' class='mwt-btn mwt-btn-default btnclose' href='javascript:;'>"+
                    '<i class="sicon-close"></i>'+
                  "</a>"+
                "</div>"+
		        "<div class='content' onmousedown='' style='height:"+height+";"+bodyStyle+"' id='"+dialog_content_id+"'>"+content_html+"</div>";
		} else {
			var htmlcode = "<div id='"+render+"-modal' class='modaldiv'></div>"+
		      "<div id='"+dialog_body_id+"' class='dialog-body "+animate+"' style='top:"+top+"px;width:"+width+";"+style+"'>"+
                "<div class='dialog-head mwt-border-bottom' id='d-head-"+eleid+"'>"+
			      "<span id='"+dialog_title_id+"'>"+title+"</span>"+
			      "<a id='"+a_close_id+"' class='mwt-btn mwt-btn-default btnclose' href='javascript:;'>"+
                    '<i class="sicon-close"></i>'+
                  "</a>"+
                "</div>"+
		        "<div class='content' onmousedown='' style='height:"+height+";"+bodyStyle+"' id='"+dialog_content_id+"'>"+content_html+"</div>";
		}
        if(buttons&&buttons.length>0){
			var btns = [];
            for(var i=0;i<buttons.length;i++){
                var cls=isset(buttons[i].cls)?buttons[i].cls:"mwt-btn-default";
				if (buttonStyle=='mobile') {
					cls += ' mwt-col-fill';
				} else {
					cls += ' mwt-btn-sm radius';
				}
				var sty = buttons[i].style ? ' style="'+buttons[i].style+'"' : '';
				var btn = '<button id="'+eleid+i+'btn" class="mwt-btn '+cls+'"'+sty+'>'+buttons[i].label+'</button>';
				btns.push(btn);
            }
			var cls = 'dialog-foot mwt-border-top';
			if (buttonStyle=='mobile') cls += ' mwt-row-flex';
            htmlcode+="<div id='d-foot-"+eleid+"' class='"+cls+"'>"+btns.join('')+"</div>";
        }
		htmlcode+="</div></div>";
		dom.innerHTML=htmlcode;

        if(isset(form)){
            form.create();
        }

        //3. bunddle event
        jQuery('#'+a_close_id).click(function(){thiso.close();});
        if(buttons&&buttons.length>0){
            for(var i=0;i<buttons.length;i++){
                var btnid=eleid+i+"btn";
                if (buttons[i].type=='close'){
                    jQuery("#"+btnid).click(function(){thiso.close();});
                }
                else if(isset(buttons[i].handler)){
                    jQuery("#"+btnid).click(buttons[i].handler);
                }
            }
        }
        if (!fullscreen) {
            jQuery("#d-head-"+eleid).mousedown(dig_mdown)
                                .mousemove(dig_mmove)
                                .mouseup(dig_mup);
        }
	};
	
	/* 打开窗口 */
	this.open = function()
	{
		if (dom == null) this.create();
		this.fire("beforeOpen");
		//dom.style.display = "block";
        jQuery("#"+render).show(); //fadeIn('fast');
        jQuery("#"+render+"-modal").fadeIn('fast');
        jQuery("#"+dialog_body_id).css("display","inline-block");
		this.fire("open");
	};

	/* 关闭窗口 */
	this.close = function()
	{
		this.fire("beforeClose");
		//dom.style.display = "none";
        jQuery("#"+render).fadeOut('fast');
		this.fire("close");
	};

	/* 设置标题 */
	this.setTitle = function(text)
	{
		title = text;
		if (dom) MWT.$(dialog_title_id).innerHTML = title;
	};
};

MWT.extends(MWT.Dialog, MWT.Event);
