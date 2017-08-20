define(function(require){
	var form;

	function init() {
		form = new MWT.Form();
		form.addField('oldpass',new MWT.TextField({
        	render   : 'oldpass-div',
			type     : 'password',
			style    : 'width:210px;padding:0 5px;',
			value    : '',
			empty    : false,
			errmsg   : "请输入旧密码",
			placeholder: '旧密码',
			checkfun : function(v) { return v.length<=50; }
			}));
		form.addField('newpass',new MWT.TextField({
			render   : 'newpass1-div',
			type     : 'password',
			style    : 'width:210px;padding:0 5px;',
			value    : '',
			empty    : false,
			errmsg   : "请输入新密码",
			placeholder: '新密码',
			checkfun : function(v) { return v.length<=50; }
		}));
		form.addField('newpass2',new MWT.TextField({
			render   : 'newpass2-div',
			type     : 'password',
			style    : 'width:210px;padding:0 5px;',
			value    : '',
			empty    : false,
			errmsg   : "请再次输入新密码",
			placeholder: '重复新密码',
			checkfun : function(v) { return v.length<=50; }
		}));
		form.addField('seccode',new MWT.TextField({
			render   : 'seccode-div',
			type     : 'text',
			style    : 'width:80px;padding:0 5px;',
			value    : '',
			empty    : false,
			errmsg   : "请输入验证码",
			placeholder: '验证码',
			checkfun : function(v) { return v.length>0; }
		}));
		form.create();
		// change seccode
		jQuery('#scodebtn').click(function(){
			jQuery(this).attr('src',dz.seccodeurl+'&tm='+time());
		});
		// submit
		jQuery('#subbtn').click(submit);
	}

	function submit() {
		jQuery('#errmsgdiv').html('');
		var params = form.getData();
		if (params.newpass!=params.newpass2) {
			jQuery('#errmsgdiv').html('两次输入的密码不一致');
			return;
		}
		if (params.newpass==params.oldpass) {
			jQuery('#errmsgdiv').html('新密码与旧密码不可以相同');
			return;
		}
		jQuery('#subbtn').unbind('click').html('正在提交...');
		ajax.post('uc&action=changepass',params,function(res){
			//print_r(res);
			if (res.retcode!=0) {
				jQuery('#errmsgdiv').html(res.retmsg);
				jQuery('#subbtn').html('提交').click(submit);
			} else {
				MWT.alert('密码已修改，请使用新密码重新登录', function(){
					window.location.reload();
				});
			}
		});
	}

    var o = {};
	o.execute = function() {
		var code = '<div id="errmsgdiv" style="color:red;font-size:13px;padding:6px 100px;"></div>'+
		'<table class="uctfm">'+
			'<tr><th width="100">旧&nbsp;密&nbsp;码</th><td colspan="2"><div id="oldpass-div"></div></td></tr>'+
			'<tr><th>新&nbsp;密&nbsp;码</th><td colspan="2"><div id="newpass1-div"></div></td></tr>'+
			'<tr><th>确认新密码</th><td colspan="2"><div id="newpass2-div"></div></td></tr>'+
			'<tr><th>验&nbsp;证&nbsp;码</th><td width="120"><div id="seccode-div"></div></td>'+
                '<td><img src="'+dz.seccodeurl+'" style="width:120px;height:40px;border-radius:2px;cursor:pointer;" id="scodebtn"></td></tr>'+
			'<tr><td></td><td><button id="subbtn" class="mwt-btn mwt-btn-primary mwt-btn-sm radius">提交</button></td><td></td></tr>'+
		'</table>';
		jQuery('#form-div').html(code);
		init();
	};
    return o;
});
