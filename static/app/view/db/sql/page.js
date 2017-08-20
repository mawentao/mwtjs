/* page.js, (c) 2016 mawentao */
define(function (require) {
    var tid = 0;
    var o = {};

    o.execute = function (domid, _tid) {
        tid = _tid;
        //1. 获取所有有权限的DB列表
        var dboptions = require('common/metadb').getalloptions();
        if (dboptions.length == 0) {
			var code = '<span>没有可访问的数据库</span>';
			jQuery("#" + domid).html(code);
            return;
        }
		//2. 初始化页面布局
        var code = '<div id="dbview-div">' +
            '<div id="dbbar-div" class="headdiv"></div>' +
            '<div id="dbbody-div" style="border-top:solid 1px #ddd;">'+
				'<i class="fa fa-refresh fa-spin fa-3x fa-fw margin-bottom" style="font-size:14px;color:gray;"></i></div>'+
          '</div>'+
		  '<div id="sqlview-div">' +
            '<div id="sqlbar-div" class="headdiv"></div>' +
            '<textarea id="sqltxt" class="form-control" style="border:none;height:175px;' +
              'font-family:monospace;padding:1px 5px;box-sizing:border-box;line-height:20px;">' +
              'SELECT * FROM ' +
            '</textarea>' +
          '</div>' +
          '<div id="tablestr-div">' +
            '<div id="tablebar-div" class="headdiv"></div>' +
            '<div id="tablebody-div" style="top:33px;"></div>' +
          '</div>';
        jQuery("#" + domid).html(code).css({background: '#f2f2f2'});
        //3. 初始化各个panel
        var data = {
            tid: tid,
            dbid: 0,
            sqlname: '',
            sqlstatement: 'SELECT * FROM'
        };
		if (tid) {
            ajax.post('table&action=gettable', {tid: tid}, function (res) {
                if (res.retcode) {
                    mwt.alert(res.retmsg);
                    throw new Error(res.retmsg);
                } else {
                    data.dbid = res.data.dbid;
                    data.sqlname = res.data.tcomment;
                    data.sqlstatement = res.data.tname;
                }
            }, true);
        }
    	require('./tabstructpanel').init();
    	require('./dbpanel').init(dboptions,data.dbid);
    	require('./sqldefine').init(data);
    };

    return o;
});
