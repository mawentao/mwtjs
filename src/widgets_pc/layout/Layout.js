/**
 * Layout.js, (c) 2017 mawentao
 * @class MWT.Layout
 * @extends MWT.Event
 **/
require('./layout.css');

MWT.Layout=function(opt)
{
    this.listeners={};
    this.render=null;
    this.id='';
    this.style=null;
    this.html='';

    this.construct=function(opt){
        if(opt){
            if(opt.render) this.render=opt.render;
            if(opt.id) this.id=opt.id;
            else this.id = this.render+'-layout';
            if(opt.style) this.style=opt.style;
            if(opt.html) this.html=opt.html;
        }
    };

    // 子类需覆盖此方法
    this.init=function(){}
};
MWT.extends(MWT.Layout,MWT.Event);

require('./FillLayout');
require('./BorderLayout');
require('./CellLayout');
