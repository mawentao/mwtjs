/* dbpanel.js, (c) 2016 mawentao */
define(function(require){
	var tabstructpanel = require('./tabstructpanel');

	var o={};

	o.init=function(dboptions,dbid) {
		// db选择
		var dbbar = new MWT.Bar({
			render: 'dbbar-div',
			style: "background:#f1f1f1;border-bottom:solid 1px #ddd;padding:0;",
			items: [
				{label:"数据库",id:"dbsel",type:'select',width:50,value:dbid,options:dboptions,style:'width:130px;',
                 handler:o.query_tables},
                '-',
                {type:"search",label:"GO",id:"so-key",width:155,handler:o.query_tables}
			]
		});
		dbbar.create();
		o.query_tables();
	};

	// 切换完db后,获取所有table
	o.query_tables=function() {
		var dbid = get_select_value('dbsel');
		var tablelist = require('common/metadb').gettablelist(dbid);
		if (tablelist.length==0) {
			var msg = '<p style="margin-top:10px;color:gray;" align="center">'+
					'<i class="fa fa-frown-o" style="font-size:20px;"></i><br>'+
					'此库无可用的数据表</p>';
			jQuery('#dbbody-div').html(msg);
			tabstructpanel.reset();
			return;
		}
        var sokey = get_value('so-key').toLowerCase();
		var lis = [];
		for (var i=0;i<tablelist.length;++i) {
			var im = tablelist[i];
			var tb = im.Name;
            if (sokey!='' && tb.toLowerCase().indexOf(sokey)<0) {
                continue;
            }
            lis.push('<li><a href="javascript:;" name="dta" data-dtname="'+tb+'">'+
					 '<i class="fa fa-table"></i> '+tb+'</a></li>');
		}
		var code = '<ul>'+lis.join('')+'</ul>';
		jQuery('#dbbody-div').html(code);
		tabstructpanel.show(tablelist[0].Name);
		jQuery('[name=dta]').unbind('click').click(function(){
			var dtname = jQuery(this).data('dtname');
			tabstructpanel.show(dtname);
		});
	};

	return o;
});
