/* 列项定义 */
define(function(require){
	var dim_dialog=require("./dim_dialog");
	var tableid,store;
	var domid,tableInfo;

	function enableSave() {jQuery("#svbtn").removeAttr('disabled');}
	function disableSave() {jQuery("#svbtn").attr('disabled','disabled');}

	function getCtypeSelect(i,v) {
		var options = [
			[4,'日期维度'],
			[2,'维度ID'],
			[3,'维度名称'],
			[5,'维度ID+名称'],
			[1,'指标']
		];
		var code = '<select name="ctype" class="form-control" data-idx="'+i+'">';
		for (var i=0;i<options.length;++i) {
			var im=options[i];
			var sed = (v==im[0]) ? 'selected' : '';
			code += '<option value="'+im[0]+'" '+sed+'>'+im[1]+'</option>';
		}
		code += '</select>';
		return code;
	}

	// 启用开关
	function getDisableSwitch(i,v) 
	{/*{{{*/
		var checked = v==0 ? 'checked' : '';
		var code = '<label class="mwt-cbx-switch-plain" style="width:40px;height:18px;">'+
			'<input name="disable_switch" data-idx="'+i+'" type="checkbox" '+checked+'><span><i></i></span></label>';
		return code;
	}/*}}}*/

	// 维度选择器
	function getDimSelect(i,did,dname,ctype) 
	{/*{{{*/
		var title = (dname && dname!="null") ? dname : '未指定';
		var display = (ctype==2 || ctype==3 || ctype==5) ? "block" : "none";
		var code = '<button name="dimbtn" class="mwt-btn mwt-btn-default mwt-btn-xs radius" data-idx="'+i+'"'+
            ' style="width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:3px 0;display:'+display+'">'+
            title+'</button>';
		return code;
	}/*}}}*/
	
	function show() {
		var code = '';
		for (var i=0; i<store.size(); ++i) {
			var im = store.get(i);
			code += '<tr><td>'+(i+1)+'.</td>'+
				'<td>'+im.cname+'</td>'+
				'<td><input data-idx="'+i+'" type="text" class="form-control" name="ccomment" value="'+im.ccomment+'"></td>'+
				'<td>'+getCtypeSelect(i,im.ctype)+'</td>'+
				'<td align="center">'+getDimSelect(i,im.dim_table,im.dim_name,im.ctype)+'</td>'+
				'<td align="center">'+getDisableSwitch(i,im.disable)+'</td>'+
			'</tr>';
		}
		jQuery('#colbody').html(code);
		jQuery('[name=ccomment]').unbind('change').change(function(){
			var idx = jQuery(this).data('idx');
			var v = jQuery(this).val();
			if (v.trim()=='') {
				jQuery(this).val('').focus();
			} else {
				store.root[idx]['ccomment']=v;
				enableSave();
			}
		});
		// 维度类型选择更改
		jQuery('[name=ctype]').unbind('change').change(function(){
			var idx = jQuery(this).data('idx');
			var v = jQuery(this).val();
			store.root[idx]['ctype']=v;
			enableSave();
			if (v==2 || v==3 || v==5) {
				jQuery('[name=dimbtn][data-idx='+idx+']').show();
			} else {
				jQuery('[name=dimbtn][data-idx='+idx+']').hide();
			}
		});
		// 启用开关
		jQuery('[name=disable_switch]').unbind('change').change(function(){
			var idx = jQuery(this).data('idx');
			var ckd = jQuery(this).is(':checked');
			var v = ckd ? 0 : 1;
			store.root[idx]['disable']=v;
			enableSave();
		});
		// 选择维度
		jQuery('[name=dimbtn]').unbind('click').click(function(){
			var jbtn = jQuery(this);
			var idx = jbtn.data('idx');
			dim_dialog.open(function(diminfo){
				var dimid = diminfo.table_name;
				var im = store.root[idx];
				if (dimid!=im.did) {
					im.dim_table = dimid;
					im.dim_name = diminfo.dim_name;
					//im.updatemode = diminfo.updatemode;
					jbtn.html(im.dim_name);
					store.root[idx] = im;
					enableSave();
				}
			});
		});
	}

	// 保存字段定义
	function submit() 
	{/*{{{*/
		//1. 收集并校验定义参数
		var cids = [];
		var ccomments = [];
		var ctypes = [];
		var dimids = [];
		var disables = [];
		var dateDimNum = 0;  //!< 日期维度定义个数
		var dcDimMap = {};
		for (var i=0; i<store.size(); ++i) {
			var im = store.get(i);
			cids.push(im.cid);
			ccomments.push(dz_post_encode(im.ccomment));
			ctypes.push(im.ctype);
			dimids.push(im.dim_table);
			disables.push(im.disable);
			if (im.ctype==4 && im.disable==0) { ++dateDimNum; }
			if (im.ctype==2 || im.ctype==3 || im.ctype==5) {
				if (im.dim_table==0) {
					mwt.notify(im.cname+"字段未指定维度",1500,'danger');
					return;
				}
				/*
				// 导出表的维度ID和维度名称
				if (im.updatemode==1) {
					if (im.ctype==2 || im.ctype==3) {
						if (!dcDimMap[im.dname]) dcDimMap[im.dname]={};
						dcDimMap[im.dname][im.ctype] = im.cname;
					}
				}*/
			}
			//print_r(im);
		}
		/*if (dateDimNum!=1) {
			MWT.alert("必须且只能定义并启用一个日期维度");
			return;
		}
		for (var dname in dcDimMap) {
			var im=dcDimMap[dname];
			if (!im['2'] || !im['3']) {
				MWT.alert("自定义维度 ["+dname+"] 必须同时指定维度ID和维度名称");
				return;
			}
		}*/
		//2. 提交保存
		var params = {
			tid: tableInfo.tid,
			cid: cids,
			ccomment: ccomments,
			ctype: ctypes,
			dim_table: dimids,
			disable: disables
		};
		ajax.post("t_datacube_table_columns&action=savecolumns",params,function(res){
			if (res.retcode!=0) { mwt.notify(res.retmsg,1500,'danger'); }
			else {
				mwt.notify("已保存",1500,'success');
				disableSave();
			}
		});
	}/*}}}*/

	// 同步元数据表字段
	function syncColumns() {
		ajax.post('t_datacube_table_columns&action=synccolumns',{tid:tableInfo.tid},function(res){
			if (res.retcode!=0) {
				mwt.notify(res.retmsg,1500,'danger');
			} else {
				mwt.notify("已同步",1500,'success');
				setTimeout(function(){
					window.location.reload();
				},1000);
			}
		});
	}

    var o = {};
	o.init = function(_domid,_tableInfo) {
		domid = _domid;
		tableInfo = _tableInfo;
		var code = '<table class="tb2" style="margin-bottom:10px;">'+
			'<tr><td colspan="5" class="partition" style="padding:0 10px;">数据表字段定义'+
					'<span id="cols_total_span"></span>'+
				'</td>'+
				'<td width="150" class="partition" style="padding:3px 10px;" align="right">'+
					'<button id="syncbtn" class="mwt-btn mwt-btn-primary mwt-btn-sm">'+
						'<i class="sicon-refresh"></i> 同步物理数据表字段</button>'+
				'</td>'+
            '</tr>'+
			'<tr height="40">'+
				'<td width="10"></td>'+
				'<td width="160"><b>字段名</b></td>'+
				'<td><b>字段描述</b></td>'+
				'<td width="120"><b>字段性质</b></td>'+
				'<td width="180" align="center"><b>维度</b></td>'+
				'<td width="80" align="center"><b>启用</b></td>'+
            '</tr>'+
			'<tbody id="colbody"></tbody>'+
			'<tr><td colspan="5" style="border-bottom:none;">'+
				'<button id="svbtn" disabled class="mwt-btn mwt-btn-xs mwt-btn-primary radius" style="padding: 2px 20px;">保存</td></tr>'+
		  '</table>';
		jQuery("#"+domid).html(code);
		store = new MWT.Store();
		store.on('load',show);
		jQuery('#svbtn').click(submit);
		jQuery('#syncbtn').click(syncColumns);

		// 
		ajax.post("t_datacube_table_columns&action=query",{tid:tableInfo.tid},function(res){
            if (res.retcode!=0) {
                mwt.notify(res.retmsg,1500,'danger');
            } else {
                //showTableSchema(res.data.annex);
                o.show(res.data.root);
				var cc = ' （共<b>'+res.data.totalProperty+'</b>个字段）';
				jQuery('#cols_total_span').html(cc);
            }
        }); 
	};
	o.show = function(data) {
		store.load(data);
	};
    return o;
});
