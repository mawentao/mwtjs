/**
 * Widget: 可视化组件，只用于呈现内容，不涉及用户输入
 * 所有可视化组件都需继承此类
 **/
MWT.Widget=function(opt)
{
    this.listeners={};
    this.render=null;
    this.cls="";
    this.style="";
    this.created=false;

    this.construct=function(opt){
		if (opt){
			if(opt.render) this.render=opt.render;
			if(opt.style) this.style=opt.style;
			if(opt.cls) this.cls=opt.cls;
		}
    };

    // 创建组件（子类需overwrite）
    this.create = function(){};

    // 显示组件
    this.show = function() {
        this.fire('beforeShow');
        if (!this.created) this.create();
        jQuery("#"+this.render).show();
        this.fire('show');
        return this;
    };

    // 隐藏组件
    this.hide = function() {
        this.fire('beforeHide');
        jQuery("#"+this.render).hide();
        this.fire('hide');
        return this;
    };
};
MWT.extends(MWT.Widget,MWT.Event);
