define(function(require){
	var item,form,dialog;
	var domid="cube_define_dim_dialog";

	function init_form() {
		form = new MWT.Form();
		form.addField('dimname', new MWT.TextField({
			render      : 'dimname-'+domid,
			value       : '',
			empty       : false,
			errmsg      : "请输入维度名称，不超过50个字符",
			placeholder : "维度名称",
			checkfun    : function(v) { return v.length<=50; }
		}));
		form.addField('dimdesc', new MWT.TextField({
			render      : 'dimdesc-'+domid,
			value       : '',
			empty       : false,
			errmsg      : "请输入维度描述，不超过100个字符",
			placeholder : "维度描述",
			checkfun    : function(v) { return v.length<=100; }
		}));
		/*form.addField('is_group', new MWT.SelectField({
			render   : 'is_group-'+domid,
			style    : 'width:100%',
			options  : [
				{value:'0',text:'不可分组'},
				{value:'1',text:'可选分组'},
				{value:'2',text:'强制分组'}
			],
			value : 0
		}));*/
		form.create();
	}

	function init() {
		dialog = new MWT.Dialog({
            title  : '修改维度',
            width  : 420,
            top    : 50,
            buttons  : [
                {label:"提交",cls:'mwt-btn-primary',handler:submit},
                {label:"取消",type:'close'}
            ],
            body: '<table class="mwt-formtab">'+
				  '<tr><td>维度名称</th><td width="320"><div id="dimname-'+domid+'"></div></td><td>*</td></tr>'+
				  '<tr><td>维度描述</th><td><div id="dimdesc-'+domid+'"></div></td><td>*</td></tr>'+
//				  '<tr><td>维度分组</th><td><div id="is_group-'+domid+'"></div></td><td>*</td></tr>'+
				'</table>',
        });
		dialog.create();
		init_form();
		dialog.on('open',function(){
			form.create();
			form.reset();
			if (item.dimid) {
				form.set(item);
			} else {
				dialog.close();
			}
		});
	}

	// 提交
	function submit() {
		var data = form.getData();
		data.dimid = item.dimid;
		data.dimname = dz_post_encode(data.dimname);
		data.dimdesc = dz_post_encode(data.dimdesc);
		ajax.post('t_datacube_cube_dims&action=save_dim',data,function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				dialog.close();
				require('./dim_grid').query();
			}
		});
	}

	var o={};
	o.open = function(_item) {
		item=_item;
		if (!dialog) init();
		dialog.open();
	};
	return o;
});
