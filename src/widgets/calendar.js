/* 日历组件 */
MWT.CalendarWidget=function(opt)
{
    this.listeners={};
    var cellHeight = 50;
	var cellStyle='';
    var cadomid,titleid,lbtnid,rbtnid,nbtnid,cellname;
    var thiso,datelist,curmonth,today;
    if (opt) {
        this.construct(opt);
        if (opt.cellHeight) cellHeight=opt.cellHeight;
		if (opt.cellStyle) cellStyle=opt.cellStyle;
        cadomid=this.render+'-cal';
        titleid=this.render+'-tt';
        lbtnid=this.render+'-lb';
        rbtnid=this.render+'-rb';
        nbtnid=this.render+'-nb';
        cellname=this.render+'-cell';
        thiso = this;
    }

    this.create = function()
    {
        var wks = ['日','一','二','三','四','五','六'];
        var btncls = 'mwt-btn mwt-btn-default mwt-btn-xs';
        var size = 'width:40px;height:30px;';
        var leftbtn = '<button id="'+lbtnid+'" class="'+btncls+'" '+
                        'style="border-top-left-radius:30px;border-bottom-left-radius:30px;'+size+'">'+
                        '<i class="fa fa-angle-left" style="font-size:20px;"></i></button>';
        var rightbtn = '<button id="'+rbtnid+'" class="'+btncls+'" '+
                        'style="border-top-right-radius:30px;border-bottom-right-radius:30px;'+size+'">'+
                        '<i class="fa fa-angle-right" style="font-size:20px;"></i></button>';
        var nbtn = '<button id="'+nbtnid+'" class="'+btncls+'" style="height:30px;font-size:15px;width:50px;">本月</button>';
        var code = '<div class="mwt-calendar">'+
              '<div class="mwt-btn-group">'+leftbtn+nbtn+rightbtn+'</div>'+
              '<div id="'+titleid+'" class="title"></div>'+
            '</div>'+
            '<table class="mwt-calendar-table"><thead><tr>';
        for (var i=0; i<wks.length; ++i)
            code += '<td>'+wks[i]+'</td>';
        code += '</tr></thead><tbody id="'+cadomid+'"></tbody></table>';
        jQuery('#'+this.render).html(code);
        jQuery('#'+lbtnid).click(function(){thiso.prev();});
        jQuery('#'+rbtnid).click(function(){thiso.next();});
        jQuery('#'+nbtnid).click(function(){curmonth=date('Y-m');showCalendar();});

        today = date("Y-m-d");
        curmonth = date("Y-m");
        showCalendar();
    };

	this.getCell = function(date) {
		return jQuery('#'+cellname+'-'+date).html();
	};

    this.setCell = function(date,code) {
        jQuery('#'+cellname+'-'+date).html(code);
    };

    this.appendCell = function(date,code) {
        jQuery('#'+cellname+'-'+date).append(code);
    };

    this.getDateList = function() {
        return datelist;
    };

    this.next = function() {
        var tm = strtotime(curmonth+'-01');
        tm += 32*86400;
        curmonth = date('Y-m',tm);
        showCalendar();
    };

    this.prev = function() {
        var tm = strtotime(curmonth+'-01');
        tm -= 86400;
        curmonth = date('Y-m',tm);
        showCalendar();
    };

    function showCalendar()
    {
        datelist = getTimeList(curmonth);
        // title
        var tm = strtotime(curmonth);
        var tt = date('Y年m月', tm);
        var cm = date('m',tm);
        jQuery('#'+titleid).html(tt);
        // calendar
        var code = "";
        for (var i=0; i<datelist.length; ++i) {
            var tdcls = '';
            var im = datelist[i];
            if (im.week==0) code +='<tr>';
            if (im.date==today) tdcls +=' today';
            if (im.month!=cm) tdcls +=' misday';
            code += '<td class="'+tdcls+'" style="height:'+cellHeight+'px">'+
                '<div id="'+cellname+'-'+im.date+'" style="'+cellStyle+'" class="cell-body"></div>'+
                '<div class="cell-date">'+im.day+'</div></td>';
            if(im.week==6) code += '</tr>';
        }
        jQuery('#'+cadomid).html(code);
        thiso.fire('refresh');
    }

    function getTimeList(ym) {
        var res = [];
        var mfday = ym+"-01";
        var mfdt = new Date(mfday);
        var w = mfdt.getDay();
        var tm = strtotime(mfday);
        var st = tm - (w+1)*86400;
        var curm = date('m', tm);
        // 最多6行
        for (var i=0; i<6; ++i) {
            for (k=0;k<7;++k) {
                st += 86400;
                res.push({
                    week: k,
                    day: date('d', st),
                    month: date('m', st),
                    date: date('Y-m-d', st)
                });
            }
            if (date('m', st)!=curm) break;
        }
        return res;
    }
    
};
MWT.extends(MWT.CalendarWidget,MWT.Widget);
