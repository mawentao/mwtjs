/* info_panel.js, (c) 2017 mawentao */
define(function(require){ 
	var domid,cubeInfo;
	var form;
	var o={};

	o.init=function(_domid,_cubeInfo){
		domid=_domid;
		cubeInfo=_cubeInfo;
		var code = '<table class="tb2">'+
            '<tr><td colspan="15" class="partition"><i class="sicon-layers"></i> <b>Cube信息</b></td></tr>'+
			'<tr>'+
			  '<td>数据集'+help.get('Cube依赖的数据集')+'</td>'+
			  '<td colspan="5"><a class="grida" href="#/db/dataset_edit~tid='+cubeInfo.tableid+'" target="_blank">'+
						cubeInfo.tcomment+'</a></td>'+
			  '<td width="200" rowspan="3" align="center">'+
				'<button id="savebtn-'+domid+'" class="mwt-btn mwt-btn-xs mwt-btn-primary radius" style="padding:8px 20px;">保存</button>'+
				'&nbsp;<a class="mwt-btn mwt-btn-xs mwt-btn-primary radius" style="padding:8px 20px;" '+
					'href="#/mart/cube~cubeid='+cubeInfo.cubeid+'">预览</a></td>'+
			  '</td>'+
			'</tr>'+
			'<tr>'+
			  '<td width="90">Cube名称'+help.get('显示名称')+'</td>'+
              '<td id="cubename-'+domid+'"></td>'+ 
			  '<td width="60">主题'+help.get('Cube所属的主题分类')+'</td>'+
			  '<td width="150" id="subject-'+domid+'"></td>'+
			'</tr>'+
            '<tr><td>Cube备注</td>'+
              '<td colspan="5" id="cubedesc-'+domid+'"></td>'+
            '</tr>'+
          '</table>';
		jQuery("#"+domid).html(code);
		help.init();
		// init form
		form = new MWT.Form();
		form.addField('cubename',new MWT.TextField({
            render: "cubename-"+domid,
			value: '',
            errmsg: '输入Cube名称，不超过50个字符',
            checkfun: function(v){return v.length<=50;}
        }));
		form.addField('subject',new MWT.SelectField({
            render  : 'subject-'+domid,
            options : dict.get_wordlist_options('cube_subject'),
			style   : 'width:100%'
        }));
		form.addField('cubedesc',new MWT.TextField({
            render: "cubedesc-"+domid,
			value: '',
            errmsg: '输入Cube备注，不超过100个字符',
            checkfun: function(v){return v.length<=100;}
        }));
		form.create();
		form.set(cubeInfo);

		// 保存数据集基础信息
		jQuery('#savebtn-'+domid).unbind('click').click(save);
	};

	// 保存数据集基础信息
	function save() 
	{
		var params = form.getData();
		params.cubeid = cubeInfo.cubeid;
		ajax.post('t_datacube_cube&action=save_info',params,function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				mwt.notify('已保存',1500,'success');
			}
		});
	}

	return o;
});
