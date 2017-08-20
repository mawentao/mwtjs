/* 数据更新方式设置 */
define(function(require){
	var item,dialog,form;
	var srcmap = {};

	function init() {
		dialog = new MWT.Dialog({
            title  : '设置数据源',
            width  : 500,
            height : "auto",
            top    : 50,
            form   : form,
            bodyStyle: 'padding:4px',
            body   : extmsg.info('选择自动更新，系统将每天定时从指定数据表的指定字段更新数据。')+
				'<table class="mwt-formtab">'+
                  '<tr><td width="110">数据更新方式：</th>'+
					  '<td>'+
						'<label class="rdolabel"><input name="srcmode" type="radio" value="0"> 手动更新</label>'+
						'<label class="rdolabel"><input name="srcmode" type="radio" value="1"> 自动更新</label>'+
					  '</td>'+
				  '</tr>'+
				  '<tr id="srcmode-sel-tr"><td>数据源：</td>'+
					  '<td id="srcmode-sel-div"></td>'+
				  '</tr>'+
                '</table>',
            buttons: [
                {"label":"确定",cls:'mwt-btn-primary',handler:submit},
                {"label":"关闭",type:'close',cls:'mwt-btn-danger'}
            ]
        });
		dialog.on('open',function(){
			// 获取依赖此维度表的数据集
			ajax.post('dim_manage&action=get_src_table_list',{dim_table:item.table_name},function(res){
				if (res.retcode!=0) jQuery('#srcmode-sel-div').html('<span style="font-size:12px;color:red;">'+res.retmsg+'</span>');
				else {
					if (res.data.length==0) {
						jQuery('#srcmode-sel-div').html('<span style="font-size:12px;color:red;">没有数据集依赖此维度表</span>');
						return;
					}
					var opts = [];
					for (var i=0;i<res.data.length;++i) {
						var im = res.data[i];
						opts.push('<option value="'+im.src_table_id+'">'+
							im.tname+' ('+im.did_key+':'+im.dname_key+')'+'</option>');
						srcmap[im.src_table_id] = im;
					}
					var code = '<select id="srcmode-sel" class="form-control">'+opts.join('')+'</select>';
					jQuery('#srcmode-sel-div').html(code);
				}
			},true);
			// 设置更新方式
			if (item.src_table_id==0) {
				set_radio_value('srcmode',0);
			} else {
				set_radio_value('srcmode',1);
				set_select_value('srcmode-sel',item.src_table_id);
			}
			// 更新方式值改变时同步数据集选择器状态
			sync_src_mode();
			jQuery('[name=srcmode]').unbind('change').change(function(){
				sync_src_mode();
			});
		});
	}

	function sync_src_mode() {
		var sm = get_radio_value('srcmode');
		if (sm==0) {
			jQuery('#srcmode-sel-tr').hide();
		} else {
			jQuery('#srcmode-sel-tr').show();
		}
	}

	function submit() {
		var data = {
			table_name: item.table_name,
			src_table_id: get_radio_value('srcmode'),
			did_key: '',
			dname_key: ''
		};
		if (data.src_table_id!=0) {
			if (!mwt.$('srcmode-sel')) {
				mwt.notify('没有选择更新的数据源',1500,'danger');
				return;
			}
			data.src_table_id = get_select_value('srcmode-sel');
			if (!data.src_table_id) {
				mwt.notify('没有选择更新的数据源',1500,'danger');
				return;
			}
			var im = srcmap[data.src_table_id];
			data.did_key = im.did_key;
			data.dname_key = im.dname_key;
		}
		//print_r(data);
		ajax.post("t_datacube_table_dim&action=set_src_table",data,function(res){
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
