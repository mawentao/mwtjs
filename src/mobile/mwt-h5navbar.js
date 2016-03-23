/* H5Page的topbar or bottom bar （导航用） */
MWT.H5Navbar = function(opt)
{
    this.listeners = {};
	var render='';
    var cls='';
    var bordered=false;
    var bodyStyle=null;
    var items=[];
    var position='top';
    var height = 50;

    if (opt) {
        if (opt.render) render=opt.render;
        if (opt.bodyStyle) bodyStyle=opt.bodyStyle;
        if (opt.iconStyle) iconStyle=opt.iconStyle;
        if (opt.position) position=opt.position;
        if (opt.height) height=opt.height;
        if (opt.cls) cls=opt.cls;
        if (opt.items) items=opt.items;
        if (opt.bordered) bordered=opt.bordered;
    }

    function get_width_percent() {
        var wc = 0;
        for (var i=0;i<items.length;++i) {
            if (items[i].width) continue;
            ++wc;
        }
        if (wc==0) return "";
        var percent = 100/wc;
        return percent+"%";
    }

    // 获取barcode
    this.get=function(domid) {
        if (domid) render = domid;
        var style = position+":0;height:"+height+"px;";
        if (bodyStyle) style+=bodyStyle;
        var code = "<div class='mwt-h5bar "+cls+"' style='"+style+"'>";
        if (items.length>0) 
        {
            var itname = render+"-btn";
            var width_percent = get_width_percent();
            var sepheight = height-0;

            code += "<table class='navtab'><tr>";
            for (var i=0;i<items.length;++i) {
                if (bordered && i>0) {
                    code += "<td style='width:1px;'><span class='sep' style='height:"+sepheight+"px;'></span></td>";
                }
                var item = items[i];
                // label & icon
                var label = item.label ? item.label : '';
                var icon = "";
                if (item.icon) {
                    var iconStyle = '';
                    if (label=='') iconStyle = "font-size:22px;";
                    if (item.iconStyle) iconStyle+=item.iconStyle;
                    icon = "<i class='fa "+item.icon+"' style='"+iconStyle+"'></i>";
                }
                // sub div
                var sub = "";
                if (item.sub) {
                    var substyle = position+":"+height+"px;"+item.subStyle;
                    sub = "<div id='"+domid+"-subdiv-"+i+"' class='subdiv' style='"+substyle+"'>"+item.sub+"</div>";
                }
                // td
                var tdwd = item.width ? "" : "width='"+width_percent+"'";
                var btwd = item.width ? "width:"+item.width+"px;" : "";
                code += "<td "+tdwd+" style='height:"+height+"px;'>"+
                        "<button data-i='"+i+"' name='"+itname+"' style='"+btwd+"'>"+icon+label+sub+"</button></td>";
            }
            code += "</tr></table>";
        }
        code += "</div>";
        return code;
    };

    // 绑定事件
    this.bind = function() {
        jQuery("[name='"+render+"-btn']").each(function(index){
            var item = items[index];
            // 子菜单
            if (item.sub) {
                jQuery(this).click(function(){ 
                    var i = jQuery(this).data("i");
                    if (jQuery("#"+render+"-subdiv-"+i).css("display")=='none') {
                        jQuery("#"+render+"-subdiv-"+i).show();
                        jQuery(document).bind("touchstart click", function(){
						    jQuery("#"+render+"-subdiv-"+i).hide();
                            jQuery(document).unbind("touchstart click");
					    });
                    //} else {
                    //    jQuery("#"+render+"-subdiv-"+i).hide();
                    }
					event.stopPropagation();
                });
                jQuery("#"+render+"-subdiv-"+index).bind("touchstart click", function(event){
                    event.stopPropagation();
                });
            }
            else if (item.handler) {
                jQuery(this).click(function(){
                    //jQuery("[name='"+render+"-btn']").removeClass("active");
                    //jQuery(this).addClass("active");
                    item.handler();
                });
            } /*else {
                jQuery(this).click(function(){
                    jQuery("[name='"+render+"-btn']").removeClass("active");
                    jQuery(this).addClass("active");
                });
            }*/
        });
    };

    // 选中nav（idx从0开始）
    this.active = function(idx) {
        jQuery("[name='"+render+"-btn']").removeClass("active");
        jQuery("[name='"+render+"-btn']:eq("+idx+")").addClass("active");
    };

    // 获取bar的高度
    this.getHeight=function(){return height;}

    // 创建
    this.create=function(){
        if (render!='') {
            var code=this.get();
            jQuery("#"+render).html(code);
            this.bind();
        }
    };
};

MWT.extends(MWT.H5Bar, MWT.Event);
