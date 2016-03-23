/* H5Page的topbar or bottom bar */
MWT.H5Bar = function(opt)
{
    this.listeners = {};
	var render=null;
    var cls='';
    var bodyStyle=null;
    var items=[];
    var position='top';
    var height = 50;

    if (opt) {
        if (opt.render) render=opt.render;
        if (opt.bodyStyle) bodyStyle=opt.bodyStyle;
        if (opt.position) position=opt.position;
        if (opt.height) height=opt.height;
        if (opt.cls) cls=opt.cls;
    }

    // 获取barcode
    this.get=function() {
        var style = position+":0;height:"+height+"px;";
        if (bodyStyle) style+=bodyStyle;
        var code = "<div class='mwt-h5bar "+cls+"' style='"+style+"'>";

        code += "</div>";
        return code;
    };

    // 获取bar的高度
    this.getHeight=function(){return height;}

    // 绑定事件
    this.bind = function() {
        
    };

    // 创建
    this.create=function(){
        if (render) {
            var code=this.get();
            jQuery("#"+render).html(code);
        }
    };
};

MWT.extends(MWT.H5Bar, MWT.Event);
