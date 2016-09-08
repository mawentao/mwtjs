/* 评分控件, (c) 2016 mawentao */
MWT.RatingField=function(opt)
{
    this.listeners={};
    var render;
    var starname = '';
    var vid='';
    var notes = {
        1: '',
        2: '',
        3: '',
        4: '',
        5: ''
    };
    var starStyle = '';
    var noteStyle = '';
    if(opt) {
        this.construct(opt);
        if(opt.starStyle) starStyle=opt.starStyle;
        if(opt.noteStyle) noteStyle=opt.noteStyle;
        if(opt.notes) notes=opt.notes;
    }

    // 必须定义
    this.create=function() {
        var code = "<div class='"+this.cls+"' style='"+this.style+"'>";
        vid = this.render+"vdiv";
        starname = this.render+"star";
        for (var i=1; i<=5; i++) {
            code += '<i name="'+starname+'" id="'+starname+i+'" data-id="'+i+'" class="fa fa-star-o" style="cursor:pointer;'+starStyle+'"></i>';
        }
        code += '<span id="'+vid+'" style="'+noteStyle+'"></span>';
        code += "</div>";
        jQuery("#"+this.render).html(code);
        //event
        var thiso=this;
        jQuery('[name='+starname+']').click(function(){
            var score = jQuery(this).data('id');
            thiso.setValue(score); 
            thiso.fire("change");
        });
        this.reset();
    };

    // 必须定义
    this.setValue = function(score) {
        this.value = score;
        for (var i=1; i<=5; ++i) {
            if (i<=score) {
                jQuery("#"+starname+i).removeClass('fa-star-o');
                jQuery("#"+starname+i).addClass('fa-star');
            } else {
                jQuery("#"+starname+i).removeClass('fa-star');
                jQuery("#"+starname+i).addClass('fa-star-o');
            }
        }
        var note = notes[score] ? notes[score] : '';
        jQuery("#"+vid).html(note);
    };
};
MWT.extends(MWT.RatingField, MWT.Field);
