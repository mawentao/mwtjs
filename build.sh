#!/bin/bash

####################################################
# @file:   build.sh
# @author: mawentao(mawt@youzu.com)
# @create: 2015-12-28 11:59:18
# @modify: 2015-12-28 11:59:18
# @brief:  build.sh
####################################################

version=3.3
product=mwt
author="mawentao"
date=`date +"%Y-%m-%d %H:%M:%S"`
output=./static
src=./src

if [ ! -d $output ];then
    mkdir $output
fi

function mergejs()
{
    file=$product".min.js"
    uglifyjs $@ -m -o $output/$file
    note="/*! $file v$version | (c) 2013-2016,$author | release:$date */"
    cmd=1i\\$note
    sed -i "$cmd" $output/$file
}

function mergecss()
{
	file=$product".min.css"
    cleancss $@ --s0 --skip-rebase -o $output/$file
    note="/*! $file v$version | (c) 2013-2016,$author | release:$date */"
    cmd=1i\\$note
    sed -i "$cmd" $output/$file   
}

function mergejs_mobile()
{
    file=$product"_mobile.min.js"
    uglifyjs $@ -m -o $output/$file
    note="/*! $file v$version | (c) 2013-2016,$author | release:$date */"
    cmd=1i\\$note
    sed -i "$cmd" $output/$file
}

function mergecss_mobile()
{
	file=$product"_mobile.min.css"
    cleancss $@ --s0 --skip-rebase -o $output/$file
    note="/*! $file v$version | (c) 2013-2016,$author | release:$date */"
    cmd=1i\\$note
    sed -i "$cmd" $output/$file   
}

mergejs \
$src/common/*.js \
$src/mwt.js \
$src/mwt-event.js \
$src/mwt-popover.js \
$src/mwt-store.js \
$src/mwt-field.js \
$src/fields/*.js \
$src/mwt-widget.js \
$src/widgets/*.js \
$src/mwt-form.js \
$src/mwt-tree.js \
$src/mwt-bar.js \
$src/mwt-grid.js \
$src/mwt-nav.js \
$src/pc/*.js

mergecss \
$src/*.css \
$src/css/*.css \
$src/pc/*.css \
$src/fields/form.css \
$src/fontawesome/*.css \
$src/widgets/*.css 

#libs/iscroll/iscroll.js \
mergejs_mobile \
$src/common/*.js \
$src/mwt.js \
$src/mwt-event.js \
$src/mobile/mwt-store.js \
$src/mobile/mwt-h5page.js \
$src/mobile/mwt-sidebar.js \
$src/mobile/mwt-h5bar.js \
$src/mobile/mwt-h5navbar.js \
$src/mobile/mwt-listview.js \
$src/mobile/mwt-slide.js \
$src/mobile/scrollbar.js \
$src/mobile/swiper.jquery.min.js \
$src/mwt-form.js \
$src/mwt-field.js \
$src/mwt-popover.js \
$src/fields/*.js \
$src/mobile/mwt-alert.js \
$src/mwt-widget.js \
$src/mobile/widgets/*.js \
$src/mobile/mwt-h5dialog.js 

mergecss_mobile \
$src/mobile/css/*.css \
$src/mobile/weui.css \
$src/mobile/mwt_mobile.css \
$src/fontawesome/*.css \
$src/css/*.css \
$src/mobile/swiper.css \
$src/fields/form.css \
$src/mwt-popover.css \
$src/mobile/widgets/*.css

cp -r $src/imgs $output/
cp -r $src/fontawesome/fonts $output/

############################################

rm -rf output
mkdir -p output/mwtjs/$version/
cp -r $src/imgs output/mwtjs/$version/
cp -r $src/fontawesome/fonts output/mwtjs/$version/
cp -r $output/$product".min.js" output/mwtjs/$version/
cp -r $output/$product".min.css" output/mwtjs/$version/
cp -r $output/$product"_mobile.min.js" output/mwtjs/$version/
cp -r $output/$product"_mobile.min.css" output/mwtjs/$version/
cd output; zip -r mwtjs-"$version".zip mwtjs
cd ..

exit 0
