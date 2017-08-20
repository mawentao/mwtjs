/* db_dialog.js, (c) 2016 mawentao */
define(function(require){
	var item,dialog,form;

	function init() {
		form = new MWT.Form();
		form.addField('dbdesc', new MWT.TextField({
            render: 'dbdescdiv',
			style: 'box-sizing:border-box;',
            value: '',
			empty: false,
            errmsg: '请输入显示名称，小于50个字符',
			placeholder: '数据源列表显示名称',
            checkfun: function(v){return v.length<=50;}
        }));
        form.addField('dbhost', new MWT.TextField({
            render: 'hostdiv',
			style: 'box-sizing:border-box;',
            value: '',
            errmsg: '请输入数据库地址，小于50个字符',
			placeholder: '主机名或IP地址',
            checkfun: function(v){return v.length<=50;}
        }));
        form.addField('dbport', new MWT.TextField({
			type: 'tel',
            render: 'portdiv',
			style: 'box-sizing:border-box;width:100px;',
            value: '3306',
            errmsg: '请输入端口，小于50个字符',
			placeholder: '端口',
            checkfun: function(v){return v.length<=50;}
        }));
		form.addField('dbname', new MWT.TextField({
            render: 'dbnamediv',
			style: 'box-sizing:border-box;',
            value: '',
            errmsg: '请输入数据库名称，小于50个字符',
			placeholder: '数据库名称',
            checkfun: function(v){return v.length<=50;}
        }));
        form.addField('dbuser', new MWT.TextField({
            render: 'userdiv',
			style: 'box-sizing:border-box;',
            value: '',
            errmsg: '请输入用户名，小于50个字符',
			placeholder: '用户名',
            checkfun: function(v){return v.length<=50;}
        }));
        form.addField('dbpass', new MWT.TextField({
            render: 'passworddiv',
			type: 'password',
			style: 'box-sizing:border-box;',
            value: '',
            errmsg: '请输入密码，小于50个字符',
			placeholder: '密码',
            checkfun: function(v){return v.length<=50;}
        }));


		dialog = new MWT.Dialog({
            title  : '添加数据源',
            width  : 450,
            height : "auto",
            top    : 50,
            form   : form,
            bodyStyle: 'padding:10px;',
            body   : '<table class="mwt-formtab">'+
                  '<tr><td width="100">显示名称：</th><td><div id="dbdescdiv"></div></td><td width="50"> *</td></tr>'+
                  '<tr><td>数据库地址：</th><td><div id="hostdiv"></div></td><td> *</td></tr>'+
                  '<tr><td>端口：</th><td><div id="portdiv"></div></td><td> *</td></tr>'+
                  '<tr><td>数据库：</th><td><div id="dbnamediv"></div></td><td> *</td></tr>'+
                  '<tr><td>用户名：</th><td><div id="userdiv"></div></td><td> *</td></tr>'+
                  '<tr><td>密码：</th><td><div id="passworddiv"></div></td><td> *</td></tr>'+
                '</table>',
            buttons: [
                {label:"连接测试",cls:'mwt-btn-danger',handler:connect_test},
                {label:"提交",cls:'mwt-btn-primary',handler:submit},
                {label:"取消",type:'close'}
            ]
        });

		dialog.on('open',function(){
            form.create();
            form.reset();
            if (item.dbid) {
                dialog.setTitle("编辑数据源");
                form.set(item);
            } else {
                dialog.setTitle("添加数据源");
            }   
        });
	}

	// 连接测试
	function connect_test() {
		var data = form.getData();
		var msgid=mwt.notify('正在尝试连接...',0,'loading');
		setTimeout(function(){
			ajax.post('db&action=connect_test',data,function(res){
				mwt.notify_destroy(msgid);
				if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
				else mwt.notify('连接成功',1500,'success');
			});
		},1000);
	};

	// 提交
	function submit() {
		var data = form.getData();
		data['dbid'] = item.dbid;
		var msgid=mwt.notify('提交数据...',0,'loading');
		ajax.post('t_datacube_db&action=save',data,function(res){
			mwt.notify_destroy(msgid);
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				dialog.close();
				require("./grid_db").query();
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
