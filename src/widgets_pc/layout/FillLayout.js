/** 
 * FillLayout.js, (c) 2017 mawentao 
 * @class MWT.FillLayout
 * @extends MWT.Layout
 **/
MWT.FillLayout=function(opt)
{
    this.listeners={};
    if(opt){
        this.construct(opt);
    }

    this.init=function()
    {
        var style = this.style ? ' style="'+this.style+'"' : '';
        var code = '<div id="'+this.id+'" class="mwt-layout-fill"'+style+'>'+this.html+'</div>';
        jQuery('#'+this.render).html(code);
    };
};
MWT.extends(MWT.FillLayout,MWT.Layout);
