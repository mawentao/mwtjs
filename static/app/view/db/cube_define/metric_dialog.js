define(function(require){
	var item,form,dialog;
	var domid = 'cube_define_metric_dialog';

	function init_form() {
		form = new MWT.Form();
		form.addField('mkey', new MWT.TextField({
			render      : 'mkey-'+domid,
			value       : '',
			empty       : false,
			errmsg      : "请输入指标字段名，不超过50个字符",
			placeholder : "指标字段名",
			checkfun    : function(v) { return v.length<=50; }
		}));
		form.addField('mname', new MWT.TextField({
			render      : 'mname-'+domid,
			value       : '',
			empty       : false,
			errmsg      : "请输入指标名，不超过50个字符",
			placeholder : "显示的指标名",
			checkfun    : function(v) { return v.length<=50; }
		}));
		form.addField('mdesc', new MWT.TextField({
			render      : 'mdesc-'+domid,
			value       : '',
			empty       : false,
			errmsg      : "请输入指标说明，不超过100个字符",
			placeholder : "指标说明",
			checkfun    : function(v) { return v.length<=100; }
		}));
		form.addField('mformat', new MWT.SelectField({
			render   : 'mformat-'+domid,
			options  : [
				{value:'0',text:'整数'},
				{value:'1',text:'保留1位小数'},
				{value:'2',text:'保留2位小数'},
				{value:'3',text:'保留3位小数'},
				{value:'4',text:'保留4位小数'},
				{value:'5',text:'保留5位小数'},
				{value:'100',text:'百分比'}
			],
			value : 0
		}));
		form.addField('mexpression', new MWT.TextField({
			type     : 'textarea',
			render   : 'mexpression-'+domid,
			value    : '',
			style    : 'width:100%;height:100px;',
			empty    : false,
			errmsg   : "请输入指标计算表达式，不超过200个字符",
			placeholder : "输入指标的计算表达式",
			checkfun : function(v) { return v.length<=200; }
		}));
		form.create();
	}

	function init() {
		dialog = new MWT.Dialog({
			render : domid,
            title  : '添加指标',
            width  : 500,
            top    : 50,
            buttons  : [
                {label:"提交",handler:submit},
                {label:"取消",type:'close',cls:'mwt-btn-danger'}
            ],
            body: '<table class="mwt-formtab">'+
				  '<tr><td width="90">指标字段名</th><td width="320"><div id="mkey-'+domid+'"></div></td><td>* </td></tr>'+
				  '<tr><td>指标名</th><td><div id="mname-'+domid+'"></div></td><td>* 用于显示</td></tr>'+
				  '<tr><td>指标说明</th><td><div id="mdesc-'+domid+'"></div></td><td>* </td></tr>'+
				  '<tr><td>格式化显示</th><td><div id="mformat-'+domid+'"></div></td><td>* </td></tr>'+
				  '<tr><td>计算表达式</th><td><div id="mexpression-'+domid+'"></div></td><td>* 可使用sum，avg等SQL函数</td></tr>'+
				'</table>'
        });
		dialog.create();
		init_form();
		dialog.on('open',function(){
			form.create();
			form.reset();
			if (item.mid) {
				dialog.setTitle("修改指标");
				form.set(item);
			} else {
				dialog.setTitle("添加指标");
			}
		});
	}

	// 提交
	function submit() {
		var data = form.getData();
		data.mid = item.mid;
		data.cubeid = item.cubeid;
		data.mname = dz_post_encode(data.mname);
		data.mdesc = dz_post_encode(data.mdesc);
		data.mexpression = dz_post_encode(data.mexpression);
		//print_r(data);
		ajax.post('t_datacube_cube_metrics&action=save_metric',data,function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				dialog.close();
				require('./metric_grid').query();
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
