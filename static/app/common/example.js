define(function(require){
    var exampleAreaId = 'example-area';
    var o={};

    o.show=function(file) {
        if (!mwt.$(exampleAreaId)) {
            var code = '<iframe id="'+exampleAreaId+'" class="example-iframe"/>';
            jQuery('#frame-center').html(code);
        }
        jQuery('#'+exampleAreaId).attr('src','examples/'+file);
    };

    return o;
});
