/**
 * MWT入口文件
 **/

require('./mwt.css');

window.MWT = {
	'version' : 'MWT_VERSION'
};
window.mwt = window.MWT;

require('./core/php.js');
require('./core/core.js');
require('./core/event.js');

require('./widgets_common/button.js');
require('./widgets_common/icon.js');


require('./widgets_pc/layout/Layout.js');


