define(function(require){
	var item,dialog,form;
	var domid = 'db_dim_data_dialog';

	function init() {
		form = new MWT.Form();
		form.addField('did', new MWT.TextField({
            render: 'did-'+domid,
            value: '',
			empty: false,
            errmsg: '请输入维度ID，小于50个字符',
            checkfun: function(v){return v.length<=50;}
        }));
        form.addField('dname', new MWT.TextField({
            render: 'dname-'+domid,
            value: '',
            errmsg: '请输入维度名称，小于100个字符',
            checkfun: function(v){return v.length<=100;}
        }));

		dialog = new MWT.Dialog({
			render : domid,
            title  : '添加数据',
            width  : 550,
            height : "auto",
            top    : 50,
            form   : form,
            bodyStyle: 'padding:10px;',
            body   : '<table class="mwt-formtab"><tr>'+
                  '<td width="50" style="text-align:right;padding:0;">维度ID：</th>'+
				  '<td width="170" style="padding:0;"><div id="did-'+domid+'"></div></td>'+
                  '<td width="80" style="text-align:right;padding:0;">维度名称：</th>'+
				  '<td style="padding:0;"><div id="dname-'+domid+'"></div></td>'+
                '</table>',
            buttons: [
                {label:"提交",cls:'mwt-btn-primary',handler:submit},
                {label:"取消",type:'close'}
            ]
        });

		dialog.on('open',function(){
            form.create();
            form.reset();
            if (item.did!='') {
                dialog.setTitle("编辑数据");
                form.set(item);
				jQuery('#did-db_dim_data_dialogtxt').attr('readonly','readonly').css({'background':'#eee'});
				jQuery('#did-db_dim_data_dialogtxt-clear').remove();
            } else {
                dialog.setTitle("添加数据");
				jQuery('#did-db_dim_data_dialogtxt').removeAttr('readonly').css({'background':'#fff'});
				jQuery('#did-db_dim_data_dialogtxt-clear').show();
            }
        });
	}

	// 提交
	function submit() {
		var data = form.getData();
		data.table = item.table;
		ajax.post('dim_manage&action=save_dim_data',data,function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				dialog.close();
				require("./grid").query();
			}
		});
	}

	var o={};

	o.open=function(_item){
		item=_item;
		if (!dialog) init();
		dialog.open();
	};

	return o;
});
