/**
 * 快捷表单对话框 (window.prompt替待组件)
 * author: mawentao
 * create: 2017-10-31 09:23:11
 **/

mwt.prompt = function(opts,callback) 
{
    if (!opts) return;
    var dgid = MWT.createDiv('mwt-prompt-div');
    var type = opts.type ? opts.type : 'text';
    var style = type=='textarea' ? 'height:150px;' : '';

    var form = new MWT.Form();
    form.addField('field', new MWT.TextField({
        render : 'field-'+dgid,
        type   : type,
        style  : style,
        value  : '',
        empty  : false
    }));

    var dialog = new mwt.Dialog({
        render : dgid,
        title  : opts.title ? opts.title : '请输入',
        width  : opts.width ? opts.width : 400,
        top    : opts.top ? opts.top : 80,
        animate: opts.animate ? opts.animate : 'bounceInDown',
        form : form,
        body : '<div id="field-'+dgid+'"></div>',
        bodyStyle : 'padding:10px;',
        buttons: [
            {label:"取消",cls:'mwt-btn-default',handler:function(){dialog.close();}},
            {label:"确认",cls:'mwt-btn-primary',handler:function(){
                var v = form.getData();
                dialog.close();
                if (callback) {
                    callback(v.field);
                }
            }}
        ]
    });
    dialog.on('open',function(){
        form.reset();
        jQuery('#field-mwt-prompt-divtxt').focus();
    });
    dialog.open();
};
