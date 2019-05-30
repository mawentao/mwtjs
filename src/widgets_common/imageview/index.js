
require('./index.css');

require('./jquery.mousewheel.js');

mwt.ImageBox = function()
{
    this.render = 'mwt-image-box';
    var img = new Image();
    var scale = 1.0;
    var rotate = 0;
    var thiso = this;

    this.init = function() {
        var domid = this.render;
        var code = '<div class="mwt-image-view-box">'+
            '<div class="mwt-image-view-mask">'+
                '<i class="sicon-close" id="close-'+domid+'"></i>'+
            '</div>'+
            '<div class="mwt-image-view-canvas" id="canvas-div-'+domid+'">'+
                '<canvas id="canvas-'+domid+'"></canvas>'+
            '</div>'+
            '<div class="mwt-image-view-btns">'+
                '<button id="zoom-in-'+domid+'" class="mwt-btn mwt-btn-default"><i class="fa fa-plus-circle"></i></button>'+
                '<br>'+
                '<button id="zoom-out-'+domid+'" class="mwt-btn mwt-btn-default"><i class="fa fa-minus-circle"></i></button>'+
                '<br>'+
                '<button id="roleft-'+domid+'" class="mwt-btn mwt-btn-default"><i class="fa fa-rotate-right"></i></button>'+
                '<br>'+
                '<button id="roright-'+domid+'" class="mwt-btn mwt-btn-default"><i class="fa fa-rotate-left"></i></button>'+
                '<br>'+
                '<button id="refresh-'+domid+'" class="mwt-btn mwt-btn-default"><i class="fa fa-refresh"></i></button>'+
            '</div>'+
        '</div>';
        mwt.createDiv(domid);
        jQuery('#'+domid).html(code);
        jQuery('#close-'+domid).unbind('click').click(function(){
            jQuery('#'+domid).hide();
        });
        var canvasId = 'canvas-div-'+domid;

        img.onload = refresh;
/*
        function () {
            var jCanvas = jQuery('#canvas-'+domid);
            var cav = jCanvas[0];
            var ctx = cav.getContext('2d');
            jCanvas.attr('width',img.width).attr('height',img.height);
            var h = img.height>300 ? 300 : img.height;
            var w = (h*img.width) / img.height;
            jCanvas.css({
                width: w+'px',
                height: h+'px',
                transform: 'scale(1.0) rotate(0deg)'
            });
            ctx.drawImage(img, 0, 0);

            var pageWidth = window.innerWidth;
            var pageHeight = window.innerHeight;
            var left = (pageWidth-w) / 2;
            var top = (pageHeight-h-240) / 2;
            if (left<0) left = 0;
            if (top<0) top = 0;
            jQuery('#'+canvasId).css({left:left+'px',top:top+'px'});
        };
*/
        // 按钮点击事件
        jQuery('#zoom-in-'+domid).unbind('click').click(function(){
            scale += 0.1; syncImage();
        });
        jQuery('#zoom-out-'+domid).unbind('click').click(function(){
            scale -= 0.1; syncImage();
        });
        jQuery('#roleft-'+domid).unbind('click').click(function(){
            rotate -= 90; syncImage();
        });
        jQuery('#roright-'+domid).unbind('click').click(function(){
            rotate += 90; syncImage();
        });
        jQuery('#refresh-'+domid).unbind('click').click(function(){
            refresh();
        });
        
        // 鼠标滚轮事件
        jQuery('#canvas-'+domid).unbind('mousewheel').bind('mousewheel',function(e,delta) {
            if (delta>0) scale += 0.1;
            else scale -= 0.1;
            syncImage();
        });
        // 拖拽事件
        jQuery('#'+canvasId)
            .mousedown(function(e){dig_mdown(e,canvasId);})
            .mousemove(function(e){dig_mmove(e,canvasId);})
            .mouseup(function(e){dig_mup(e,canvasId);});
    };

    // 同步显示图片
    function syncImage() {
        var domid = thiso.render;
        rotate %= 360;
        jQuery('#canvas-'+domid).css({transform: 'scale('+scale+') rotate('+rotate+'deg)'});
    }

    // 复原
    function refresh() 
    {/*{{{*/
        var domid = thiso.render;
        //1. 大小
        scale = 1.0; 
        rotate = 0;
        var jCanvas = jQuery('#canvas-'+domid);
        var cav = jCanvas[0];
        var ctx = cav.getContext('2d');
        jCanvas.attr('width',img.width).attr('height',img.height);
        var h = img.height>300 ? 300 : img.height;
        var w = (h*img.width) / img.height;
        jCanvas.css({
            width: w+'px',
            height: h+'px',
            transform: 'scale('+scale+') rotate('+rotate+'deg)'
        });
        ctx.drawImage(img, 0, 0);
        //2. 位置
        var canvasId = 'canvas-div-'+domid;
        var pageWidth = window.innerWidth;
        var pageHeight = window.innerHeight;
        var left = (pageWidth-w) / 2;
        var top = (pageHeight-h-240) / 2;
        if (left<0) left = 0;
        if (top<0) top = 0;
        jQuery('#'+canvasId).css({left:left+'px',top:top+'px'});
    }/*}}}*/

    this.show = function(src) 
    {
        scale = 1;
        rotate = 0;
        var domid = this.render;
        jQuery('#'+domid).show();
        img.src = src;
    };


    function dig_mdown(e,domid){
        if (e.which!=1)return;
        var obj=document.getElementById(domid);
        //console.log(obj.style.left+','+obj.style.top);
        obj.style.cursor = "move";
        jQuery("#"+domid).data("mdown","1")
                         .data("objX", obj.style.left)
                         .data("objY", obj.style.top)
                         .data("mouseX", e.clientX)
                         .data("mouseY",e.clientY);
    }   
    function dig_mmove(e,domid){
        if (e.which!=1)return;
        var jdom = jQuery("#"+domid);
        if (jdom.data("mdown")==1) {
            var objX = jdom.data("objX");
            var objY = jdom.data("objY");
            var mouseX = jdom.data("mouseX");
            var mouseY = jdom.data("mouseY");
            var obj=document.getElementById(domid);
            var x = e.clientX;  
            var y = e.clientY;  
            obj.style.left = parseInt(objX) + parseInt(x) - parseInt(mouseX) + "px";  
            obj.style.top = parseInt(objY) + parseInt(y) - parseInt(mouseY) + "px";  
        }   
    }   
    function dig_mup(e,domid){
        if (e.which!=1)return;
        var obj=document.getElementById(domid);
        obj.style.cursor = "default";
        jQuery("#"+domid).data("mdown","0");
    }
};


mwt.imageBox = null;

mwt.initImageView=function()
{
    jQuery('.mwt-image-view').unbind('click').click(function(){
        var src = jQuery(this).attr('src');
//        alert(src);
        if (!mwt.imageBox) {
            mwt.imageBox = new mwt.ImageBox();
            mwt.imageBox.init();
        }
        mwt.imageBox.show(src);
    });
}



