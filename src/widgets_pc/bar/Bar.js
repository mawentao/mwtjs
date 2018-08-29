/**
 * 工具条
 * author: mawentao
 * create: 2013-07-14 11:17:14
 **/

mwt.Bar=function(opt)
{
    this.listeners={};
    this.render=null;

    this.construct=function(cnf) {
        if (cnf.render)this.render=cnf.render;
    }

};
MWT.extends(MWT.Bar, MWT.Event);

require('./PageBar');
require('./ToolBar');
require('./FlexBar');
