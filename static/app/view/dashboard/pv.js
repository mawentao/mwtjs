define(function(require){
    var o = {};
	o.execute = function(board) {
        ajax.post('opus&action=pv', {b : board.board_id}, function (res) {
            if (res.retcode != 0){
            	console.log('pv fail');
            }
        });
	};
    return o;
});
