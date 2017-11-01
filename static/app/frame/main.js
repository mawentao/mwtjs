/**
 * 页面框架, 负责页面整体布局和导航菜单管理
 * 框架接口:
 *     init()                : 框架初始化
 *     addcontroller(conf)   : 添加控制器配置
 *     active()              : 选中菜单/导航
 *     showpage()            : 显示主页区域
 **/
define(function(require){
    var controller_confs={};  //!< 控制器配置列表
	var controller_active;    //!< 当前激活的控制器
    var navlist = [
        {text:'使用手册',href:'#/example',icon:'fa fa-qq',newtab:0},
//        {text:'下载',href:'#/download',icon:'fa fa-qq',newtab:0}  
    ];
    var o={};

    // 框架初始化函数
    o.init = function() {
        var topCode = '<a class="logoa" href="#/">'+
            '<img class="logo" src="examples/static/mwtjs.png"/>'+
            '<span class="title">'+
                '<b style="color:#4285F4">m</b>'+
                '<b style="color:#EA4335">w</b>'+
                '<b style="color:#FF9902">t</b>'+
                '<b style="color:#34A853">.js</b>'+
            '</span>'+
        '</a>'+
        '<div id="frame-menu"></div>';

        new mwt.BorderLayout({
            render : 'main-div',
            items : [
                {id:'frame-top',region:'north',height:50,html:topCode},
                {id:'frame-body',region:'center'}
//                {id:'frame-west',region:'west',width:200,collapsible:true,split:true},
//                {id:'frame-center',region:'center'}
            ]
        }).init();

        init_menu_nav();
    };


    // 添加控制器配置
    o.addcontroller = function(conf) {
		controller_confs[conf.controller] = conf;
    };

    // 选中菜单
    o.active = function(controller,action) {
		//1. 未切换controller只需选中action
		if (controller_active==controller) {
			jQuery('[name="navitem"]').removeClass('active');
			jQuery('#navitem-'+controller+'-'+action).addClass('active');
			return;
		}

		//2. 清理布局
        jQuery(".menu-item").removeClass('active');
		jQuery('#frame-body').html('');
		if (!controller_confs[controller]) return;  //!< 未添加过此controller的配置
		var conf = controller_confs[controller];

        //3. 选中顶部导航菜单
        jQuery("#menu-"+controller).addClass('active');

		//4. 显示controller布局
		// 左导航布局
		if (conf.menu && conf.menu.length>0) {
            //4-1. 初始化布局
            new mwt.BorderLayout({
                render : 'frame-body',
                items : [
                    {id:'frame-west',region:'west',width:200,collapsible:true,split:true},
                    {id:'frame-center',region:'center'}
                ]
            }).init();
            //4-2. 初始化左导航
			init_nav(conf);
			//4-3. 选中action
			jQuery('[name="navitem"]').removeClass('active');
			jQuery('#navitem-'+controller+'-'+action).addClass('active');
		} 
        // fill布局
        else {
            new mwt.FillLayout({render:'frame-body',id:'frame-center'}).init();
			//jQuery('#frame-body').html(code);
		}
    };

    // 显示页面
    o.showpage = function(code) {
        jQuery("#frame-center").html(code);
    };

    ///////////////////////////////////////////////////////
    
	// 从链接地址中提取controller
	function parse_controller_from_href(href)
	{
		var idx = href.lastIndexOf('#/');
		if (idx<0) return '';
		var tmp = href.substr(idx+2);
		var arr = tmp.split('/');
		return arr[0];
	}

	// 初始化导航菜单
    function init_menu_nav() {
		//1. 导航菜单
		var navs = [];
		for (var i=0;i<navlist.length;++i) {
			var im=navlist[i];
			var icon = '<i class="'+im.icon+'"></i>';
			var target = im.newtab==1 ? 'target="_blank"' : '';
			var controller = parse_controller_from_href(im.href);
			var id = controller!='' ? 'menu-'+controller : 'menu-'+i;
			var licode = '<li><a class="menu-item" id="'+id+'" href="'+im.href+'" '+target+'>'+icon+'<br>'+im.text+'</a></li>';	
			navs.push(licode);
		}
		var code = '<ul class="menuul">'+navs.join('')+'</ul>';
        jQuery('#frame-menu').html(code);
    };

	// 个人导航菜单
	function init_menu_user() {
		var usermenu = [
//			{icon:'icon icon-log',text:'我的资料',href:'#/uc/profile'},
//			{icon:'icon icon-lock',text:'修改密码',href:'#/uc/changepass'},
			{icon:'icon icon-logout',text:'退出数立方',href:dz.logouturl}
		];
		var sims = [];
		for (var i=0;i<usermenu.length;++i) {
			var im=usermenu[i];
			sims.push('<a href="'+im.href+'" style="padding:0px 10px;white-space:nowrap;">'+
					  '<i class="'+im.icon+'" style="padding:0;"></i> '+im.text+'</a>');
		}
        var code = '<ul class="menuul">'+
		  '<li><a class="menu-item" href="javascript:;"><i class="icon icon-contact"></i><br>'+dz.username+'</a>'+
		    '<div class="submenu">'+sims.join('')+'</div>'+
		  '</li>'+
        '</ul>';
		jQuery('#frame-menu-bottom').html(code);
	};


    // 初始化左部导航
    function init_nav(controlconf) {
		var controller=controlconf.controller;
		var navitems=controlconf.menu;
        var code = '<ul class="leftmenu" id="nav-'+controller+'">';
		for (var j=0; j<navitems.length; ++j) {
			var item = navitems[j];
			var href = item.action ? '#/'+controller+'/'+item.action : "javascript:;";
			var hassubmenu = (item.submenu && item.submenu.length>0);
			var cls = hassubmenu ? 'class="menu-open"' : '';
			var icon = item.icon ? item.icon : 'fa fa-hand-o-right';
			var style = item.style ? item.style : '';
			var liid = item.action ? 'id="navitem-'+controller+'-'+item.action+'"' : '';
			code += "<li "+cls+" style='"+style+"'>"+
					"<a name='navitem' class='lm-menu' href='"+href+"' "+liid+">"+
						'<i class="'+icon+'"></i>&nbsp;'+item.name+"</a>";
			// 子菜单
			if (hassubmenu) {
				code += "<ul class='submenu'>";
				for (var k=0; k<item.submenu.length; ++k) {
					var im = item.submenu[k];
					var href = im.action ? '#/'+controller+'/'+im.action : "javascript:;";
					var style = im.style ? im.style : '';
					liid = im.action ? 'id="navitem-'+controller+'-'+im.action+'"' : '';
					icon = im.icon ? im.icon : 'fa fa-caret-right';
					code += "<li style='"+style+"'><a name='navitem' class='lm-item' href='"+href+"' "+liid+">"+
							'<i class="'+icon+'" style="padding-left:0;"></i>&nbsp;'+im.name+"</a></li>";
				}   
				code += "</ul>";
			}
			code += "</li>";
		}
        code += '<li style="border-bottom:none;"></li>';
		code += '</ul>';
        jQuery("#frame-west").html(code);
		//2. bunddle event
        jQuery(".lm-menu").unbind('click').click(function(){
            var child = jQuery(this).parent().children(".submenu");
            if (child) {
                var dsp = child.css("display");
                if (!dsp) {
                    //alert(dsp);
                } else if ("none" == dsp) {
                    jQuery(this).parent().removeClass("menu-close");
                    jQuery(this).parent().addClass("menu-open");
                } else {
                    jQuery(this).parent().removeClass("menu-open");
                    jQuery(this).parent().addClass("menu-close");
                }   
            }
        });
    }

    return o;
});
