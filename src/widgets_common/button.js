/**
 * 按钮组件
 * 使用:
 *    new mwt.ButtonGroup({
 *        cls: 'mwt-btn-group',
 *        btns: [
              {name:'editbtn',label:'编辑',icon:'sicon-pencil',cls:'mwt-btn-primary-o'},
              {name:'viewbtn',id:"viewbtn-1",icon:'fa fa-dashboard',href:'www.baidu.com',target:'_blank'}
          ]
 *    }).generateHTML();
 **/

require('./button.css');

mwt.ButtonGroup = function(opt)
{
    this.listeners = {};
	var render=null;
	var btns = [];
	var cls = "mwt-btn-group-radius";
	var style = "";
    if (opt) {
		if (opt.render) render=opt.render;
		if (opt.btns) btns=opt.btns;
		if (opt.cls) cls=opt.cls;
		if (opt.style) style=opt.style;
	}

	this.create=function(){
		if (render&&render!="") jQuery("#"+render).html(this.generateHTML());
	};

	this.generateHTML=function(){
        var ls = [];
		var attrs = ["id","name","href","target","class","style"];
		if (btns && btns.length>0) {
			for (var i=0;i<btns.length;++i) {
				var item = btns[i];
				var abtn = '<a';
				if (!item.href || item.href=="") item.href="javascript:;";
				item['class'] = "mwt-btn mwt-btn-default";
				if (item.cls) item['class'] = 'mwt-btn '+item.cls;
				for (var m=0;m<attrs.length;++m) {
					var attr = attrs[m];
					if (item[attr]) abtn+=' '+attr+'="'+item[attr]+'"';
				}
				if (item.attrs) abtn += ' '+item.attrs;
				abtn+=">";
				if (item.icon) abtn+='<i class="'+item.icon+'"></i> ';
				if (item.label) abtn+=item.label;
				abtn+="</a>";
				ls.push(abtn);
			}
        }
		var sty = style!="" ? ' style="'+style+'"':'';
		var code = '<div class="'+cls+'"'+sty+'>'+ls.join('')+'</div>';
		return code;
    };
};
MWT.extends(MWT.ButtonGroup, MWT.Event);
