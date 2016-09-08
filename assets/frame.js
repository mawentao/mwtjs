define(function(require){

    var o = {};

	o.init = function() {
		Ext.onReady(function(){
			Ext.QuickTips.init();
			Ext.apply(Ext.QuickTips.getQuickTip(), {
				maxWidth: 500,
				minWidth: 100,
				showDelay: 50,
				dismissDelay: 0,
				hideDelay: 50,
				trackMouse: true,
				animate: true
			});

			new Ext.Viewport({
				layout: 'fit',
                frame : true,
                items: [{
					tbar: new Ext.Toolbar({items: [
						{text:"<b>&nbsp;MwtJs����ѧϰƽ̨</b>",icon: "static/imgs/icon.png"},
                        "->","-",
						{text:"����", icon:"static/imgs/download.gif", handler:function(){alert("TODO");}},
                        "-"
					]}),
					layout: "border",
                    items: [
						{ region:'west', width:700, title:'<p>�ڴ˴��������</p>', collapsible: true, split: true, border: false,
                          style: "border-width:0 1px 0 0",
                          contentEl: 'source',
                          bbar: new Ext.Toolbar({items: [
                             '->','-',{text: 'DEMOs', handler: open_demo_win},'-',
                             {text: '<p>TRY IT YOURSELF</p>', handler:function(){require("action").dotry();}},'-'
                          ]})
						},
						{region: 'center', title: '<p>�鿴���</p>', contentEl:'main_area',
                         border: false, style:"border-width:0 0 0 1px;",
                         bbar: new Ext.Toolbar({items:[
                             '-',{text: '<p>ˢ��</p>', handler:function(){require("action").refresh();}},
                             '-',{text: '<p>���´����д�</p>', handler:function(){require("action").opennew();}}
                         ]})
						}
					]
				}]
			});
  		});
	};

	return o;
});
