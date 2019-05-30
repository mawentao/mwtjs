/* 开发时启用的Server配置 */

var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');

const COMMON_CONFIG = require('./build');

const DEV_CONFIG = merge(COMMON_CONFIG,{
    output: {
        publicPath: '/dist/',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './',
        inline: true,
        hot: true
    },
})
module.exports = DEV_CONFIG
