define(function(require){
	var frame=require('frame');
	var control='example';
    var example=require('common/example');
    var o={};

	// 控制器配置
	o.conf = {
		controller: control,
        // menu
        menu: [
            {name:'通用', submenu:[
                {name:'图标',action:'Icon'},
                {name:'按钮',action:'Button'}
            ]},
            {name:'布局', submenu:[
                {name:'Fill布局',action:'FillLayout'},
                {name:'Border布局',action:'BorderLayout'}
            ]},
        ],
		// url路由
		path: [
			'/'+control+'/Icon',
			'/'+control+'/Button',

			'/'+control+'/FillLayout',
			'/'+control+'/BorderLayout',
			'/'+control+'/index'
		]
	};


	// 默认action
	o.indexAction=function(erurl) {
        window.location = '#/'+control+'/Icon';
	};

    o.IconAction=function() {example.show('icon/icon01.html');}
    o.ButtonAction=function() {example.show('button/button01.html');}

    o.FillLayoutAction=function() {example.show('pc/layout.html');}
    // Border布局
    o.BorderLayoutAction=function(erurl) {
        frame.showpage("Border布局");
    };

	return o;
});
