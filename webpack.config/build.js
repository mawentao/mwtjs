/**
 * webpack config file for build
 **/
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlwebpackPlugin = require('html-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var autoprefixer = require('autoprefixer');

/* 常量定义*/
const ROOT_PATH = path.resolve(__dirname)+"/../";
const SRC_PATH  = path.resolve(ROOT_PATH, 'src');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
    entry: {
		mwt: path.resolve(SRC_PATH, 'mwt.js'),
        mwt_mobile: path.resolve(SRC_PATH, 'mwt_mobile.js'),
    },
    output: {
        filename: '[name].min.js',
        path: DIST_PATH,
    },
    module: {
		loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader?presets[]=es2015&presets[]=react'],
                exclude: /node_modules/
            },
            {   
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.less$/,
                loader: 'style!css!postcss!less'
            },
            {
                test: /\.(woff|woff2|svg|eot|ttf)\??.*/,
                loader: 'file?name=./fonts/[name].[ext]'
            }
        ]
    },
    postcss: [
        autoprefixer({
            browsers: [
                'Android >= 4',
                'iOS >= 7',
                'last 2 ChromeAndroid versions',
                'last 2 FirefoxAndroid versions',
                'ExplorerMobile >= 10'
            ]
        })
    ],
    resolve:{
        extensions:['','.js','.json']
    },
    plugins: [
		new ExtractTextPlugin('[name].min.css')
    ]
};
