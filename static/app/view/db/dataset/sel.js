/* 数据集选择器 */
define(function(require){
	var fd,store,grid;

	function query() {
		store.baseParams = {
            "key": get_value("so-key")
        };
		grid.load();
	};

	function create_grid(divid) {
		store = new MWT.Store({
			url: ajax.getAjaxUrl('t_datacube_table&action=query'),
			beforeLoad: store_before_load,
			afterLoad: store_after_load
        });
		grid = new MWT.Grid({
			render: divid,
            store: store,
			noheader: true,
			notoolbox: true,
            pagebar: true, //!< false 表示不分页
            pageSize: 20,
			pagebarSimple: true,
            multiSelect:false, 
			position:'fixed',
            bordered: false,
			tbarStyle: 'background:#f2f2f2;border-bottom-color:#f2f2f2;',
            tbar: [
                {type:"search",id:"so-key",width:300,placeholder:'查询数据集',handler:query}
            ],
            cm: new MWT.Grid.ColumnModel([
				{head:"",dataIndex:"dbid",width:1,render:function(v){return '';}},
				{head:"数据集名称",dataIndex:"tcomment",align:'left',sort:true,render:function(v,item){
					var icon = '<i class="fa fa-table gridi"></i>';
					switch (parseInt(item.ttype)) {
						case 2: icon='<i class="iconop sql"></i>'; break;
					} 
					return icon+' '+v;
				}}/*,
				{head:'物理表',dataIndex:'tname',align:'left',width:180,sort:true,render:function(v,item){
					return v;
				}},
				{head:'数据源',dataIndex:'dbname',align:'center',width:150,sort:true,render:function(v,item){
					return v;
				}},
				{head:'所有者',dataIndex:'username',align:'center',width:100,sort:true,
				 render:function(v,item){
					return v;
				}}*/
            ]),
			rowclick: function(im) {
				fd.setText(im.tcomment);
				fd.setValue(im.tid);
			}
        });
		grid.create();
		//jQuery('#tableid-db_cube_dialog-opt-tab-expbtn').hide();
		//jQuery('#tableid-db_cube_dialog-opt').children().children(".mwt-grid-foot").css("padding",0);
	}

	var o={};
	o.get=function(domid) {
		fd = new MWT.ComboxField({
            render   : domid,
            cls      : 'radius',
            style    : 'width:100%;font-size:12px;', 
			popStyle : 'width:400px;height:250px;',
            value    : '',
			empty    : false,
			errmsg   : '请选择用户'
        });
		fd.on('create',function(){
			create_grid(fd.getPopDivId());
		});
		fd.on('pop',function(){
			grid.autolayout();
			if (store.size()==0) {
				grid.load();
			}
		});
		return fd;
	};
	return o;
});
