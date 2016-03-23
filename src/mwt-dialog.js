/**
 * 对话框
 */

MWT.Dialog = function(opt)
{
	this.listeners = {};
	var title = "新建窗口";
	var dom = null;
	var dialog_body_id = "";
	var dialog_title_id = "";
	var dialog_content_id = "";
	var render = "";
	
	var width = "500px";
	var height = "auto";
	var top = 100;
    var buttons=null;
    var form;
	
	if (opt)
	{
		if (opt.title) title = opt.title;
		if (opt.width) width = opt.width+"px";
		if (opt.height) height = opt.height+"px";
		if (opt.top) top = opt.top;
        if (opt.form) form=opt.form;
        if(opt.buttons)buttons=opt.buttons;
		render = opt.render;
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
        var thiso=this;
		var eleid = render;
		dialog_body_id = eleid+"-dialog-body";
		dialog_title_id = eleid+"-dialog-title";
		dialog_content_id = eleid+"-dialog-content";
        a_close_id = eleid+"-close";
		
		dom = document.getElementById(eleid);
		dom.className = "mwt-dialog";

		var content_html = dom.innerHTML;
        if(isset(form))content_html="<div id='"+form.render+"' style='margin:5px;'></div>";

		var htmlcode = "<div class='modaldiv'></div>";
		htmlcode+= "<div id='"+dialog_body_id+"' class='dialog-body'";
		htmlcode+="style='top:"+top+"px;left:0;padding:4px;'>";

		
		htmlcode+= "<div style='height:30px;line-height:30px;' id='d-head-"+eleid+"'><table class='tablay'>"+
			"<tr><td class='header' id='"+dialog_title_id+"'>"+title+"</td>"+
			"<td style='align:right;'>"+
				"<a id='"+a_close_id+"' class='btnclose' href='javascript:void(0);'> × </a></td></t></table></div>";
		htmlcode+="<div class='content' onmousedown='' style='width:"+width+";height:"+height+"' id='"+dialog_content_id+"'>"+content_html+"</div>";

        if(buttons&&buttons.length>0){
            htmlcode+="<div id='d-foot-"+eleid+"' style='height:40px;line-height:40px;text-align:right'>";
            for(var i=0;i<buttons.length;i++){
                var cls=isset(buttons[i].cls)?buttons[i].cls:"mwt-btn-default";
                htmlcode+=" <button class='mwt-btn "+cls+" mwt-btn-sm' id='"+eleid+i+"btn'>"+buttons[i].label+"</button>";
            }
            htmlcode+="</div>";
        }
		htmlcode+="</div></div>";
		dom.innerHTML=htmlcode;
        jQuery('#'+a_close_id).click(function(){
            thiso.close();
        });

        if(isset(form)){
            form.create();
        }

        // bunddle event
        if(buttons&&buttons.length>0){
            for(var i=0;i<buttons.length;i++){
                var btnid=eleid+i+"btn";
                if (buttons[i].type=='close'){
                    jQuery("#"+btnid).click(function(){thiso.close();});
                }
                else if (buttons[i].type=='submit' && isset(form)){
                    jQuery("#"+btnid).click(function(){form.submit();});
                }
                else if(isset(buttons[i].handler)){
                    jQuery("#"+btnid).click(buttons[i].handler);
                }
            }
        }
        jQuery("#d-head-"+eleid).mousedown(dig_mdown);
        jQuery("#d-head-"+eleid).mousemove(dig_mmove);
        jQuery("#d-head-"+eleid).mouseup(dig_mup);
        jQuery("#d-foot-"+eleid).mousedown(dig_mdown);
        jQuery("#d-foot-"+eleid).mousemove(dig_mmove);
        jQuery("#d-foot-"+eleid).mouseup(dig_mup);
	};
	
	/* 打开窗口 */
	this.open = function()
	{
		if (dom == null) {
			this.create();
		}
		this.fire("beforeOpen");
		dom.style.display = "block";
		this.fire("open");
	};

	/* 关闭窗口 */
	this.close = function()
	{
		this.fire("beforeClose");
		dom.style.display = "none";
		this.fire("close");
	};

	/* 设置标题 */
	this.setTitle = function(text)
	{
		title = text;
		if (dom) {
			document.getElementById(dialog_title_id).innerHTML = title;
		}
	};

};

MWT.extends(MWT.Dialog, MWT.Event);
