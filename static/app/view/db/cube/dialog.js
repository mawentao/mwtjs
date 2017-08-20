define(function(require){
	var domid = 'db_cube_dialog';
	var dialog,form;

	function init() {
		form = new MWT.Form();
		form.addField('tableid',require('view/db/dataset/sel').get('tableid-'+domid));
        form.addField('cubename', new MWT.TextField({
            render: 'cubename-'+domid,
            value: '',
            empty   : false,
            errmsg  : "Cube名称不超过50个字符",
            checkfun: function(v){return v.length<=50;}
        }));
		form.addField('subject',new MWT.SelectField({
            render  : 'subject-'+domid,
            options : dict.get_wordlist_options('cube_subject'),
			style   : 'width:100%'
        }));
		form.addField('cubedesc',new MWT.TextField({
            render: "cubedesc-"+domid,
			type     : 'textarea',
            style    : 'width:100%;height:180px;',
			value: '',
            errmsg: '输入Cube备注，不超过100个字符',
            checkfun: function(v){return v.length<=100;}
        }));
		
		dialog = new MWT.Dialog({
			render : domid,
            title  : '<i class="fa fa-cube gridi"></i> 新建Cube',
            width  : 550,
            height : "auto",
            top    : 50,
            form   : form,
            bodyStyle: 'padding:4px',
            body   : '<table class="mwt-formtab">'+
                  '<tr><td width="100">数据集：</th><td><div id="tableid-'+domid+'"></div></td>'+
					  '<td width="100" class="tips"></td></tr>'+
                  '<tr><td width="100">Cube名称：</th><td><div id="cubename-'+domid+'"></div></td>'+
					  '<td width="100" class="tips"></td></tr>'+
                  '<tr><td>主题：</th><td><div id="subject-'+domid+'"></div></td>'+
					  '<td class="tips">主题分类</td></tr>'+
                  '<tr><td>Cube备注：</th><td><div id="cubedesc-'+domid+'"></div></td>'+
					  '<td class="tips">Cube的详细描述</td></tr>'+
                '</table>',
            buttons: [
                {"label":"提交",cls:'mwt-btn-primary',handler:submit},
                {"label":"取消",type:'close',cls:'mwt-btn-danger'}
            ]
        });
		dialog.on('open',function(){
			form.create();
			form.reset();
		});
	}

	function submit() {
		var data = form.getData();
		data.subject = get_select_value('subject-db_cube_dialogsel');
		ajax.post("cubeschema&action=create_cube",data,function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				dialog.close();
				require("./grid").query();
			}
		});
	}

	var o = {};
	o.open = function() {
		if (!dialog) init();
		dialog.open();
	};
	return o;
});
