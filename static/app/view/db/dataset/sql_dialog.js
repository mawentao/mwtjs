/* 查看SQL语句 */
define(function(require){
	var dialog,sql_statement;

	function init() {
		dialog = new MWT.Dialog({
			title  : 'SQL语句',
			width  : 600,
			height : 450,
			top    : 50,
			//animate: 'zoomIn',
			body   : '<div id="sql-statement-vew-dialog-div"></div>'
		});
		dialog.on('open',function(){
			var domid = 'sql-statement-vew-dialog-div';
			jQuery('#'+domid).html('<pre class="autobr"><code>'+sql_statement.replace(/[\r|\n]/g,'<br>')+'</code></pre>');
			require('highlight').highlightBlock(mwt.$(domid));
		});
	}

	var o={};
	o.open=function(_sqlstatement){
		sql_statement=_sqlstatement;
		if (!dialog) init();
		dialog.open();
	};
	return o;
});
