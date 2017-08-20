define(function(require){
    var o = {};
	o.execute = function(domid) {
		//require('./grid').init(domid);
		var code = '<div id="dbs-panel1-'+domid+'" class="fill-layout" style="right:61%;">aaa</div>'+
			'<div id="dbs-panel2-'+domid+'" class="fill-layout" style="left:40%;background:#f2f2f2;">bbb</div>';
		jQuery("#"+domid).html(code).css({background:'#f2f2f2'});

		require('./grid_db').init('dbs-panel1-'+domid);
		require('./grid_table').init('dbs-panel2-'+domid);
		
	};
    return o;
});
