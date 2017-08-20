/*仪表板-属性面板-cubic配置*/
define(function(require){
	var data = require('../data');
	var cube = require('../../cube');
	var cubeid,cubeinfo;
	var cubicid,cubicinfo;

	// 指标配置
	function get_metric_config() {
		var code = '<tr><th><i class="sicon-bar-chart"></i> 指标'+
			'<i class="fa fa-caret-down pfoldicon" name="property-fold-btn" data-target="metric-property-ul"></i></th></tr>'+
		'<tr><td><ul id="metric-property-ul">'+
			'<li class="selall">'+
				'<label><input type="checkbox" name="allselcbx" data-target="cube-metric-cbx"> 全选</label>'+
			'</li>';
		for (var i=0;i<cubeinfo.metrics.length;++i) {
			var metric = cubeinfo.metrics[i];
			var checked = '';
			if (in_array(metric.mid,cubicinfo['metrics'])) {
				checked = 'checked';
			}
			code += '<li><label><input type="checkbox" name="cube-metric-cbx" data-mid="'+metric.mid+'" '+checked+'> '+
				metric.mname+help.get(metric.mdesc)+
			'</label></li>';
		}
		code += '</ul></td></tr>';
		return code;
	}

	// 筛选器默认值选择
	function get_filter_select(dimid,options,selval) {
		var sel = '<select name="cube-dim-filter-sel" class="second-column" id="cube-dim-filter-sel-'+dimid+'">';
		for (var i=0;i<options.length;++i) {
			var opt = options[i];
			var selected = (selval==opt.value) ? 'selected' : '';
			sel += '<option value="'+opt.value+'" '+selected+'>'+opt.text+'</option>';
		}
		sel += '</select>';
		return sel;
	}

	// 筛选维度配置
	function get_dim_config() {
		// 获取cube的所有维度筛选项
		var filters = [];
		ajax.post('design&action=cube_filters',{cubeid:cubicinfo.cubeid},function(res){
        	if (res.retcode==0) {
				filters = res.data;
       		}   
		},true);
		// render
		var code = '<tr><th><i class="sicon-hourglass"></i> 筛选器'+
			'<i class="fa fa-caret-down pfoldicon" name="property-fold-btn" data-target="filter-property-ul"></i></th></tr>'+
		'<tr><td><ul id="filter-property-ul">'+
			'<li class="selall">'+
				'<label><input type="checkbox" name="allselcbx" data-target="cube-dim-cbx"> 全选</label>'+
				'<span class="right-content" style="color:gray">' +
					'<span class="first-column">联动</span>'+
					'<span class="second-column">默认值</span>' +
				'</span>'+
			'</li>';
		//		'<span style="float:right;color:gray;">默认值</span></th></tr><tr><td><ul>';
		var selectedMap = cubicinfo['filter_dims'];
		var notAssociatedMap = cubicinfo['not_assoc_dims'];
		// debugger
		//for (var i=0;i<cubeinfo.dims.length;++i) {
		for (var i=0;i<filters.length;++i) {
			var item = filters[i];
			var checked = selectedMap[item.dimid] ? 'checked' : '';
			/*if (in_array(item.dimid,cubicinfo['filter_dims'])) {
				checked = 'checked';
			}*/
			var assco_checked = in_array(item.dimid, notAssociatedMap) ? '' : 'checked';
			var selval = selectedMap[item.dimid] ? selectedMap[item.dimid] : -1;
			code += '<li><label><input type="checkbox" name="cube-dim-cbx" data-dimid="'+item.dimid+'" '+checked+'>'+
				item.dimname+help.get(item.dimdesc)+'</label>'+
				'<span class="right-content">'+
					'<input type="checkbox" class="first-column" name="cube-dim-assoc-cbx" data-dimid="'+item.dimid+'" '+assco_checked+'>'+
					get_filter_select(item.dimid,item.data,selval)+
				'</span>'+
			'</li>';
		}
		code += '</ul></td></tr>';
		return code;
	}

	// 聚合维度配置
	function get_group_dim_config() {
		var lis = [];
		for (var i=0;i<cubeinfo.dims.length;++i) {
			var item = cubeinfo.dims[i];
			var checked = '';
			if (in_array(item.dimid,cubicinfo['group_dims'])) {
				checked = 'checked';
			}
			var code = '<li><label><input type="checkbox" name="cube-group-dim-cbx" data-dimid="'+item.dimid+'" '+checked+'>'+
							item.dimname+help.get(item.dimdesc)+
					'</label></li>';
			lis.push(code);
		}
		var code = '<tr><th><i class="sicon-pie-chart"></i> 分组'+
			'<i class="fa fa-caret-down pfoldicon" name="property-fold-btn" data-target="dim-group-property-ul"></i></th></tr>';
		if (lis.length==0) {
			code += '<tr><td style="color:gray;">无可选项</td></tr>';
		} else {
			code += '<tr><td><ul id="dim-group-property-ul">'+
			'<li class="selall">'+
				'<label><input type="checkbox" name="allselcbx" data-target="cube-group-dim-cbx"> 全选</label>'+
			'</li>'+lis.join('')+'</td></tr>';
			//code += '<tr><td><ul>'+lis.join('')+'</td></tr>';
		}
		return code;
	}


	var o={};
	// 加载某个控件的属性面板
	o.load=function(bodyid,_cubeid,_cubicid){
		cubeid = _cubeid;
		cubicid = _cubicid;
		cubeinfo = cube.getCube(cubeid);
		cubicinfo = cube.getCubic(cubicid);
		// body
		var code = '<table class="property-tab">'+
			'<tr><th><i class="sicon-social-dropbox"></i> 数据</th></tr>'+
			'<tr><td><a class="dataa" href="#/mart/cube~cubeid='+cubeid+'" target="_blank">'+cubeinfo.cubename+'</a></td></tr>'+
			'<tr><td class="partition"><hr></td></tr>'+
			get_dim_config()+
			'<tr><td class="partition"><hr></td></tr>'+
			get_metric_config()+
			'<tr><td class="partition"><hr></td></tr>'+
			get_group_dim_config()+
			'<tr><td class="partition"><hr></td></tr>'+
			'<tr><td><button id="cube-data-save-btn" class="mwt-btn mwt-btn-primary mwt-btn-sm radius" style="width:80px;">保存</button></td></tr>'+
		'</table>';
		jQuery('#'+bodyid).html(code);
		help.init();

		// 折叠按钮
		jQuery('[name=property-fold-btn]').unbind('click').click(function(){
			var jts = jQuery(this);
			var target=jts.data('target');
			var clsdown = 'fa-caret-down';
			var clsup = 'fa-caret-up';
			if (jts.hasClass(clsdown)) {
				jts.removeClass(clsdown).addClass(clsup);
				jQuery('#'+target).slideUp('fast');
			} else {
				jts.removeClass(clsup).addClass(clsdown);
				jQuery('#'+target).slideDown('fast');
			}
		});
		// 全选
		jQuery('[name=allselcbx]').unbind('change').change(function(){
			var jts = jQuery(this);
			var target=jts.data('target');
			var ckd = jts.is(':checked');
			jQuery('[name='+target+']').prop('checked',ckd);
		});
		// 保存按钮
		jQuery('#cube-data-save-btn').unbind('click').click(save);
	};

	// 保存
	function save() {
		//1. 指标
		var metrics = [];
		jQuery('[name=cube-metric-cbx]').each(function(){
			var id = jQuery(this).data('mid');
			if (jQuery(this).is(':checked')) { metrics.push(id); }
		});
		if (metrics.length==0) {
			mwt.notify('请至少选择一个指标',1500,'danger');
			return;
		}
		//2. 筛选维度
		var filter_dims = {};
        jQuery('[name=cube-dim-cbx]').each(function(){
            var id = jQuery(this).data('dimid');
            var v = get_select_value('cube-dim-filter-sel-'+id);
            if (jQuery(this).is(':checked')) {
                filter_dims[id] = v;
            }
        });
		if (filter_dims.length==0) filter_dims='';
		//3. 聚合维度
		var group_dims = [];
		jQuery('[name=cube-group-dim-cbx]').each(function(){
			var id = jQuery(this).data('dimid');
			if (jQuery(this).is(':checked')) { group_dims.push(id); }
		});
		//4. 关联维度
		var not_assoc_dims = [];
        jQuery('[name=cube-dim-assoc-cbx]').each(function(){
            var id = jQuery(this).data('dimid');
            if (!jQuery(this).is(':checked')) {
                not_assoc_dims.push(id);
            }
        });
		if (group_dims.length==0) group_dims='';
		if (not_assoc_dims.length==0) not_assoc_dims='';
		//5. 保存
		var params = {
			cubicid: cubicid,
			metrics: metrics,
			filter_dims: filter_dims,
			group_dims: group_dims,
			not_assoc_dims: not_assoc_dims
		};

		ajax.post('t_datacube_board_cubic&action=save_data_setting',params,function(res){
			if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
			else {
				mwt.notify('已保存',1500,'success');
				var domid = 'body-box-'+cubeid+'-'+cubicid;
				require('../cubic').showInBox(domid,cubeid,cubicid,true); //!< 刷新cubic box
				// 更新本地缓存
				cubicinfo.metrics = params.metrics;
				cubicinfo.filter_dims = params.filter_dims;
				cubicinfo.group_dims = params.group_dims;
				cubicinfo.not_assoc_dims = params.not_assoc_dims;
			}
		});
	};

	return o;
});
