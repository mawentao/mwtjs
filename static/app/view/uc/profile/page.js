define(function(require){
	var form;

	function init(data) {
		form = new MWT.Form();
		form.addField('gender', new MWT.RadioField({
            render  : 'genderdiv',
            options : [{text:'保密',value:0},{text:"男",value:1},{text:"女",value:2}],
            value   : 0,
            errmsg  : '请选择性别',
            empty   : false
        }));
		form.addField('mobile', new MWT.TextField({
            render  : 'mobilediv',
			style   : 'width:200px;',
            value   : '',
            errmsg  : '',
            empty   : true,
			checkfun: function(v){return v.length<=20;}
        }));

		var code = ''+
		'<table class="uctfm">'+
			'<tr><th width="100">登录账号</th><td colspan="2">'+data.username+'</td></tr>'+
			'<tr><th>用户组</th><td colspan="2">'+data.grouptitle+'</td></tr>'+
			'<tr><th>性别</th><td colspan="2" id="genderdiv"></td></tr>'+
			'<tr><th>手机号</th><td colspan="2" id="mobilediv"></td></tr>'+
			'<tr><td></td><td><button id="subbtn" class="mwt-btn mwt-btn-primary mwt-btn-sm radius">保存</button></td><td></td></tr>'+
		'</table>';
		jQuery('#form-div').html(code);
		form.create();
		form.set(data);
		jQuery('#subbtn').click(function(){
			mwt.confirm('确定要提交保存吗？',function(res){
				if (res) {
					var data = form.getData();
					var msgid=mwt.notify('保存数据...',0,'loading');
					ajax.post('uc&action=profile_set',data,function(res){
						mwt.notify_destroy(msgid);
						if (res.retcode!=0) mwt.notify(res.retmsg,2000,'danger');
						else mwt.notify('设置成功',1500,'success');
					});
				}
			});
		});
	}

    var o = {};
	o.execute = function() {
		ajax.post('uc&action=profile',{},function(res){
			if (res.retcode!=0) mwt.alert(res.retmsg);
			else {
				init(res.data);
			}
		});
	};
    return o;
});
