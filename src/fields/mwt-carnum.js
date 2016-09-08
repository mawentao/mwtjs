/* 车牌号码输入控件 */
MWT.CarNumberField=function(opt)
{
    this.listeners={};
    var areas="京沪苏浙粤川津渝鄂赣冀蒙鲁辽吉皖湘黑琼贵桂云藏陕甘宁青豫闽新晋";
    var alpas="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var fid,sid,tid;
	var thiso=this;
    var errpop;
    if(opt)
	{
        this.construct(opt);
        //if(this.id=="")this.id=this.render+"sel";
        fid=this.render+"fsel";
        sid=this.render+"ssel";
        tid=this.render+"txt";
	}

    function getAreaSelect() {
        var code = '<select id="'+fid+'" class="form-control" '+
             'style="display:inline-block;width:auto;height:28px;">';
        for (var i=0;i<areas.length;++i) {
            var c=areas.charAt(i);
            code += '<option value="'+c+'">'+c+"</option>";
        }
        code += "</select>";
        return code;
    }

    function getAlphaSelect() {
        var code = '<select id="'+sid+'" class="form-control" '+
             'style="display:inline-block;width:auto;height:28px;margin:0 5px;">';
        for (var i=0;i<alpas.length;++i) {
            var c=alpas.charAt(i);
            code += '<option value="'+c+'">'+c+"</option>";
        }
        code += "</select>";
        return code;
    }

    // create
    this.create=function(){
        var code = getAreaSelect()+getAlphaSelect()+
             '<input type="text" id="'+tid+'" value="" class="form-control" placeholder="车牌号码后5位"'+
             ' style="display:inline-block;width:auto;padding:0 5px;width:100px;">';
        jQuery("#"+this.render).html(code);
        errpop = new MWT.Popover({anchor:tid,html:"请输入车牌号码后5位",cls:"mwt-popover-danger"});

        this.setValue(this.value);
        // bundle event
        jQuery("#"+fid).change(change);
        jQuery("#"+sid).change(change);
        jQuery("#"+tid).change(change);
    };

    function change() {
        errpop.hide();
        thiso.value = get_select_value(fid) + get_select_value(sid) + get_value(tid);
        thiso.fire("change");
    };

    this.setValue=function(v){
        if (v=="") {
            this.value=v;
            set_value(tid,'');
        }
        if (v.length!=7) return;
        var f = v.charAt(0);
        var s = v.charAt(1);
        var t = v.substring(2);
        set_select_value(fid,f);
        set_select_value(sid,s);
        set_value(tid,t);
        this.value=v;
    };

    this.validate=function() {
        errpop.hide();
        var t = get_value(tid);
        var reg = /^[A-Za-z0-9]{5}$/;
        if (!reg.test(t)) {
            errpop.pop();
            jQuery("#"+tid).focus();
            setTimeout(errpop.hide,2000);
            return false;
        }
        return true;
    };
};
MWT.extends(MWT.CarNumberField, MWT.Field);
