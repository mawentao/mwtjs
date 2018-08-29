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
                {name:'按钮',action:'Button'},
                {name:'导航',action:'Nav'}
            ]},
            {name:'布局', submenu:[
                {name:'栅格布局',action:'GridLayout'},
                {name:'Fill布局',action:'FillLayout'},
                {name:'Border布局',action:'BorderLayout'}
            ]},
            {name:'浮层', submenu:[
                {name:'通用浮层',action:'FloatDiv'},
                {name:'对话框',action:'dialog'},
                {name:'消息提示',action:'msg'},
                {name:'冒泡提示',action:'pop'}
            ]},
            {name:'工具栏', submenu:[
                {name:'工具栏', action:'toolbar'},
                {name:'时间选择', action:'timepicker'}
            ]},
            {name:'表格', submenu:[
                {name:'表格简介&API',action:'grid'},
                {name:'简单表格',action:'grid01'},
                {name:'带工具栏表格',action:'grid02'}
            ]},
            {name:'表单', submenu:[
                {name:'表单简介&API',action:'form'},
                {name:'自定义选择控件',action:'fieldCombox'},
                {name:'checkbox',action:'fieldCheckbox'}
            ]},
            {name:'其他', submenu:[
                {name:'wall',action:'wall'},
                {name:'ExcelImport',action:'excel'},
                {name:'ImageUpload',action:'imgup'}
            ]},
            {name:'Mobile', submenu:[
                {name:'图标&按钮',action:'wxicon'},
                {name:'消息',action:'wxmsg'},
                {name:'列表',action:'wxflow'},
                {name:'侧边栏',action:'sidebar'},
                {name:'滑动菜单',action:'scrollbar'}
            ]}
        ],
		// url路由
		path: [
			'/'+control+'/Icon',
			'/'+control+'/Button',
			'/'+control+'/Nav',

			'/'+control+'/GridLayout',
			'/'+control+'/FillLayout',
			'/'+control+'/BorderLayout',

            '/'+control+'/FloatDiv',
            '/'+control+'/dialog',
            '/'+control+'/msg',
            '/'+control+'/pop',

            '/'+control+'/toolbar',
            '/'+control+'/timepicker',

            '/'+control+'/grid',
            '/'+control+'/grid01',
            '/'+control+'/grid02',

            '/'+control+'/form',
            '/'+control+'/fieldCombox',
            '/'+control+'/fieldCheckbox',

            '/'+control+'/wxicon',
            '/'+control+'/wxmsg',
            '/'+control+'/wxflow',


            '/'+control+'/wall',
            '/'+control+'/excel',
            '/'+control+'/imgup',
            '/'+control+'/scrollbar',
            '/'+control+'/sidebar',
			'/'+control+'/index'
		]
	};


	// 默认action
	o.indexAction=function(erurl) {
        window.location = '#/'+control+'/Icon';
	};

    o.IconAction=function() {example.show('icon/icon01.html');}
    o.ButtonAction=function() {example.show('button/button01.html');}
    o.NavAction=function() {example.show('nav/nav01.html');}

    o.GridLayoutAction=function() {example.show('common/flex.html');}
    o.FillLayoutAction=function() {example.show('pc/layout_fill.html');}
    o.BorderLayoutAction=function() {example.show('pc/layout_border.html');}

    o.FloatDivAction=function() {example.show('pc/float_div.html');}
    o.dialogAction=function() {example.show('pc/dialog.html');}
    o.msgAction=function() {example.show('pc/msg.html');}
    o.popAction=function() {example.show('pc/pop.html');}

    o.toolbarAction=function() {example.show('pc/toolbar.html');}
    o.timepickerAction=function() {example.show('field/TimepickerField.html');}

    o.gridAction=function() {example.show('pc/grid.html');}
    o.grid01Action=function() {example.show('pc/grid01.html');}
    o.grid02Action=function() {example.show('pc/grid02.html');}

    o.formAction=function() {example.show('pc/form.html');}
    o.fieldComboxAction=function() {example.show('field/combox.html');}
    o.fieldCheckboxAction=function() {example.show('field/checkbox.html');}

    o.wallAction=function() {example.show('pc/wall.html');}
    o.excelAction=function() {example.show('pc/excel.html');}
    o.imgupAction=function() {example.show('pc/image_upload.html');}

    o.wxiconAction=function() {example.show('mobile/wxicon.html');}
    o.wxmsgAction=function() {example.show('mobile/msg.html');}
    o.wxflowAction=function() {example.show('mobile/flow.html');}
    o.sidebarAction=function() {example.show('mobile/sidebar.html');}
    o.scrollbarAction=function() {example.show('mobile/scrollbar.html');}
    

	return o;
});
