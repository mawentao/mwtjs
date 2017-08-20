define(function(require){
	/* 左边指标和维度筛选区域 */
	var DimSelect=require('./DimSelect');
	var cubeInfo;
	var dimForm;   //!< 维度选择器Form

	// 指标筛选
	function get_metric_filters() {
		var code = '<tr><th><i class="sicon-bar-chart"></i> 指标'+
			'<i class="fa fa-caret-down pfoldicon" name="cube-fold-btn" data-target="metric-cube-ul"></i>'+
		'</th></tr>'+
		'<tr><td><ul id="metric-cube-ul">'+
			'<li class="selall">'+
			    '<label><input type="checkbox" name="allselcbx" data-target="metric-cube-cbx" checked> 全选</label>'+
			'</li>';
		for (var i=0;i<cubeInfo.metrics.length;++i) {
			var metric = cubeInfo.metrics[i];
			var checked = 'checked';  //!< 默认全选
			code += '<li><label><input type="checkbox" name="metric-cube-cbx" data-mid="'+metric.mid+'" '+checked+'> '+
				metric.mname+help.get(metric.mdesc)+
			'</label></li>';
		}
		code += '</ul></td></tr>';
		return code;
	};

	// 维度筛选
	function get_dim_filters() {
		var code = '<tr><th><i class="sicon-hourglass"></i> 维度'+
			'<i class="fa fa-caret-down pfoldicon" name="cube-fold-btn" data-target="filter-property-ul"></i></th></tr>'+
		'<tr><td><ul id="filter-property-ul">';/*+
			'<li class="selall">&nbsp;'+
				'<label style="float:right;"><input type="checkbox" name="allselcbx" data-target="dim-cube-cbx"> 分组</label>'+
			'</li>';*/
		if (cubeInfo.dims.length==0) {
			code += '<li>没有维度可供选择</li>'+
				'<ul></td></tr>';
			return code;
		}
		for (var i=0;i<cubeInfo.dims.length;++i) {
			var item = cubeInfo.dims[i];
			var checked = item.dimtable=='date' ? 'checked' : '';   //!< 默认只选中日期维度
			code += '<li style="margin-bottom:5px;">'+
				'<label><span class="dimlabel">'+item.dimname+'</span>'+help.get(item.dimdesc)+'</label>'+
			    '<label style="float:right;">'+
					'<input type="checkbox" class="dimgroupcbx" name="dim-cube-cbx" data-dimid="'+item.dimid+'" '+checked+'>'+
					'<span>分组</span>'+
				'</label>'+
				'<div id="cube-dim-filter-'+item.dimid+'"></div>'+
			'</li>';
		}
		code += '</ul></td></tr>';
		return code;
	}

	// 初始化维度选择器
	var fds = {};
	function init_dim_select() {
		fds = {};
		dimForm = new MWT.Form();
		if (cubeInfo.dims.length==0) return;
		for (var i=0;i<cubeInfo.dims.length;++i) {
			var dimItem = cubeInfo.dims[i];
			fds[i] = new DimSelect({
				render  : 'cube-dim-filter-'+dimItem.dimid,
				dimInfo : dimItem
				//format : 'yy/mm/dd',
				//style  : 'width:140px;float:left'
			});
			fds[i].on('change',function(){o.query();});   //!< 值变换后,自动query
			dimForm.addField(dimItem.dimkey,fds[i]);
		}
		dimForm.create();
	}



	var o={};

	o.init=function(domid,_cubeInfo) 
	{/*{{{*/
		cubeInfo = _cubeInfo;
		var code = '<table class="property-tab" style="margin-top:3px;">'+
			get_metric_filters()+
			'<tr><td class="partition"><hr></td></tr>'+
			get_dim_filters()+
		'</table>';
		jQuery('#'+domid).html(code);
		init_dim_select();
		mwt.popinit();
		
		// 折叠按钮
		jQuery('[name=cube-fold-btn]').unbind('click').click(function(){
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
	}/*}}}*/

	o.query=function()
	{
		try {
			var params = {
				cubeid: cubeInfo.cubeid,
				metrics: [],
				group_dims: [],
				filter_dims: {}
			};
			// 选择的指标
			jQuery('[name=metric-cube-cbx]').each(function(){
            	var id = jQuery(this).data('mid');
            	if (jQuery(this).is(':checked')) { params.metrics.push(id); }
        	});
			if (params.metrics.length==0) {
				throw new Error('请至少选择一个指标');
			}
			// 选择的维度分组
			var groupMap = {};
			jQuery('[name=dim-cube-cbx]').each(function(){
            	var id = jQuery(this).data('dimid');
            	if (jQuery(this).is(':checked')) { params.group_dims.push(id); }
        	});
			// 选择的维度筛选
			params.filter_dims = dimForm.getData();
			require('./cube_query').query(params);

		} catch(e) {
			mwt.notify(e.message,1500,'danger');
		}
	};

	return o;
});
