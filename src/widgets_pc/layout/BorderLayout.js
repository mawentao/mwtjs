/** 
 * BorderLayout.js, (c) 2017 mawentao 
 * @class MWT.BorderLayout
 * @extends MWT.Layout
 **/
MWT.BorderLayout=function(opt)
{
    this.listeners={};
    var items=[];
    var borderItemMap;
    var splitStyle = ''; //!< 分割线样式
    var splitWidth = 7;  //!< 分割线宽度
    if(opt){
        this.construct(opt);
        if(opt.items)items=opt.items;
        if(opt.splitStyle)splitStyle=opt.splitStyle;
        if(opt.splitWidth)splitWidth=opt.splitWidth;
    }

    this.init=function()
    {
        var style = this.style ? ' style="'+this.style+'"' : '';
        var code = '<div id="'+this.id+'" class="mwt-layout-border"'+style+'>'+this.html+'</div>';
        jQuery('#'+this.render).html(code);
        if (items.length) {
            layoutItems(this.id);
        }
    };

    // 获取css的合法长度值
    function getCssLengh(num) { return /[%|px]$/i.test(num) ? num : num+'px'; }

    // 获取HTML代码
    function getCode(_id,_layout,_style,_html,_cls)
    {/*{{{*/
        var id = _id=='' ? '' : ' id="'+_id+'"';
        var cls = _layout=='' ? 'mwt-layout-fit' : 'mwt-layout-'+_layout;
        if (_cls && _cls!="") cls+=" "+_cls;
        var style = _style ? ' style="'+_style+'"' : '';
        var html = _html ? _html : '';
        return '<div'+id+' class="'+cls+'"'+style+'>'+html+'</div>';
    }/*}}}*/

    // 布局子元素(先垂直布局,再水平布局)
    function layoutItems(containerId)
    {/*{{{*/
        var centerId = containerId+'-center';
        borderItemMap={};
        for (var i=0;i<items.length;++i) {
            var im = items[i];
            if (!im.region) im.region='center';
            if (!im.id) im.id = containerId+'-'+im.region;
            if (im.region=='center') centerId=im.id;
            borderItemMap[im.region] = im;
        }
        if (!borderItemMap['center']) {
            borderItemMap['center'] = {id:centerId};
        }
        if (borderItemMap['north'] || borderItemMap['south']) {
            containerId = layoutVerticalItems(containerId);
        }
        if (containerId!=centerId) {
            layoutHorizontalItems(containerId,centerId);
        }
    }/*}}}*/

    // 垂直布局
    function layoutVerticalItems(containerId,centerId)
    {/*{{{*/
        // 如果有west或east,需要一个辅助center
        if (borderItemMap['west']||borderItemMap['east']) {
            centerId = containerId+'-nscenter';
        }
        var res = centerId;
        // 
        var itemHtmls = [];
        var sideHeightMap = {
            north: 0,
            south: 0
        };
        for (var ns in sideHeightMap) {
            if (borderItemMap[ns]) {
                var im = borderItemMap[ns];
                var height = getCssLengh(im.height);
                if (!im.style) im.style='';
                im.style='height:'+height+';'+im.style;
                itemHtmls.push(getCode(im.id,'border-'+im.region,im.style,im.html,im.cls));
                im.split = im.split ? 1 : 0;
                if (im.collapsible || im.split) {
                    var barid = im.id+'-bar';
                    borderItemMap[ns+'Split'] = {id:barid};
                    var lrk = 'top';
                    var lid = im.id;
                    var rid = centerId;
                    var icon = 'icon icon-up';
                    if (ns=='south') {
                        lrk = 'bottom';
                        lid = centerId;
                        rid = im.id;
                        icon = 'icon icon-down';
                    }

                    var lrk = ns=='north' ? 'top' : 'bottom';
                    var cursor = im.split ? 'ns-resize' : 'pointer';

                    var collapseBtn = '';
                    if (im.collapsible) {
                        collapseBtn = '<button class="mwt-layout-border-collapse-horizontal '+icon+'" '+
                            'data-targets="'+im.id+'" data-targetc="'+centerId+'" data-height="'+im.height+'"></button>';
                    }

                    itemHtmls.push('<div id="'+barid+'" '+
                        'style="'+lrk+':'+height+';height:'+splitWidth+'px;cursor:'+cursor+';'+splitStyle+'" '+
                        'class="mwt-layout-border-split-horizontal" '+
                        'data-targetl="'+lid+'" data-position="'+ns+'" data-targetr="'+rid+'" data-split="'+im.split+'">'+collapseBtn+'</div>');
                    height = getCssLengh(parseInt(height)+splitWidth);
                }
                sideHeightMap[ns] = height;
            }
        }
        // center
        var centerStyle = 'top:'+sideHeightMap['north']+';bottom:'+sideHeightMap['south']+';';
        if (borderItemMap['west']||borderItemMap['east']) {
            itemHtmls.push(getCode(centerId,'border-center',centerStyle));
        } else {
            var im = borderItemMap['center'];
            if (!im.style) im.style='';
            im.style = centerStyle+im.style;
            itemHtmls.push(getCode(im.id,'border-'+im.region,im.style,im.html,im.cls));
        }
        // show
        jQuery('#'+containerId).html(itemHtmls.join('')).css({'overflow-y':'hidden'});
        // 水平分割框
        jQuery('.mwt-layout-border-split-horizontal').unbind('mousedown').mousedown(nsResize);
        // 水平折叠
        jQuery('.mwt-layout-border-collapse-horizontal').mousedown(function(e){e.stopPropagation();})
            .unbind('click').click(nsCollapse);
        return res;
    }/*}}}*/

    // 水平布局
    function layoutHorizontalItems(containerId,centerId)
    {/*{{{*/
        var itemHtmls = [];
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
                    var rid = centerId;
                    var icon = 'icon icon-left';
                    if (ea=='east') {
                        lrk = 'right';
                        lid = centerId;
                        rid = im.id;
                        icon = 'icon icon-right';
                    }
                    var cursor = im.split ? 'ew-resize' : 'pointer';

                    var collapseBtn = '';
                    if (im.collapsible) {
                        collapseBtn = '<button class="mwt-layout-border-collapse-vertical '+icon+'" '+
                            'data-targets="'+im.id+'" data-targetc="'+centerId+'" data-width="'+im.width+'"></button>';
                    }

                    itemHtmls.push('<div id="'+barid+'" '+
                        'style="'+lrk+':'+width+';width:'+splitWidth+'px;cursor:'+cursor+';'+splitStyle+'" '+
                        'class="mwt-layout-border-split-vertical" '+
                        'data-targetl="'+lid+'" data-position="'+ea+'" data-targetr="'+rid+'" data-split="'+im.split+'">'+collapseBtn+'</div>');
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
        // show
        jQuery('#'+containerId).html(itemHtmls.join('')).css({'overflow-x':'hidden'});
        // 垂直分割框
        jQuery('.mwt-layout-border-split-vertical').unbind('mousedown').mousedown(ewResize);
        // 垂直折叠
        jQuery('.mwt-layout-border-collapse-vertical').mousedown(function(e){e.stopPropagation();})
            .unbind('click').click(ewCollapse);
    }/*}}}*/

    // 左右分隔resize
    function ewResize(e)
    {/*{{{*/
        //1. 判断是否可split
        var jts = jQuery(this);
        var split = jts.data('split');
        if (!split) return;

        //2. move
        var targetL = jts.data('targetl');
        var targetR = jts.data('targetr');
        var jl = jQuery('#'+targetL);
        var jr = jQuery('#'+targetR);

        var xs = e.clientX;  //!< 起点x
        var left = jts.css('left');
        var right = jts.css('right');

        //3. 需要一个辅助的透明层
        var transparentDivId = jts.attr('id')+'-movediv';
        if (!mwt.$(transparentDivId)) {
            jts.parent().append('<div id="'+transparentDivId+'" class="mwt-layout-fill" style="z-index:9527;cursor:ew-resize;"></div>');
        }
        var jp = jQuery('#'+transparentDivId);
        
        jp.show()
        .mousemove(function(e){
            e.stopPropagation();
            var x = e.clientX;
            var wOff = x-xs;
            if (jts.data('position')=='west') {
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
            jp.hide();
        });
    }/*}}}*/

    // 上下分隔resize
    function nsResize(e)
    {/*{{{*/
        //1. 判断是否可split
        var jts = jQuery(this);
        var split = jts.data('split');
        if (!split) return;

        //2. move
        var targetL = jts.data('targetl');
        var targetR = jts.data('targetr');
        var jl = jQuery('#'+targetL);
        var jr = jQuery('#'+targetR);
        var xs = e.clientY;  //!< 起点y
        var left = jts.css('top');
        var right = jts.css('bottom');
        //var jp = jts.parent();

        //3. 需要一个辅助的透明层
        var transparentDivId = jts.attr('id')+'-movediv';
        if (!mwt.$(transparentDivId)) {
            jts.parent().append('<div id="'+transparentDivId+'" class="mwt-layout-fill" style="z-index:9527;cursor:ns-resize;"></div>');
        }
        var jp = jQuery('#'+transparentDivId);
        jp.show()
        .mousemove(function(e){
            var x = e.clientY;
            var wOff = x-xs;
            if (jts.data('position')=='north') {
                var bl = parseInt(left)+wOff;
                if (bl<0) bl=0;     //!< 越界
                jts.css({top:bl+'px'});
                jl.css({height:bl+'px'});
                jr.css({top:bl+splitWidth+'px'});
            } else {
                wOff = xs-x;
                var bl = parseInt(right)+wOff;
                jts.css({bottom:parseInt(right)+wOff+'px'});
                jr.css({height:bl+'px'});
                jl.css({bottom:bl+splitWidth+'px'});
            }
        })
        .mouseup(function(){
            jp.unbind('mousemove');
            jp.hide();
        });
    }/*}}}*/

    // 左右折叠
    function ewCollapse()
    {/*{{{*/
        var jbar = jQuery(this).parent();
        var targets = jQuery(this).data('targets');
        var targetc = jQuery(this).data('targetc');
        var orginalWidth = jQuery(this).data('width');
        var jside = jQuery('#'+targets);
        var jcenter = jQuery('#'+targetc);
        var sideWidth = jside.width();
        var bl = sideWidth<=0 ? orginalWidth : 0;
        var sidePosition = jside.hasClass('mwt-layout-border-east') ? 'right' : 'left';
        if (sidePosition=='left') {
            if (bl==0) {
                jQuery(this).removeClass('icon-left').addClass('icon-right');
            } else {
                jQuery(this).removeClass('icon-right').addClass('icon-left');
            }
            jbar.css({left:bl+'px'});
            jside.css({width:bl+'px'});
            jcenter.css({left:bl+splitWidth+'px'});
        } else {
            if (bl==0) {
                jQuery(this).removeClass('icon-right').addClass('icon-left');
            } else {
                jQuery(this).removeClass('icon-left').addClass('icon-right');
            }
            jbar.css({right:bl+'px'});
            jside.css({width:bl+'px'});
            jcenter.css({right:bl+splitWidth+'px'});
        }
    }/*}}}*/

    // 上下折叠
    function nsCollapse()
    {/*{{{*/
        var jbar = jQuery(this).parent();
        var targets = jQuery(this).data('targets');
        var targetc = jQuery(this).data('targetc');
        var orginalHeight = jQuery(this).data('height');
        var jside = jQuery('#'+targets);
        var jcenter = jQuery('#'+targetc);
        var sideHeight = jside.height();
        var bl = sideHeight<=0 ? orginalHeight : 0;
        var sidePosition = jside.hasClass('mwt-layout-border-south') ? 'bottom' : 'top';
        if (sidePosition=='top') {
            if (bl==0) {
                jQuery(this).removeClass('icon-up').addClass('icon-down');
            } else {
                jQuery(this).removeClass('icon-down').addClass('icon-up');
            }
            jbar.css({top:bl+'px'});
            jside.css({height:bl+'px'});
            jcenter.css({top:bl+splitWidth+'px'});
        } else {
            if (bl==0) {
                jQuery(this).removeClass('icon-down').addClass('icon-up');
            } else {
                jQuery(this).removeClass('icon-up').addClass('icon-down');
            }
            jbar.css({bottom:bl+'px'});
            jside.css({height:bl+'px'});
            jcenter.css({bottom:bl+splitWidth+'px'});
        }
    }/*}}}*/


};
MWT.extends(MWT.BorderLayout,MWT.Layout);
