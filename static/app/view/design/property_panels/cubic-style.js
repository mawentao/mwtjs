/*仪表板-属性面板-cubic配置-样式*/
define(function(require){
	var data = require('../data');
	var cube = require('../../cube');
	var CubicViewSelect = require('./CubicViewSelect');
	var cubeid,cubeinfo;
	var cubicid,cubicinfo;
	var cubicViewSelect;

	var o={};

	// 初始化属性样式面板
	o.load=function(bodyid,_cubeid,_cubicid){
		cubeid = _cubeid;
		cubicid = _cubicid;
		cubeinfo = cube.getCube(cubeid);
		cubicinfo = cube.getCubic(cubicid);

		var checked = cubicinfo.title_show==1 ? 'checked' : '';

		var code = '<table class="property-tab">'+
			'<tr><th><label><input type="checkbox" id="cube-title-cbx" '+checked+'> 显示标题</label></th></tr>'+
			'<tr><td><input type="text" class="form-control" id="cube-title-txt" value="'+cubicinfo.title+'"></td></tr>'+
			'<tr><td style="text-align:center">'+
			  '<div class="mwt-btn-group-radius title-align-btns">'+
    			'<button name="title-align-btn" data-v="1" class="mwt-btn mwt-btn-default mwt-btn-sm">'+
					'<i class="fa fa-align-left"></i></button>'+
    			'<button name="title-align-btn" data-v="2" class="mwt-btn mwt-btn-default mwt-btn-sm">'+
					'<i class="fa fa-align-center"></i></button>'+
    			'<button name="title-align-btn" data-v="3" class="mwt-btn mwt-btn-default mwt-btn-sm">'+
					'<i class="fa fa-align-right"></i></button>'+
  			  '</div>'+
			'</td></tr>'+
			'<tr><td class="partition"><hr></td></tr>'+
			'<tr><th><label>视图</label></th></tr>'+
			//'<tr><td>'+get_cube_view_list()+'</td></tr>'+
			'<tr><td><div id="cvsel-div"></div></td></tr>'+
			'<tr><td class="partition"><hr></td></tr>'+
			'<tr><td><button id="cube-style-save-btn" class="mwt-btn mwt-btn-primary mwt-btn-sm radius" style="width:80px;">保存</button></td></tr>'+
		'</table>';
		jQuery('#'+bodyid).html(code);
		
		// 视图组件选择器
		cubicViewSelect = new CubicViewSelect({render:'cvsel-div'});
		cubicViewSelect.init();
		cubicViewSelect.activeView(cubicinfo.cvid);
		cubicViewSelect.on('change',function(){
			var cvid = cubicViewSelect.getActiveViewId();
			var cv = require('../cubic').getCubicView(cubicid);
			cv.setCvid(cvid);
		});

		// 对齐按钮
		set_title_align(cubicinfo.title_align);
		jQuery('[name=title-align-btn]').unbind('click').click(function(){
			var v = jQuery(this).data('v');
			set_title_align(v);
		});
		// 保存
		jQuery('#cube-style-save-btn').unbind('click').click(save);
	};

	// 设置对齐方式
	var title_align=1;
	function set_title_align(v) {
		jQuery('[name=title-align-btn]').removeClass('active');
		jQuery('[name=title-align-btn][data-v='+v+']').addClass('active');
		title_align=v;
	}

	// 保存
	function save()
	{
		cubicinfo.title = get_value('cube-title-txt');
		cubicinfo.title_show = jQuery('#cube-title-cbx').is(':checked') ? 1 : 0;
		cubicinfo.title_align = title_align;
		cubicinfo.cvid = cubicViewSelect.getActiveViewId();
		var params = get_parameters(cubicinfo,['cubicid','title','title_show','title_align','cvid']);
		//print_r(params);
		ajax.post('t_datacube_board_cubic&action=save_style_setting',params,function(res){
			if(res.retcode!=0)mwt.notify(res.retmsg,1500,'danger');
			else {
				mwt.notify('已保存',1500,'success');
				// 样式更改,不用重新创建视图组件
				var cv = require('../cubic').getCubicView(cubicid);
				cv.showTitle();
				cv.setCvid(cubicinfo.cvid);
			}
		});
	}

	return o;
});
