/* dialog.js */
define(function(require){
	var item,dialog,form;

	function init() {
		form = new MWT.Form();
        form.addField('table_name', new MWT.TextField({
            render: 'dtablename',
            value: '',
            empty   : false,
            errmsg: '维度表名仅支持字母,数字和下划线,且不超过128个字符',
            checkfun: function(v){
				var reg = new RegExp("^([a-z|A-Z|0-9|_]){1,128}$");
				return reg.test(v);
			}
        }));
        form.addField('dim_name', new MWT.TextField({
            render  : 'dnamediv',
            value   : '',
            empty   : false,
            errmsg  : "维度名不超过50个字符",
            checkfun: function(v){return v.length<=50;}
        }));
		
		dialog = new MWT.Dialog({
            title  : '新建维度',
            width  : 500,
            height : "auto",
            top    : 50,
            form   : form,
            bodyStyle: 'padding:4px',
            body   : '<table class="mwt-formtab">'+
                  '<tr><td width="80">维度名称：</th>'+
                      '<td><div id="dnamediv"></div></td>'+
					  '<td width="120" class="tips">用于显示</td></tr>'+
                  '<tr><td>表名：</th><td><div id="dtablename"></div></td>'+
					  '<td class="tips">填写字母、数字和下划线</td></tr>'+
/*                  '<tr><td>数据更新源：</th>'+
                      '<td><label><input name="dim_dialog_update_rad" type="radio" value="0">手动更新</label>&nbsp;&nbsp;'+
						  '<label><input name="dim_dialog_update_rad" type="radio" value="1">数据集</label>'+
					  '</td></tr>'+*/
                '</table>',
            buttons: [
                {"label":"确定",cls:'mwt-btn-primary',handler:submit},
                {"label":"关闭",type:'close',cls:'mwt-btn-danger'}
            ]
        });
		dialog.on('open',function(){
			form.create();
			form.reset();
			if (item.table_name!='') {
				dialog.setTitle("修改维度");
				form.set(item);
				jQuery("#dtablenametxt").attr('disabled','disabled').css({'background':'#eee'});
			} else {
				dialog.setTitle("新建维度");
				jQuery("#dtablenametxt").removeAttr('disabled').css({'background':'#fff'});
			}
		});
	}

	function submit() {
		var data = form.getData();
//		print_r(data);
		var act = item.table_name=='' ? 'create_table' : 'save_table';
		ajax.post("t_datacube_table_dim&action="+act,data,function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				dialog.close();
				require("./grid").query();
			}
		});
	}

	var o = {};
	o.open = function(_item) {
		item = _item;
		if (!dialog) init();
		dialog.open();
	};
	return o;
});
