/**
 * 工具栏
 **/
MWT.Bar=function(opt)
{
    this.listeners={};
    this.render=null;
    this.style=null;
    this.items=[];
    if(opt){
        if(opt.render)this.render=opt.render;
        if(opt.items)this.items=opt.items;
        if(opt.style)this.style=opt.style;
    }

    // 创建
    this.create=function(){
        //1. render code
        var style = this.style ? "style='"+this.style+"'" : "";
        var code="<div class='mwt-bar' "+style+"><table><tr>";
        var hasexpand=false;
        for(var i=0;i<this.items.length;++i){
            var item=this.items[i];
            if(item=='->'){
                code+="<td width='100%'></td>";
                hasexpand=true;
                continue;
            }
            if(item=='-'){
                if(!hasexpand)code+="<td width='100%'></td>";
                code+="</tr></table><hr><table><tr>";
                hasexpand=false;
                continue;
            }
            if(isset(item.html)){
                code+="<td>"+item.html+"</td>";
                continue;
            }
            var type=isset(this.items[i].type)?this.items[i].type:"button";
            switch(type){
                case "select":
                case "radiobtn":
                    code+=this.renderSelect(item,i);
                    break;
                case "search":
                    code+=this.renderSearch(item,i);
                    break;
                //case "radiobtn":
                    //code+=this.renderRadiobtn(item,i);
                    //break;
                case "datepicker":
                    code+=this.renderDatepicker(item,i);
                    break;
                case "daterangepicker":
                    code+=this.renderDaterangepicker(item,i);
                    break;
                case "button":
                default:
                    code+=this.renderButton(item,i);
                    break;
            }
        }
        if(!hasexpand)code+="<td width='100%'></td>";
        code+="</tr></table></div>";
        set_html(this.render, code);

        //2. bundle event
        for(var i=0;i<this.items.length;++i){
            var type=isset(this.items[i].type)?this.items[i].type:"button";
            switch(type){
                case "select":
                    code+=this.bundleSelect(this.items[i],i);
                    break;
                case "radiobtn":
                    code+=this.bundleRadiobtn(this.items[i],i);
                    break;
                case "search":
                    code+=this.bundleSearch(this.items[i],i);
                    break;
                case "datepicker":
                    this.bundleDatepicker(this.items[i],i);
                    break;
                case "daterangepicker":
                    this.bundleDaterangepicker(this.items[i],i);
                    break;
                case "button":
                default:
                    code+=this.bundleButton(this.items[i],i);
                    break;
            }
        }
    };

    this.genid=function(item,i){
        if(isset(item.id)&&item.id!="")return item.id;
        return this.render+"_item_"+i;
    };

    this.renderSearch=function(item,i){
        var txtid=this.genid(item,i);
        var btnid=txtid+"btn";
        var width=isset(item.width)?item.width:200;
        var txtwidth=width-70;
        var cls=isset(item.class)?item.class:'mwt-search-primary';
        var txt=isset(item.label&&item.label!="")?item.label:"搜索";
        var value=isset(item.value)?item.value:"";
        var placeholder=isset(item.placeholder)?item.placeholder:"";
        var style = isset(item.style) ? item.style : "";
        var code='<td><div class="mwt-search '+cls+'" style="width:'+width+'px;'+style+'">'+
           '<div class="text">'+
             '<input type="text" class="form-control" id="'+txtid+'" style="width:'+txtwidth+'px;" value="'+value+'" placeholder="'+placeholder+'">'+
           '</div>'+
           '<button class="submit" id="'+btnid+'">'+txt+'</button>'+
       '</div>';
        return code;
    };
    this.bundleSearch=function(item,i){
        var id=this.genid(item,i);
        var btnid=id+"btn";
        if(isset(item.handler)){
            jQuery("#"+btnid).click(item.handler);
            jQuery("#"+id).change(item.handler);
        };
    };

    this.renderButton=function(item,i){
        var code="<td><button id='"+this.genid(item,i)+"'";
        if(isset(item.class))code+=" class=\""+item.class+"\"";
        else code+=" class=\"mwt-btn-primary\"";
        if(isset(item.style))code+=" style=\""+item.style+"\"";
        code+=">"+item.label+"</button></td>";
        return code;
    };
    this.bundleButton=function(item,i){
        var id=this.genid(item,i);
        if(isset(item.handler)){
            jQuery("#"+id).click(function(){item.handler();});
        };
    };

    this.renderSelect=function(item,i){
        var code="<td>";
        if(isset(item.label)&&item.label!="") {
            code+="<label";
            if (isset(item.width))code+=" style='width:"+item.width+"px;'";
            code+=">"+item.label+":&nbsp;</label></td><td style='padding-left:0;'>";
        }

        code+="<div id='"+this.genid(item,i)+"div'></div></td>";
/*
        code+="<select id='"+this.genid(item,i)+"'";
        if(isset(item.class))code+=" class=\""+item.class+"\"";
        else code+=" class=\"form-control\"";
        if(isset(item.style))code+=" style=\""+item.style+"\"";
        else code+=" style=\"width:auto;border-radius:2px;\"";
        code+=">";
        for(var i=0;i<item.options.length;++i) {
            var v = isset(item.value)?item.value:0;
            var selected = item.options[i].value==v?"selected":"";
            code += "<option value='"+item.options[i].value+"' "+selected+">"+item.options[i].text+"</option>";
        }
        code+="</select></td>";
*/
        return code;
    };
	this.bundleSelect=function(item,i){
        var field=new MWT.SelectField({
            render:this.genid(item,i)+"div",
            id:this.genid(item,i),
            options:item.options,
            value:item.value,
            cls:item.class,
            style:item.style
        });
        field.create();
        if(isset(item.handler)){
            field.on("change",item.handler);
        };
/*
        var id=this.genid(item,i);
        if(isset(item.handler)){
            jQuery("#"+id).change(item.handler);
        };
*/
    };

    this.renderRadiobtn=function(item,i){
        var code="<td>";
        if(isset(item.label)&&item.label!="") {
            code+="<label";
            if (isset(item.width))code+=" style='width:"+item.width+"px;'";
            code+=">"+item.label+":&nbsp;</label></td><td style='padding-left:0;'>";
        }
        code+="<div id='"+this.genid(item,i)+"div'></div></td>";
        return code;
    };
	this.bundleRadiobtn=function(item,i){
        var field=new MWT.RadiobtnField({
            render:this.genid(item,i)+"div",
            id:this.genid(item,i),
            options:item.options,
            value:item.value,
            class:item.class,
            style:item.style
        });
        field.create();
        if(isset(item.handler)){
            field.on("change",item.handler);
        };
    };

    this.renderDatepicker=function(item,i){
        var code="<td>";
        if(isset(item.label)&&item.label!="") {
            code+="<label";
            if (isset(item.width))code+=" style='width:"+item.width+"px;'";
            code+=">"+item.label+":&nbsp;</label></td><td style='padding-left:0;'>";
        }
        code+="<div id='"+this.genid(item,i)+"div'></div></td>";
        return code;
    };
    this.bundleDatepicker=function(item,i){
        var field=new MWT.DatePicker({
            render:this.genid(item,i)+"div",
            id:this.genid(item,i),
            format:item.format?item.format:'yy-mm-dd'
        });
        field.create();
        if(isset(item.handler)){
            field.on("change",item.handler);
        };
    };

    this.renderDaterangepicker=function(item,i){
        var code="<td>";
        if(isset(item.label)&&item.label!="") {
            code+="<label";
            if (isset(item.width))code+=" style='width:"+item.width+"px;'";
            code+=">"+item.label+":&nbsp;</label></td><td style='padding-left:0;'>";
        }
        code+="<div id='"+this.genid(item,i)+"div'></div></td>";
        return code;
    };
    this.bundleDaterangepicker=function(item,i){
        var field=new MWT.DateRangePicker({
            render:this.genid(item,i)+"div",
            id:this.genid(item,i),
            float:item.float?item.float:"right",
            format:item.format?item.format:'yy/mm/dd'
        });
        field.create();
        if(isset(item.handler)){
            field.on("change",item.handler);
        };
    };
};
MWT.extends(MWT.Bar, MWT.Event);
