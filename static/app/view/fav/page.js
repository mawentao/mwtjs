define(function(require){
    var o = {};

    o.execute = function(domid) {
       require('./grid').init(domid);
    };

    o.button = function(domid, type, id, style) {

        function toggle(status, type, id){
            if(status){
                jQuery('#fav_button_add').hide();
                jQuery('#fav_button_remove').show();
            }else{
                jQuery('#fav_button_add').show();
                jQuery('#fav_button_remove').hide();
            }
        }

        function add(type, oid){
            var params = {
                type : type,
                oid : oid
            };
            return function() {
                ajax.post('fav&action=add', params, function (res) {
                    if (res.retcode != 0) mwt.notify(res.retmsg, 1500, 'danger');
                    else {
                        mwt.notify('收藏成功', 1500, 'success');
                        toggle(true, type, oid);
                    }
                });
            }
        }

        function remove(type, oid){
            var params = {
                type : type,
                oid : oid
            };
            return function() {
                ajax.post('fav&action=remove', params, function (res) {
                    if (res.retcode != 0) mwt.notify(res.retmsg, 1500, 'danger');
                    else {
                        mwt.notify('取消收藏成功', 1500, 'success');
                        toggle(false, type, oid);
                    }
                });
            }
        }

        if(style === undefined){
            style = 'button';
        }
        var params = {
            type : type,
            oid : id
        };
        var html;
        if(style === 'button'){
            html = '<button id="fav_button_add_'+type+'_'+id+'" class="mwt-btn mwt-btn-primary">' +
                '<i class="fa fa-plus"></i>' +
                '<span style="font-size:12px">添加收藏</span>' +
                '</button>' +
                '<button id="fav_button_remove_'+type+'_'+id+'" class="mwt-btn mwt-btn-primary">' +
                '<i class="fa fa-minus"></i>' +
                '<span style="font-size:12px">取消收藏</span>' +
                '</button>';
        }else if(style === 'star'){
            html = '<span id="fav_button_add_'+type+'_'+id+'"><i class="fa fa-star-o"></i>添加收藏</span>' +
                '<span id="fav_button_remove_'+type+'_'+id+'"><i style="color:#0FB4F2" class="fa fa-star"></i>取消收藏</span>';
        }else if(style === 'link'){
            html = '<a href="javascript:void(0);" id="fav_button_add" style="font-size: 12px" class="favlink">[添加收藏]</a>' +
                '<a href="javascript:void(0);" id="fav_button_remove" style="font-size: 12px" class="favlink">[取消收藏]</a>';
        }
        var addfun = add(type, id);
        var removefun = remove(type, id);
        ajax.post('fav&action=exists',params,function(res){
            if (res.retcode!=0) mwt.notify(res.retmsg,1500,'danger');
            else {
                jQuery('#'+domid).html(html);
                jQuery('#fav_button_add').unbind('click').click(addfun);
                jQuery('#fav_button_remove').unbind('click').click(removefun);
                toggle(res.data, type, id);
            }
        });
    };



    return o;
});
