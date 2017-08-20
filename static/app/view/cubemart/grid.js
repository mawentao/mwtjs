define(function(require){

// grid不是单例,需要定义成类
function MartGrid(domid,footbarid,_callfun)
{
	var store,pagebar,active_subject=0;
	var o=this;
	this.callfun=_callfun;
	
	// 显示主题筛选项
	function show_subject_sel() 
	{/*{{{*/
		var subjects = dict.get_wordlist('cube_subject');
		var lis = [];
		var subject_stat = store.annex['subject_stat'];
		var total = 0;
		for (var i=0;i<subjects.length;++i) {
			var im=subjects[i];
			var id = im.word_id;
			var num = subject_stat[id] ? subject_stat[id] : 0;
			total+=num;
			var cls = active_subject==id ? 'class="active"' : '';
			var code = '<li name="subject-opt" '+cls+' data-id="'+id+'">'+im.word+'('+num+')'+'</li>';
			lis.push(code);
		}
		var all = '<li name="subject-opt" data-id="0" '+(active_subject==0 ? 'class="active"' : '')+'>全部('+total+')</li>';
		lis.unshift(all);

		var code = '<table class="seltab"><tr>'+
					'<th>主题：</th>'+
					'<td><ul>'+lis.join('')+'</ul></td>'+
				'</tr></table>';
		jQuery('#optpanel-'+domid).html(code);
		jQuery('[name="subject-opt"]').unbind('click').click(function(){
			var id = jQuery(this).data('id');
			active_subject=id;
			o.query();
		});
	}/*}}}*/

	// 显示列表
	function show() 
	{/*{{{*/
		var n = store.size();
		if (n==0) {
			jQuery('#ul-'+domid).html('<p style="text-align:center;color:gray;font-size:12px;">查询记录为空</p>');
			return;
		}
		var lis = [];
		var cubeimg = dz.pluginpath+'/template/static/datacube.png';
		var subjectMap = dict.get_wordmap('cube_subject');
		for (var i=0;i<n;++i) {
			var im = store.get(i);
			var url = '#/mart/cube~cubeid='+im.cubeid;
			var ctime = strtotime(im.ctime);
			var ctime = date('Y-m-d',ctime);
			var subject = subjectMap[im.subject] ? subjectMap[im.subject] : '其他';
			var	code = '<tr name="mart-cube-li-'+domid+'" data-cubeid="'+im.cubeid+'">'+
				  '<td width="70"><img src="'+cubeimg+'"></td>'+
				  '<td>'+
					'<span style="font-size:12px;color:#0D85BB">['+subject+']</span> '+
					'<span class="title">'+im.cubename+'</span><br>'+
					//'<span class="desc">'+im.cubedesc+'</span><br>'+
					'<span class="desc">维度('+im.dimCount+'个)：'+im.dims+'</span><br>'+
					'<span class="desc">指标('+im.metricCount+'个)：'+im.metrics+'</span>'+
				  '</td>'+
				  '<td width="100" align="center" style="vertical-align:middle;">'+
					'<span class="author">'+im.username+'</span>'+
					'<span class="time">'+ctime+'</span>'+
				  '</td>'+
				'</tr>';
			lis.push(code);
		}
		jQuery('#ul-'+domid).html(lis.join(''));
		// 点击cube
		jQuery('[name="mart-cube-li-'+domid+'"]').unbind('click').click(function(){
			var cubeid = jQuery(this).data('cubeid');
			var idx = store.indexOf('cubeid',cubeid);
			var item = store.get(idx);
			//print_r(item);
			if (o.callfun) {
				o.callfun(item);
				return;
			}
			window.location = '#/mart/cube~cubeid='+cubeid;
		});
	}/*}}}*/

	this.init=function() 
	{/*{{{*/
		var code = '<div id="optpanel-'+domid+'" style="padding:10px;"></div>'+
			'<div style="margin:5px 10px;">'+
			  '<table class="cubemarttb">'+
				'<thead>'+
				  '<tr><th align="center">主题</th><th align="left">cube</th><th align="center">作者</th></tr>'+
				'</thead>'+
				'<tbody id="ul-'+domid+'"></tbody>'+
			  '</table>'+
			'</div>'
		jQuery('#'+domid).html(code);

		store = new MWT.Store({
			url: ajax.getAjaxUrl('cubemart&action=query'),
			beforeLoad: store_before_load,
			afterLoad: store_after_load
        });
		pagebar = new MWT.Pagebar({
			render : footbarid,
      		store  : store,
      		pageSize: 50
  		});
		store.on('load',function(){
			show_subject_sel();
			show();
		});	
		this.query();
		jQuery('#so-key-'+domid).unbind('change').change(o.query);
	};/*}}}*/

	// 查询
	this.query=function() 
	{/*{{{*/
		store.baseParams = {
            key: get_value('so-key-'+domid),
			subject: active_subject
        };
		pagebar.changePage(1);
	};/*}}}*/
}

return MartGrid;
});
