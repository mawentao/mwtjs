/* sql_save_dialog.js, (c) 2016 mawentao */
define(function(require){
	var form,dialog,data;

	function init() {
		form = new MWT.Form();
		form.addField('sqlname', new MWT.TextField({
            render: 'namediv',
            value: '',
            errmsg: '请输入SQL说明，不超过50个字符',
            checkfun: function(v){return v.length<=50;}
        }));
		dialog = new MWT.Dialog({
			render : 'sql-save-dialog-div',
            title  : '保存数据集',
            width  : 400,
            height : "auto",
            top    : 50,
            form   : form,
            bodyStyle: 'padding:10px;',
            body   : '<table class="mwt-formtab">'+
                  '<tr><td width="100">数据集名称：</td><td><div id="namediv"></div></td></tr>'+
                '</table>',
            buttons: [
                {label:"提交",handler:submit},
                {label:"关闭",type:'close',cls:'mwt-btn-danger'}
            ]
        });
		dialog.on('open',function(){
			form.set(data);
		});
	}

	function submit() {
		var params;
		if(data.tid != 0) {
			params = {
			    tid: data.tid,
				tname: data.sqlstatement,
				tcomment: get_text_value('namedivtxt')
			}
            ajax.post('t_datacube_table&action=save_sql_info', params, function (res) {
                if (res.retcode != 0) mwt.notify(res.retmsg, 1500, 'danger');
                else {
                    dialog.close();
                    mwt.notify('已保存', 1500, 'success');
                    window.location = "#/db/dataset";
                }
            });
        }else{
            params = {
                tcomment: get_text_value('namedivtxt'),
                dbid: data.dbid,
                tname: data.sqlstatement,
                ttype: 2 //固定为sql类型
            };
            ajax.post('t_datacube_table&action=create_table', params, function (res) {
                if (res.retcode != 0) mwt.notify(res.retmsg, 1500, 'danger');
                else {
                    dialog.close();
                    mwt.notify('已保存', 1500, 'success');
                    window.location = "#/db/dataset";
                }
            });
		}
	}

    var o={};
	o.open=function(_data){
		data=_data;
		if (!dialog) init();
		dialog.open();
	};
	return o;
});
