/* 消息弹框 */
MWT.alert=function(msg,callback)
{
    if (!msg) return;
    var msgdivid = MWT.create_div('mwt-alert-msg-div');
    var msgct = msg.msg ? msg.msg : msg;
    var content = '<div style="padding:30px 40px;font-size:13px;font-family:\'microsoft yahei\';">'+msgct+'</div>';
    jQuery("#"+msgdivid).html(content);
    var dialog = new MWT.Dialog({
        render  : 'mwt-alert-msg-div',
        title   : msg.title ? msg.title : "消息提示", 
        width   : 400,
        top     : msg.top ? msg.top : 50,
        animate : msg.animate ? msg.animate : 'bounceInDown',
        buttons : [ 
            {"label":"确定",cls:'mwt-btn-primary',type:"close"}
        ]
    });
    dialog.open();
    if (callback) dialog.on('close', callback);
};

MWT.confirm=function(msg,callfun)
{
    if (!msg) return;
    var msgdivid = MWT.create_div('mwt-confirm-msg-div');
    var msgct = msg.msg ? msg.msg : msg;
    var content = '<div style="padding:30px 40px;font-size:13px;font-family:\'microsoft yahei\';">'+msgct+'</div>';
    jQuery("#"+msgdivid).html(content);
    var dialog = new MWT.Dialog({
        render : 'mwt-confirm-msg-div',
        title  : msg.title ? msg.title : "请确认",
        width  : 400,
        top    : msg.top ? msg.top : 50,
        animate : msg.animate ? msg.animate : 'bounceInDown',
        buttons  : [ 
            {"label":"取消",cls:'mwt-btn-default',handler:function(){dialog.close();callfun(false);}},
            {"label":"确认",cls:'mwt-btn-primary',handler:function(){dialog.close();callfun(true);}}
        ]
    });
    dialog.open();
};
