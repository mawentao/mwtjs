/**
 * 工具栏
 **/
MWT.Toolbar=function(opt)
{
    this.listeners={};
    this.render=null;
    this.cls="";
    this.style="";
    this.items=[];
    if(opt){
        if(opt.render)this.render=opt.render;
        if(opt.items)this.items=opt.items;
        if(opt.cls)this.cls=opt.cls;
        if(opt.style)this.style=opt.style;
    }
    // 创建
    this.create=function(){
        var code="<div class='mwt-toolbar'>"+this.createItems()+"</div>";
        jQuery("#"+this.render).html(code);
    };

    // 创建ITEMs
    this.createItems=function(){
        var code="<div class='row'><ul>";
        var hr=false;
        for(var i=0;i<this.items.length;++i){
            var item=this.items[i];
            var type=typeof(item);
            if(type=="string"){
                switch(item){
                    case '-':code+="</ul></div><hr><div class='row'><ul>";break;
                    case '->':code+="</ul><ul class='right'>";break;
                    case '|':code+="<li class='sep'></li>";break;
                    default: code+="<li>"+item+"</li>";break;
                }
            }else{

            }
        }
        code+="</ul></div>";
        return code; 
    };
};
MWT.extends(MWT.Toolbar, MWT.Event);
