/**
 * 布局
 **/
require('./layout.css');

MWT.Viewport=function(opt)
{
	// 事件监听列表
	this.listeners={};
    var render='';
    var layout='fill';
    var id="";
    var items=[];
    var html='';
    var style='';
    var borderItemMap={};
    var splitWidth = 5;
    if (opt) {
        if(opt.render)render=opt.render;
        id = opt.id ? opt.id : mwt.genid('layout');
        if(opt.style)style=opt.style;
        if(opt.items)items=opt.items;
        if(opt.html)html=opt.html;
        if(opt.layout)layout=opt.layout;
    }

    // 获取css的合法长度值
    function getCssLengh(num) { return /[%|px]$/i.test(num) ? num : num+'px'; }

    function getCode(_id,_layout,_style,_html) {
        var id = _id=='' ? '' : ' id="'+_id+'"';
        var cls = _layout=='' ? 'mwt-layout-fit' : 'mwt-layout-'+_layout;
        var style = _style ? ' style="'+_style+'"' : '';
        var html = _html ? _html : '';
        return '<div'+id+' class="'+cls+'"'+style+'>'+html+'</div>';
    }

    // border布局
    function layoutBorder(_id,_items) 
    {
        var itemHtmls = [];
        var centerid = _id+'-center';
        borderItemMap={};
        if (!_items || _items.length==0) {
            _items.push({id:centerid,region:'center'});
        }

        for (var i=0;i<_items.length;++i) {
            var im = _items[i];
            if (!im.region) im.region='center';
            if (!im.id) im.id = _id+im.region;
            if (im.region=='center') centerid=im.id;
            borderItemMap[im.region] = im;
        }

        if (!borderItemMap['center']) {
            borderItemMap['center'] = {id:centerid};
        }
        
        var sideWidthMap = {
            west: 0,
            east: 0
        };

        for (var ea in sideWidthMap) {
            if (borderItemMap[ea]) {
                var im = borderItemMap[ea];
                var width = getCssLengh(im.width);
                if (!im.style) im.style='';
                im.style='width:'+width+';'+im.style;
                itemHtmls.push(getCode(im.id,'border-'+im.region,im.style,im.html));
                im.split = im.split ? 1 : 0;
                if (im.collapsible || im.split) {
                    var barid = im.id+'-bar';
                    borderItemMap[ea+'Split'] = {id:barid};
                    var lrk = 'left';
                    var lid = im.id;
                    var rid = centerid;
                    if (ea=='east') {
                        lrk = 'right';
                        lid = centerid;
                        rid = im.id;
                    }

                    var lrk = ea=='west' ? 'left' : 'right';
                    itemHtmls.push('<div id="'+barid+'" style="'+lrk+':'+width+';width:'+splitWidth+'px;" '+
                            'class="mwt-layout-border-split-vertical" '+
                            'data-targetl="'+lid+'" data-targetr="'+rid+'" data-split="'+im.split+'"></div>');
                    width = getCssLengh(parseInt(width)+splitWidth);
                }
                sideWidthMap[ea] = width;
            }
        }

        // center
        var im = borderItemMap['center'];
        if (!im.style) im.style='';
        im.style='left:'+sideWidthMap['west']+';right:'+sideWidthMap['east']+';'+im.style;
        itemHtmls.push(getCode(im.id,'border-'+im.region,im.style,im.html));

        jQuery('#'+_id).html(itemHtmls.join(''));


        // 垂直分割框
        jQuery('.mwt-layout-border-split-vertical').unbind('mousedown').mousedown(ewResize);


        console.log(borderItemMap);
        console.log(itemHtmls);
        console.log('#'+id);
    }


    // 左右分隔resize
    function ewResize(e)
    {
        var jts = jQuery(this);
        var targetL = jts.data('targetl');
        var targetR = jts.data('targetr');
        var jl = jQuery('#'+targetL);
        var jr = jQuery('#'+targetR);

        var split = jts.data('split');
        if (!split) return;

        var xs = e.clientX;  //!< 起点x
        var left = jts.css('left');
        var right = jts.css('right');

        var jp = jts.parent();

        jp.mousemove(function(e){
            var x = e.clientX;
            var wOff = x-xs;
            if (jts.css('left')!='auto') {
                var bl = parseInt(left)+wOff;
                if (bl<0) bl=0;     //!< 越界
                jts.css({left:bl+'px'});
                jl.css({width:bl+'px'});
                jr.css({left:bl+splitWidth+'px'});
            } else {
                wOff = xs-x;
                var bl = parseInt(right)+wOff;
                jts.css({'right':parseInt(right)+wOff+'px'});
                jr.css({width:bl+'px'});
                jl.css({right:bl+splitWidth+'px'});
            }
        })
        .mouseup(function(){
            jp.unbind('mousemove');
        });
    }

    this.collapseWest=function(){        
    };


    this.init=function(){
        var itemHtmls = [];
        /*if (items.length && layout=='border') {
            layoutBorder(id,items);
        } else {*/
        if (html) { itemHtmls.push(html); }
        //}
        var code = getCode(id,layout,style,itemHtmls.join(''));
        jQuery('#'+render).html(code);


        if (items.length && layout=='border') {
            layoutBorder(id,items);
        }
    };
};
MWT.extends(MWT.Viewport, MWT.Event);
