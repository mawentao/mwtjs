/**
 * 默认工具条
 * author: mawentao
 * create: 2013-07-14 11:17:14
 **/

require('./ToolBar.css');

MWT.ToolBar=function(cnf)
{
    var thiso=this;
    this.listeners = {};
    this.style=null;
    this.items=[];

    if (cnf) {
        this.construct(cnf);
        if(cnf.items)this.items=cnf.items;
        if(cnf.style)this.style=cnf.style;
    }

    // 根据总宽度自动计算每个cell的宽度(栅格布局宽度)
    function getCellWidth(totalWidth)
    {/*{{{*/
        var minWidth = 150;
        var n = Math.ceil(minWidth/(totalWidth/12));
        // 栅格布局等分只能是1,2,3,4,6,12
        if (n>6) n=12;
        else if (n>=5) n=6;
        return n;
    }/*}}}*/


    // 控件布局2
    function layout2() 
    {/*{{{*/
        var jDom = jQuery('#'+thiso.render);
        var cn = getCellWidth(jDom.width());
        var style = thiso.style ? " style='"+thiso.style+"'" : "";
        var cells = [];
        for (var i=0;i<thiso.items.length;++i) {
            var item=thiso.items[i];
            if (item=='->' || item=='-') {
                continue;
            }
            var code = '<div class="mwt-col-'+cn+'">';
            if (isset(item.html)) {
                code += item.html;
            }
            else if (is_string(item)) {
                code += item;
            }
            else {
                if (item.label && item.type && item.type!='button') {
                    code += '<label>'+item.label+'</label>';
                }
                code += '<div id="'+genid(item,i)+'-cell"></div>';
            }
            code += '</div>';
            cells.push(code);
        }
        var code = '<div class="mwt-row">'+cells.join('')+'</div>';
        jDom.html(code);
    }/*}}}*/
    

    // 创建工具条
    this.create=function()
    {/*{{{*/
        if (!this.render) return;
        //1. 控件布局
        var style = this.style ? " style='"+this.style+"'" : "";
        var code="<div class='mwt-toolbar'"+style+"><table><tr>";
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
            if(is_string(item)) {
                code+="<td>"+item+"</td>";
                continue;
            }
            if (item.label && item.type && item.type!='button') {
                code += '<td><label>'+item.label+':</label></td>';
            }
            code += '<td id="'+genid(item,i)+'-cell"></td>';
        }
        if(!hasexpand)code+="<td width='100%'></td>";
        code+="</tr></table></div>";
        jQuery('#'+this.render).html(code);
        //2. 创建控件
        for(var i=0;i<this.items.length;++i) {
            var item=this.items[i];
            if (item=='->'||item=='-'||isset(item.html)||is_string(item)) continue;
            var type=isset(item.type) ? item.type : "button";
            var id = genid(item,i);
            var cellid = id+'-cell';
            switch(type) {
                case "select"          : renderSelect(item,id,cellid); break;
				case "selbox"          : renderSelbox(item,id,cellid); break;
                case "radiobtn"        : renderRadiobtn(item,id,cellid); break;
                case "search"          : renderSearch(item,id,cellid); break;
                case "datepicker"      : renderDatepicker(item,id,cellid); break;
                case "daterangepicker" : renderDaterangepicker(item,id,cellid); break;
                case "timepicker"      : renderTimepicker(item,id,cellid); break;
                case "button":
                default: renderButton(item,id,cellid); break;
            }
        }
    }/*}}}*/

    ///////////////////////////////////////////////////
    function genid(item,i) {
        var id = (isset(item.id)&&item.id!="") ? item.id : thiso.render+"_item_"+i;
        return id;
    };
    // Button
    function renderButton(item,id,cellid)
    {/*{{{*/
        //1. show
        var cls = isset(item.cls) ? 'mwt-btn '+item.cls : 'mwt-btn mwt-btn-primary';
        var style = isset(item.style) ? ' style="'+item.style+'"' : '';
        var code = '<button id="'+id+'" class="'+cls+'"'+style+'>'+item.label+'</button>';
        jQuery('#'+cellid).html(code);
        //2. event
        if(item.handler){
            jQuery('#'+id).unbind('click').click(item.handler);
        }
    }/*}}}*/
    // Select
    function renderSelect(item,id,cellid)
    {/*{{{*/
        var field=new MWT.SelectField({
            render  : cellid,
            id      : id,
            options : item.options ? item.options : [],
            value   : item.value,
            cls     : item.cls,
            style   : item.style
        }); 
        field.create();
        if(item.handler){
            field.on("change",item.handler);
        };
    }/*}}}*/
	// Selbox
	function renderSelbox(item,id,cellid)
    {/*{{{*/
        var field=new MWT.SelboxField({
            render  : cellid,
            id      : id,
            options : item.options ? item.options : [],
            value   : item.value,
            cls     : item.cls,
            style   : item.style,
			width   : item.width ? item.width : 100,
			popWidth: item.popWidth ? item.popWidth : 130,
			popHeight: item.popHeight ? item.popHeight : 170
        }); 
        field.create();
        if(item.handler){
            field.on("change",item.handler);
        };
    }/*}}}*/
    // Radiobtn
    function renderRadiobtn(item,id,cellid)
    {/*{{{*/
        var field=new MWT.RadiobtnField({
            render  : cellid,
            id      : id,
            options : item.options ? item.options : [],
            value   : item.value,
            cls     : item.cls,
            style   : item.style
        }); 
        field.create();
        if(item.handler){
            field.on("change",item.handler);
        };
    }/*}}}*/
    // Search
    function renderSearch(item,id,cellid)
    {/*{{{*/
        //1. show
        var btnid=id+"btn";
        var width=isset(item.width)?item.width:200;
        var style= ' style="width:'+width+'px;'+ (isset(item.style)?item.style:'') +'"';
        var cls = isset(item.cls) ? 'mwt-search '+item.cls : 'mwt-search';
        var value=isset(item.value)?' value="'+item.value+'"':"";
        var placeholder=isset(item.placeholder)?' placeholder="'+item.placeholder+'"':"";
        var code = '<div class="'+cls+'">'+
            '<input id="'+id+'" type="text" class="mwt-field"'+style+value+placeholder+'">'+
            '<i id="'+btnid+'" class="fa fa-search"></i>'+
        '</div>';
        jQuery('#'+cellid).html(code);
        //2. event
        if(item.handler){
            jQuery("#"+btnid).click(item.handler);
            jQuery("#"+id).change(item.handler);
        }
    }/*}}}*/
    // Datepicker
    function renderDatepicker(item,id,cellid)
    {/*{{{*/
        var field=new MWT.DatepickerField({
            render  : cellid,
            id      : id,
            options : item.options ? item.options : [],
            value   : item.value,
            cls     : item.cls,
            style   : item.style
        }); 
        field.create();
        if(item.handler){
            field.on("change",item.handler);
        };
    }/*}}}*/
    // Daterangepicker
    function renderDaterangepicker(item,id,cellid)
    {/*{{{*/
         var field=new MWT.DaterangepickerField({
            render  : cellid,
            id      : id,
            options : item.options ? item.options : [],
            value   : item.value,
            cls     : item.cls,
            style   : item.style
        }); 
        field.create();
        if(item.handler){
            field.on("change",item.handler);
        };
    }/*}}}*/
    // Timepicker
    function renderTimepicker(item,id,cellid)
    {/*{{{*/
         var field=new MWT.TimepickerField({
            render  : cellid,
            id      : id,
            options : item.options ? item.options : [],
            value   : item.value,
            cls     : item.cls,
            style   : item.style
        }); 
        field.create();
        if(item.handler){
            field.on("change",item.handler);
        };
    }/*}}}*/
}
MWT.extends(MWT.ToolBar, MWT.Bar);


