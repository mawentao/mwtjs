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
            {name:'浮层', submenu:[
                {name:'通用浮层',action:'FloatDiv'},
                {name:'对话框',action:'dialog'},
                {name:'消息提示',action:'msg'}
            ]},
            {name:'表格', submenu:[
                {name:'表格简介&API',action:'grid'},
                {name:'简单表格',action:'grid01'},
            ]},
        ],
		// url路由
		path: [
			'/'+control+'/Icon',
			'/'+control+'/Button',

			'/'+control+'/FillLayout',
			'/'+control+'/BorderLayout',

            '/'+control+'/FloatDiv',
            '/'+control+'/dialog',
            '/'+control+'/msg',

            '/'+control+'/grid',
            '/'+control+'/grid01',

			'/'+control+'/index'
		]
	};


	// 默认action
	o.indexAction=function(erurl) {
        window.location = '#/'+control+'/Icon';
	};

    o.IconAction=function() {example.show('icon/icon01.html');}
    o.ButtonAction=function() {example.show('button/button01.html');}

    o.FillLayoutAction=function() {example.show('pc/layout_fill.html');}
    o.BorderLayoutAction=function() {example.show('pc/layout_border.html');}

    o.FloatDivAction=function() {example.show('pc/float_div.html');}
    o.dialogAction=function() {example.show('pc/dialog.html');}
    o.msgAction=function() {example.show('pc/msg.html');}

    o.gridAction=function() {example.show('pc/grid.html');}
    o.grid01Action=function() {example.show('pc/grid01.html');}

	return o;
});
