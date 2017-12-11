/**
 * Excel上传控件
 * author: mawentao
 * create: 2017-12-08 11:23:11
 **/
require('./ajaxfileupload.js');
require('./excel.css');

MWT.ExcelImport = function(opt)
{
    this.listeners={};
    var render;
    var fileElementId = "excelfile";
    var ajaxapi;        //!< 上传接口
    var tiphtml='';     //!< 提示信息
    var lineProcFun;    //!< 行处理函数
    var checkFun;       //!< 校验函数(在处理数据前调用)
    var popover;

    if (opt) {
        if(opt.render)render=opt.render;
        if(opt.ajaxapi) ajaxapi=opt.ajaxapi;
        if(ajaxapi.indexOf('fileElementId')<0) ajaxapi+='&fileElementId='+fileElementId;
        if(opt.tiphtml) tiphtml=opt.tiphtml;
        if(opt.lineProcFun) lineProcFun=opt.lineProcFun;
        if(opt.checkFun) checkFun=opt.checkFun;
    }

    // 创建
    this.create=function() {
        if (!render) return;
        var domid = render;
        var tipcode = '';
        if (tiphtml!='') {
            tipcode = '<div class="mwt-wall mwt-wall-info" style="margin-top:10px;">'+tiphtml+'</div>';
        }
        var code = '<table class="mwt-excel-tab"><tr>'+
            '<td>'+
                '<input id="txt-'+domid+'" tyle="text" class="mwt-field" placeholder="选择Excel文件" readonly>'+
                '<div id="formdiv-'+domid+'" style="display:none;"></div>'+
            '</td>'+
            '<td width="78" align="right">'+
                '<button id="upbtn-'+domid+'" class="mwt-btn mwt-btn-success mwt-btn-sm">开始导入</button>'+
            '</td>'+
        '</tr></table>'+tipcode+
        '<div id="feedback-'+domid+'" class="mwt-feedback"></div>';
        jQuery('#'+domid).html(code);
        createForm();
        popover = new mwt.Popover({
            anchor : 'txt-'+domid,
            html   : '请上传Excel文件',
            cls    : 'mwt-popover-danger'
        });
        // 点击选择文件
        jQuery('#txt-'+domid).unbind('click').click(function(){
            popover.hide();
            jQuery(this).val('');
            jQuery('#'+fileElementId).val("").click();
        });
        // 点击上传文件
        jQuery('#upbtn-'+domid).unbind('click').click(doUpload);
    };

    // 创建Form
    function createForm() {
        var code = '<form method="POST" enctype="multipart/form-data">'+
            '<input type="file" id="'+fileElementId+'" name="'+fileElementId+'" accept="*.xls,*.xlsx" style="display:none;"/>'+
        '</form>';
        jQuery("#formdiv-"+render).html(code);
        jQuery('#'+fileElementId).unbind('change').change(function(){
            var f = jQuery(this).val();
            jQuery('#txt-'+render).val(f);
        });
    }
    // 上传文件
    function doUpload() {
        var excelfile = jQuery('#'+fileElementId).val();
        if (excelfile=="") {
            popover.pop();
            return;
        }
        beforeUpload();
        appendInfo('开始上传Excel文件');
        jQuery.ajaxFileUpload({
            url           : ajaxapi,
            secureuri     : false,
            fileElementId : 'excelfile',
            dataType      : 'json',
            timeout       : 30000,
            complete: function(data) {
                createForm();
            },
            success: function(data,status) {
                if (data.retcode!=0) {
                    appendError(data.retmsg);
                    afterUpload();
                } else {
                    appendSuccess('上传成功');
                    doImport(data.data);
                }
            },
            error: function (data, status, e) {
                appendError('ERROR: '+e);
                afterUpload();
            }
        });
    }

    // 导入Excel数据
    function doImport(data) {
        try {
            var code = '开始导入数据 [行数:'+data.rows_count+'] [列数:'+data.cols_count+']';
            var checkres = 0;
            if (checkFun) checkFun(data);
            appendInfo(code);
            importLine(0,data.root);
        } catch (e) {
            appendError(e);
            afterUpload();
            return;
        }
    }

    // 导入一行数据
    function importLine(ix,list) {
        // 导入结束
        if (ix>=list.length) {
            appendInfo('导入结束');
            afterUpload();
            return;
        }
        // 处理当前行
        var res = 0;
        if (lineProcFun) { res = lineProcFun(list[ix]); }
        var line = list[ix].join(' ');
        if (res==0) {
            appendSuccess('第'+(ix+1)+'行 [导入成功] - '+line);
        } else {
            appendError('第'+(ix+1)+'行 [导入失败:'+res+'] - '+line);
        }
        // 处理下一行
        setTimeout(function(){
            importLine(++ix,list);
        },100);
    }

    function beforeUpload() {
        jQuery('#txt-'+render).attr('disabled','disabled').css({"background":"#eee"});
        var code = '<i class="fa fa-spinner fa-spin fa-1x"></i>正在导入...';
        jQuery('#upbtn-'+render).attr('disabled','disabled').html(code);
        code = '<ul id="ul-'+render+'"></ul>'+
            '<ul id="loading-'+render+'" style="margin-top:-8px;">'+
                '<li><i class="fa fa-cog fa-spin fa-1x" style="color:gray;"></i></li>'+
            '</ul>';
        jQuery('#feedback-'+render).html(code).fadeIn();
    }
    function afterUpload() {
        jQuery('#txt-'+render).removeAttr('disabled').css({"background":"#fff"});
        jQuery('#upbtn-'+render).removeAttr('disabled').html("开始导入");
        jQuery('#loading-'+render).remove();
    }
    function appendInfo(msg) {
        var li = '<li>&gt; '+msg+'</li>';
        jQuery('#ul-'+render).append(li);
        // 滚动到底部
        var height = jQuery('#feedback-'+render)[0].scrollHeight;
        jQuery('#feedback-'+render).scrollTop(height);
    }
    function appendError(msg) {appendInfo('<span style="color:red;">'+msg+'</span>');}
    function appendSuccess(msg) {appendInfo('<span style="color:darkgreen;">'+msg+'</span>');}
};

MWT.extends(MWT.ExcelImport, MWT.Event);
