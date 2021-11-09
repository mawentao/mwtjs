
/**
 * Grid列模型
 */
MWT.Grid.ColumnModel=function(opt)
{
    this.columns=[];

    if(opt){
        this.columns=opt;
    }

    this.getColumns=function(){return this.columns;};

    // 获取多选框列样式
    this.getMultiSelectColumnStyle=function(isHead) {
        var cls = 'mwt-fix-col-left';
        if (isHead) cls+=" mwt-fix-row-top";
        return 'style="text-align:center;padding:0;" class="'+cls+'"';
    };

    // 获取列样式
    this.getTdStyle=function(idx,isHead,isFixedTop) {
        var column = this.columns[idx];
        var attrs = [];
        //1. align
        var align = isset(column.align) ? column.align : 'left';
        attrs.push('align="'+align+'"');
        //2. valign
        if (isset(column.valign)) attrs.push('valign="'+column.valign+'"');
        //3. style
        if (isset(column.style) && column.style!="") attrs.push('style="'+column.style+'"');
        //4. class
        var cls = [];
        if (isset(column.cls) && column.cls!="") cls.push(column.cls);
        if (column.fixed) {
            var cs = column.fixed=="right" ? "mwt-fix-col-right" : "mwt-fix-col-left";
            cls.push(cs);
        }
        if (isHead) {
            if (column.sort) cls.push('grid-sort');
            if (isFixedTop) cls.push('mwt-fix-row-top');
        }
        if (cls.length>0) attrs.push('class="'+cls.join(" ")+'"');
        return attrs.join(" ");
    };

    // 获取columnGroup
    this.getColgroup=function(enableMultiSelect){
        var cols = [];
        // 多选框
        if(enableMultiSelect) {cols.push('<col width="30">');}
        // 显示的列
        var columns = this.getColumns();
        var cn = columns.length;
        for(var i=0;i<cn;++i){
            var column=columns[i];
            if (column.hide){continue;}
            var width= column.width ? column.width : 'auto';
            cols.push('<col width="'+width+'">');
        }
        return '<colgroup>'+cols.join('')+'</colgroup>';
    };

    // 获取表头
    this.getThead=function(enableMultiSelect,grid_chkbox_name,thname,isFixTop) {
        var ths = [];
        // 多选框
        if (enableMultiSelect) {
            ths.push('<th '+this.getMultiSelectColumnStyle(true)+'>'+
                '<input type="checkbox" onchange="mwt.set_checkbox_checked(\''+grid_chkbox_name+'\',this.checked);" class="mwt-grid-checkbox"/>' +
            '</th>');
        }
        // 显示的列
        var columns=this.getColumns();
        var cn = columns.length;
        for(var i=0;i<cn;++i){
            var column=columns[i];
            if (column.hide){continue;}
            var th = "<th name='"+thname+"' "+this.getTdStyle(i,true,isFixTop);
            if (column.poptitle) th += " pop-title='"+column.poptitle+"' ";
            th+=" data-id='"+column.dataIndex+"'>"+column.head+"</th>";
            ths.push(th);
        }
        return '<tr>'+ths.join('')+'</tr>';
    };

    // 显示总列数
    this.getColumnCount=function(enableMultiSelect) {
        var cnt = 0;
        if (enableMultiSelect) cnt++;
        var columns=this.getColumns();
        var cn = columns.length;
        for(var i=0;i<cn;++i) {
            var column = columns[i];
            if (column.hide) continue;
            ++cnt;
        }
        return cnt;
    };
};

MWT.Grid.RowNumberer=function(opt)
{
    this.head = '';
    this.dataIndex = '';
    this.width = 50;
    this.align = 'left';
    this.style = "color:#999;font-family:Helvetica;";
    if (opt) {
        if(opt.style) this.style=opt.style;
        if(opt.width) this.width=opt.width;
        if(opt.align) this.align=opt.align;
    }
    this.render=function(v,item,storeIdx,pagebar) {
        var linen = parseInt(storeIdx)+1;
        if (pagebar && pagebar.start) linen += pagebar.start;
        return linen+'.';
    };
};

// 表格字段渲染函数
MWT.GridRender = {
    money: function(v) {
        var n = parseFloat(v);
        if (n<1000) {
            n =  parseInt(n*100)/100;
            return n+'元';
        } else {
            n = n/10000;
            n = parseInt(n*100)/100;
            return n+'万元';
        }
    },
    integer: function(v) {
        return number_format(v);
    },
    percent: function(v) {
        var n = v*100;
        return number_format(n,2)+'%';
    },
    datetime: function(v,color) {
        if (!v) return '';
        if (!color || !is_string(color)) color = '#999';
        return '<span style="color:'+color+';font: 12px Tahoma;">'+v.substr(0,16)+'</span>';
    },
    date: function(v,color) {
        if (!v) return '';
        var dt = v.substr(0,10);
        if (dt=='0000-00-00'||dt=='1970-01-01') {
            return '';
        }
        if (!color || !is_string(color)) color = '#999';
        return '<span style="color:'+color+'">'+dt+'</span>';
    },
    second: function(v) {
        var rs = [];
        if (v>=86400) {
            rs.push(parseInt(v/86400)+'天');
            v = v%86400;
        }
        if (v>=3600) {
            rs.push(parseInt(v/3600)+'小时');
            v = v%3600;
        }
        if (v>=60) {
            rs.push(parseInt(v/60)+'分钟');
            v = v%60;
        }
        if (v!=0 || rs.length==0) {
            rs.push(v+'秒');
        }
        return rs.join('');
    },
    fileSize: function(v) {
        var bytes = parseInt(v);
        if (bytes === 0) return '0 B';
        var k = 1024;
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
};

