/**
 * MWT入口文件
 **/

require('./mwt.css');

window.MWT = {
    // 版本号
	'version' : 'MWT_VERSION',
    // 全局配置
    'config'  : {
        log_level: 3 //!< DEBUG:3; INFO:2,3; WARN:1,2,3; 0:关闭LOG
    }
};
window.mwt = window.MWT;

require('./core/log.js');
require('./core/php.js');
require('./core/core.js');
require('./core/event.js');

require('./data/index.js');

require('./widgets_common/button.js');
require('./widgets_common/icon.js');

require('./field/Field.js');

require('./widgets_pc/index.js');

console.log(mwt.config);
console.log('mwt.js(v'+mwt.version+') loaded success!');
